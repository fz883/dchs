package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"path"
	"sort"
	"strconv"
	"strings"
)

func player(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPlayer")
	w.Header().Set("Content-Type", "application/json")
	readPlayers()
	playerID, err := strconv.Atoi(path.Base(r.URL.Path))
	if err != nil {
		log.Println(err)
	}
	for _, p := range players {
		fmt.Println("Want: ", playerID, " Got: ", p.Name, " ", p.ID)
		if p.ID == playerID {
			fmt.Println(p)
			json.NewEncoder(w).Encode(p)
			break
		}
	}
}

func delete(w http.ResponseWriter, r *http.Request) {
	fmt.Println("delete Player")
	w.Header().Set("Content-Type", "application/json")
	readPlayers()
	playerID, err := strconv.Atoi(path.Base(r.URL.Path))
	if err != nil {
		log.Println(err)
	}
	for _, p := range players {
		if p.ID == playerID {
			db.Delete("players", p.Name)
			json.NewEncoder(w).Encode(p)
			break
		}
	}
}

func allplayers(w http.ResponseWriter, r *http.Request) {
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

	sort.Slice(tmpPlayers, func(i, j int) bool {
		return tmpPlayers[i].Order < tmpPlayers[j].Order
	})

	json.NewEncoder(w).Encode(tmpPlayers)
}

func createPlayer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("createPlayer")
	w.Header().Set("Content-Type", "application/json")
	var player Player
	json.NewDecoder(r.Body).Decode(&player)
	fmt.Println(player.Name)
	player.Name = strings.Title(strings.ToLower(player.Name))
	fmt.Println(player.Name)
	readPlayers()
	//return if player exists
	for _, f := range players {
		if player.Name == f.Name {
			return
		}
	}
	//get highest id
	id := 0
	for _, f := range players {
		if f.ID > id {
			id = f.ID
		}
	}
	player.ID = id + 1

	player.Points = gameData.GameMode
	db.Write("players", player.Name, player)
	json.NewEncoder(w).Encode(&player)
}

func setPoints(w http.ResponseWriter, r *http.Request) {
	fmt.Println("set Points")
	w.Header().Set("Content-Type", "application/json")
	var tmpPlayer Player
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&tmpPlayer)
	if err != nil {
		panic(err)
	}
	readPlayers()
	for _, p := range players {
		if p.ID == tmpPlayer.ID {
			p.Score = append(p.Score, p.Points-tmpPlayer.Points)
			//no score
			if p.Points < tmpPlayer.Points {
				if len(p.Score)%3 == 0 {
					p.Score = p.Score[:len(p.Score)-3]
					p.Score = append(p.Score, 0)
					p.Score = append(p.Score, 0)
					p.Score = append(p.Score, 0)
				} else if len(p.Score)%3 == 2 {
					p.Score = p.Score[:len(p.Score)-2]
					p.Score = append(p.Score, 0)
					p.Score = append(p.Score, 0)
				} else if len(p.Score)%3 == 1 {
					p.Score = p.Score[:len(p.Score)-1]
					p.Score = append(p.Score, 0)
				}
			}
			fmt.Println(p.Score)

			p.Points = tmpPlayer.Points
			p.Average = math.Round((float64((gameData.GameMode-p.Points))/float64(len(p.Score))*float64(3.00))*100) / 100
			if p.Points == 0 {
				p.Finished = "true"
			}
			db.Write("players", p.Name, p)
			json.NewEncoder(w).Encode(p)
			break
		}
	}
}

func switchGame(w http.ResponseWriter, r *http.Request) {
	if gameData.GameMode == 501 {
		gameData.GameMode = 301
	} else {
		gameData.GameMode = 501
	}

	readPlayers()
	for _, p := range players {
		p.Points = gameData.GameMode
		db.Write("players", p.Name, p)
	}
}

func resetGame(w http.ResponseWriter, r *http.Request) {
	initGame()

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

func switchActive(w http.ResponseWriter, r *http.Request) {
	fmt.Println("switchActive")
	w.Header().Set("Content-Type", "application/json")
	playerID, err := strconv.Atoi(path.Base(r.URL.Path))
	if err != nil {
		log.Println(err)
	}
	fmt.Println(path.Base(r.URL.Path))
	fmt.Println("PlayerID: ", playerID)
	readPlayers()
	for _, p := range players {
		if p.ID == playerID {
			if p.Status == "inaktiv" {
				p.Status = "aktiv"
				gameData.PlayerLoad++
				p.Order = gameData.PlayerLoad
			} else {
				p.Status = "inaktiv"
			}
			db.Write("players", p.Name, p)
			json.NewEncoder(w).Encode(p)
			break
		}
	}
}
