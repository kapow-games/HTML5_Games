'use strict';

import kapowGameStore from "../objects/store/KapowGameStore";
import gameInfo from "../objects/store/GameInfo";
import parseRoomAndRedirectToGame from "./roomRedirect";
import GAME_CONST from "../const/GAME_CONST";
import GameManager from "../controller/GameManager";
import kapowClientController from "../kapow/KapowClientController";

export default function handleGameEnd(value) { // TODO : too big responsiblitly function. Seperate into smaller units
    GameManager.loadResultUI(value);
    if (gameInfo.get("gameOver") === false) {
        updateStats(value);
    }
    if (!gameInfo.get("gameLocked") && gameInfo.get("gameType") === "solo") {
        // To ensure that game doesn't close multiple times in Kapow
        kapowEndSoloGame(value);
    }
}

// TODO : this is not exported ?
export function rematchButtonHandler() {
    console.log('rematchButtonHandler Clicked');
    let tempCells = [];
    for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
        tempCells.push(undefined);
    }
    gameInfo.set("boardStatus", {cells: tempCells});
    gameInfo.set("win", 0);
    gameInfo.set("gameOver", false);
    gameInfo.set("room", null);
    gameInfo.set("playerMark", GAME_CONST.TURN.NONE);
    gameInfo.set("gameResume", false);
    gameInfo.set("gameLocked", false);
    if (gameInfo.get("gameType") === "solo") {
        gameInfo.set("gameLayoutLoaded", false);
        GameManager.startState('Select');//TODO : Mention correct Phaser.Game object
    }
    else if (gameInfo.get("gameType") === "friend") {
        kapowClientController.handleRematch(
            function (room) {
                gameInfo.set("room", room);
                gameInfo.set("playerMark", GAME_CONST.TURN.X);
                gameInfo.set("opponentMark", GAME_CONST.TURN.O);
                gameInfo.set("gameLayoutLoaded", false);
                parseRoomAndRedirectToGame();
                console.log("Rematch Room Created");
            },
            function (error) {
                console.log("Rematch Room creation FAILED.", error);
            }
        );
    }
}


function updateStats(value) {
    kapowGameStore.get("stats", function (statsValue, self) {
        if (statsValue) {
            console.log("Value fetched from gameStore was : ", statsValue);
            let valueJSON = JSON.parse(statsValue);
            console.log(valueJSON);
            let soloStats = valueJSON.soloStats;
            let randomStats = valueJSON.randomStats;
            let friendsStats = valueJSON.friendsStats;
            if (gameInfo.get("gameType") === "solo") {
                if (value === 1) {
                    soloStats.lost += 1;
                }
                else if (value === 2) {
                    soloStats.won += 1;
                }
                else {
                    soloStats.draw += 1;
                }
            }
            else if (gameInfo.get("gameType") === "friend") {
                if (gameInfo.get("randomRoom") === false) {
                    if (value === 1) {
                        friendsStats.lost += 1;
                    }
                    else if (value === 2) {
                        friendsStats.won += 1;
                    }
                    else {
                        friendsStats.draw += 1;
                    }
                }
                else {
                    if (value === 1) {
                        randomStats.lost += 1;
                    }
                    else if (value === 2) {
                        randomStats.won += 1;
                    }
                    else {
                        randomStats.draw += 1;
                    }
                }
            }
            let newStats = {"soloStats": soloStats, "friendsStats": friendsStats, "randomStats": randomStats};
            self.set("stats", newStats);
        }
        else {
            console.log('stats Variables Not Set');
            let newStats = {
                "soloStats": {
                    "won": 0,
                    "lost": 0,
                    "draw": 0
                },
                "friendsStats": {
                    "won": 0,
                    "lost": 0,
                    "draw": 0
                },
                "randomStats": {
                    "won": 0,
                    "lost": 0,
                    "draw": 0
                },
            };
            self.set("stats", newStats);
        }
    });
}

function kapowEndSoloGame(value) {
    kapowClientController.handleEndSoloGame(
        function () {
            if (value === 2) {
                kapowClientController.handleInvokeRPC("soloPostScore", {
                        'points': 5,
                        'playerID': gameInfo.get("playerData").id
                    }, true,
                    function (successResponse) {
                        console.log("successResponse  for lazy invocation", successResponse);
                    },
                    function (rpcErrorResponse) {
                        console.log("rpcErrorResponse  for lazy invocation", rpcErrorResponse);
                    }
                );

            }
            let tempCells = [];
            for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
                tempCells.push(undefined);
            }
            gameInfo.set("boardStatus", {cells: tempCells});
            gameInfo.set("win", 0);
            gameInfo.set("gameOver", false);
            gameInfo.set("room", null);
            gameInfo.set("playerMark", GAME_CONST.TURN.NONE);
            gameInfo.set("gameResume", false);
            console.log("Game Succesfully Closed.");
        }, function (error) {
            console.log("endSoloGame Failed : ", error);
        });
}