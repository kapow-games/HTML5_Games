"use strict";

import gameInfo from "../objects/store/GameInfo";
import GameManager from "../controller/GameManager";
import kapowClientController from "../kapow/KapowClientController";

export default function parseRoomAndRedirectToGame() {
    if (!gameInfo.get("room")) {
        console.log("Room is null, hence not redirecting to game");
    }
    else {
        console.log('Parsing Room.');
        let players = gameInfo.get("room").players;
        if (players.length >= 1) {
            gameInfo.set("gameType", 'friend');
            setPlayerData(players);
            parseHistory();
            redirectToGame();
        }
        else {
            console.log("Room not having player...");
        }
    }
};

function setPlayerData(players) {
    if (players[0].id === gameInfo.get("playerData").id) {
        gameInfo.set("opponentData", players[1]);
        gameInfo.set("playerData", players[0]);
    }
    else {
        gameInfo.set("opponentData", players[0]);
        gameInfo.set("playerData", players[1]);
    }
}

function parseHistory() {
    kapowClientController.handleFetchHistorySince(null, 25,
        function (messagesHistory) {
            console.log("History Fetch at CLIENT : ", messagesHistory);
            let history = [];
            for (let i = messagesHistory.length - 1; i >= 0; i--) {
                if (messagesHistory[i].type === "move" && messagesHistory[i].data.type === "move") {
                    history.push(messagesHistory[i]);
                }
                if (messagesHistory[i].type === "outcome") {
                    gameInfo.set("gameOver", true);
                    if (messagesHistory[i].data.type === "result") {
                        if (messagesHistory[i].data.ranks[gameInfo.get("playerData").id] === messagesHistory[i].data.ranks[gameInfo.get("opponentData").id]) {
                            gameInfo.set("turnOfPlayer", 0);
                        }
                        else if (messagesHistory[i].data.ranks[gameInfo.get("playerData").id] === 1) {
                            gameInfo.set("turnOfPlayer", gameInfo.get("opponentData"));
                        }
                        else if (messagesHistory[i].data.ranks[gameInfo.get("playerData").id] === 2) {
                            gameInfo.set("turnOfPlayer", gameInfo.get("playerData"));
                        }
                        else {
                            console.log("Player Turn couldn't be determined");
                        }
                    }
                    else if (messagesHistory[i].data.type === "resignation" || messagesHistory[i].data.type === "timeout") {
                        console.log("Outcome  data :", messagesHistory[i].data.ranks[gameInfo.get("playerData").id]);
                        if (messagesHistory[i].data.ranks[gameInfo.get("playerData").id] === messagesHistory[i].data.ranks[gameInfo.get("opponentData").id]) {
                            gameInfo.set("turnOfPlayer", 0);
                        }
                        else if (messagesHistory[i].data.ranks[gameInfo.get("playerData").id] === 1) {
                            gameInfo.set("turnOfPlayer", gameInfo.get("opponentData"));
                            console.log("Turn of player set to : ", gameInfo.get("opponentData").id);
                        }
                        else if (messagesHistory[i].data.ranks[gameInfo.get("playerData").id] === 2) {
                            gameInfo.set("turnOfPlayer", gameInfo.get("playerData"));
                            console.log("Turn of player set to : ", gameInfo.get("playerData").id);
                        }
                        else {
                            console.log("Player Turn couldn't be determined");
                        }
                    }
                }
            }
            console.log("Move History sorted according to sequence number", history);
            if (history.length > 0) {
                gameInfo.set("boardStatus", {cells: history[0].data.moveData.board});
                if (history[0].senderId === gameInfo.get("playerData").id) {
                    if (gameInfo.get("gameOver") === false) {
                        gameInfo.set("turnOfPlayer", gameInfo.get("opponentData"));
                    }
                }
                else if (history[0].senderId === gameInfo.get("opponentData").id) {
                    if (gameInfo.get("gameOver") === false) {
                        gameInfo.set("turnOfPlayer", gameInfo.get("playerData"));
                    }
                }
                else {
                    if (gameInfo.get("gameOver") === false) {
                        console.log("Current Turn can't be determined");
                    }
                }
            }
            else if (gameInfo.get("gameOver") !== true) {
                gameInfo.set("turnOfPlayer", undefined);
            }
        },
        function () {
            console.log('fetchHistory Failed')
        }
    );
}

function redirectToGame() {
    console.log(gameInfo);
    if (gameInfo.get("opponentData") && gameInfo.get("opponentData").affiliation === "accepted") { // TODO : use constants
        GameManager.startState('PlayLoad');
    }
    else if (gameInfo.get("opponentData") && (gameInfo.get("opponentData").affiliation === "left" ||
            gameInfo.get("playerData").affiliation === "left")) {
        gameInfo.set("gameOver", true);
        GameManager.startState('PlayLoad');
    }
    else {
        console.log("Invitation not accepted by opponent");
        GameManager.startState('Waiting');
    }
}