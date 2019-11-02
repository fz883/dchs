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
	Points int    `json:"points"`
}

var players []Player
var db *scribble.Driver

func getPlayers(w http.ResponseWriter, r *http.Request) {
	players = nil
	fmt.Println("getPlayers")
	w.Header().Set("Content-Type", "application/json")
	records, _ := db.ReadAll("players")
	for _, f := range records {
		playerFound := Player{}
		if err := json.Unmarshal([]byte(f), &playerFound); err != nil {
			fmt.Println("Error unmarshaling player database: ", err)
		}
		players = append(players, playerFound)
	}
	json.NewEncoder(w).Encode(players)
}

func getPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPlayer")
	w.Header().Set("Content-Type", "application/json")
	p := mux.Vars(r)
	for _, item := range players {
		if item.ID == p["id"] {
			json.NewEncoder(w).Encode(item)
			break
		}
		return
	}
	json.NewEncoder(w).Encode(&Player{})
}

func createPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("createPlayer")
	w.Header().Set("Content-Type", "application/json")
	var player Player
	json.NewDecoder(r.Body).Decode(&player)
	fmt.Println(player.Name)
	player.Points = 501
	player.ID = "5"
	db.Write("players", player.Name, player)
	//players = append(players, player)
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
	r.HandleFunc("/api/player/{id}", getPlayer).Methods("GET")
	r.HandleFunc("/api/player", createPlayer).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web/")))

	http.ListenAndServe(":2222", r)
}
