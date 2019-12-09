package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sdomino/scribble"
)

type Player struct {
	Name     string `json:"name"`
	Status   string `json:"status"`
	Finished string `json:"finished"`
	ID       int    `json:"id"`
	Points   int    `json:"points"`
	Average  int    `json:"avg" `
}

type GameData struct {
	PlayerLoad int
	GameMode   int
}

var gameData GameData
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

func activePlayers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPlayers")
	w.Header().Set("Content-Type", "application/json")
	readPlayers()
	var tmpPlayers []Player
	for _, p := range players {
		if p.Status == "aktiv" {
			tmpPlayers = append(tmpPlayers, p)
		}
	}
	json.NewEncoder(w).Encode(tmpPlayers)
}

func getPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPlayer")
	w.Header().Set("Content-Type", "application/json")
	readPlayers()
	v := mux.Vars(r)
	for _, p := range players {
		fmt.Println(p.Name)
		if p.Name == v["name"] {
			fmt.Println(p)
			json.NewEncoder(w).Encode(p)
			break
		}
	}
}

func setID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("setID")
	w.Header().Set("Content-Type", "application/json")
	var tmpPlayer Player
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&tmpPlayer)
	if err != nil {
		panic(err)
	}
	readPlayers()
	for _, p := range players {
		if p.Name == tmpPlayer.Name {
			p.ID = tmpPlayer.ID
			db.Write("players", p.Name, p)
		}
	}

}

func createPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("createPlayer")
	w.Header().Set("Content-Type", "application/json")
	var player Player
	json.NewDecoder(r.Body).Decode(&player)
	fmt.Println(player.Name)
	player.Points = 501
	readPlayers()
	for _, f := range players {
		if player.Name == f.Name {
			return
		}
	}
	db.Write("players", player.Name, player)
	json.NewEncoder(w).Encode(&player)
}

func updatePlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("updateStatus")
	w.Header().Set("Content-Type", "application/json")
	var player Player
	json.NewDecoder(r.Body).Decode(&player)
	fmt.Println(player)
	db.Write("players", player.Name, player)
	json.NewEncoder(w).Encode(&player)
}

func initGame() {
	readPlayers()
	for _, item := range players {
		item.Points = 501
		item.Status = "inaktiv"
		item.Finished = "false"
		item.ID = 0
		db.Write("players", item.Name, item)
	}
	gameData.PlayerLoad = 0
	gameData.GameMode = 501
}

func main() {
	var err error
	db, err = scribble.New("./", nil)
	if err != nil {
		fmt.Println("Error creating database: ", err)
	}

	initGame()

	r := mux.NewRouter()

	//r.HandleFunc("/<your-url>", <function-name>).Methods("<method>")
	r.HandleFunc("/api/player", getPlayers).Methods("GET")
	r.HandleFunc("/api/player/{name}", getPlayer).Methods("GET")
	r.HandleFunc("/api/active", activePlayers).Methods("GET")
	r.HandleFunc("/api/player/update/{name}", updatePlayer).Methods("POST")
	r.HandleFunc("/api/player", createPlayer).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web/")))

	http.ListenAndServe(":2222", r)
}
