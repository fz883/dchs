package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sdomino/scribble"
)

type Player struct {
	ID     string `json:"id" `
	Name   string `json:"name"`
	Status string `json:"status"`
	Points int    `json:"points"`
}

var players []Player
var db *scribble.Driver

func readPlayers() {
	players = nil
	records, _ := db.ReadAll("players")
	for _, f := range records {
		playerFound := Player{}
		if err := json.Unmarshal([]byte(f), &playerFound); err != nil {
			fmt.Println("Error unmarshaling player database: ", err)
		}
		players = append(players, playerFound)
	}
}

func getPlayers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPlayers")
	w.Header().Set("Content-Type", "application/json")
	readPlayers()
	json.NewEncoder(w).Encode(players)
}

func getPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPlayer")
	w.Header().Set("Content-Type", "application/json")
	readPlayers()
	p := mux.Vars(r)
	fmt.Println(players)
	for _, item := range players {
		fmt.Println(item.Name)
		if item.Name == p["name"] {
			fmt.Println("Match!")
			json.NewEncoder(w).Encode(item)
			break
		}
	}
	//json.NewEncoder(w).Encode(&Player{})
}

func createPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("createPlayer")
	w.Header().Set("Content-Type", "application/json")
	var player Player
	json.NewDecoder(r.Body).Decode(&player)
	fmt.Println(player.Name)
	player.Points = 501
	player.ID = "5"
	readPlayers()
	for _, f := range players {
		if player.Name == f.Name {
			return
		}
	}
	db.Write("players", player.Name, player)
	//players = append(players, player)
	json.NewEncoder(w).Encode(&player)
}

func updatePlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("updateStatus")
	w.Header().Set("Content-Type", "application/json")
	var player Player
	json.NewDecoder(r.Body).Decode(&player)
	db.Write("players", player.Name, player)
	json.NewEncoder(w).Encode(&player)
}

func main() {
	var err error
	db, err = scribble.New("./", nil)
	if err != nil {
		fmt.Println("Error creating database: ", err)
	}

	r := mux.NewRouter()

	//r.HandleFunc("/<your-url>", <function-name>).Methods("<method>")
	r.HandleFunc("/api/player", getPlayers).Methods("GET")
	r.HandleFunc("/api/player/{name}", getPlayer).Methods("GET")
	r.HandleFunc("/api/player/update/{name}", updatePlayer).Methods("POST")
	r.HandleFunc("/api/player", createPlayer).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web/")))

	http.ListenAndServe(":2222", r)
}
