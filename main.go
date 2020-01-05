package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sdomino/scribble"
)

type Player struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Status   string  `json:"status"`
	Finished string  `json:"finished"`
	Points   int     `json:"points"`
	Score    []int   `json:"score"`
	Average  float64 `json:"avg"`
	Order    int     `json:"order"`
	Tries    int     `json:"tries"`
}

type GameData struct {
	PlayerLoad int
	GameMode   int
}

var gameData GameData
var players []Player

func initGame() {
	readPlayers()
	for _, item := range players {
		item.Points = 501
		item.Status = "inaktiv"
		item.Finished = "false"
		item.Order = 0
		item.Average = 0
		item.Score = nil
		item.Tries = 0
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
	r.HandleFunc("/api/delete/{id}", delete).Methods("GET")
	r.HandleFunc("/api/switchGame", switchGame).Methods("GET")
	r.HandleFunc("/api/player", allplayers).Methods("GET")
	r.HandleFunc("/api/player/{id}", player).Methods("GET")
	r.HandleFunc("/api/active", activePlayers).Methods("GET")
	r.HandleFunc("/api/player/select/{id}", switchActive).Methods("POST")
	r.HandleFunc("/api/player", createPlayer).Methods("POST")
	r.HandleFunc("/api/player/points", setPoints).Methods("POST")
	r.HandleFunc("/api/reset", resetGame).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./web/")))

	http.ListenAndServe(":2222", r)
}
