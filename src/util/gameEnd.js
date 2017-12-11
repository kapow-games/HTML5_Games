'use strict';

import kapowGameStore from "../objects/store/KapowGameStore";
import gameInfo from "../objects/store/GameInfo";
import GamePlayUtil from "./GamePlayUtil";
import GAME_CONST from "../const/GAME_CONST";
import GameManager from "../controller/GameManager";
import kapowClientController from "../kapow/KapowClientController";

export function rematchButtonHandler() {
    console.log('rematchButtonHandler Clicked');
    let tempCells = [];
    gameInfo.setBulk({
        "gameResume": false,
        "room": null,
        "playerMark": GAME_CONST.TURN.NONE,
        "gameLocked": false,
        "boardStatus": {cells: Array.from({length: GAME_CONST.GRID.CELL_COUNT}, (v, k) => undefined)},
        "gameOver": false,
        "win": 0,
    });
    if (gameInfo.get("gameType") === "solo") {
        gameInfo.set("gameLayoutLoaded", false);
        GameManager.startState('Select');
    }
    else if (gameInfo.get("gameType") === "friend") {
        kapowClientController.handleRematch(
            function (room) {
                gameInfo.setBulk({
                    "room": room,
                    "playerMark": GAME_CONST.TURN.X,
                    "opponentMark": GAME_CONST.TURN.O,
                    "gameLayoutLoaded": false,
                });
                GamePlayUtil.redirectToScreen();
                console.log("Rematch Room Created");
            },
            function (error) {
                console.log("Rematch Room creation FAILED.", error);
            }
        );
    }
}


export function getStats(value) {
    kapowGameStore.get("stats", function (statsValue, self) {
        let stats = {};
        if (statsValue) {
            let valueJSON = JSON.parse(statsValue);
            console.log("Value fetched from gameStore was : ", valueJSON);
            let soloStats = valueJSON.soloStats,
                randomStats = valueJSON.randomStats,
                friendsStats = valueJSON.friendsStats;

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
            stats = {"soloStats": soloStats, "friendsStats": friendsStats, "randomStats": randomStats};
            self.set("stats", stats);
        }
        else {
            console.log('stats Variables Not Set');
            stats = {
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
            self.set("stats", stats);
        }
    });
}

export function kapowEndSoloGame(value) {
    kapowClientController.handleEndSoloGame(function () {
        if (value === 2) {
            kapowClientController.handleInvokeRPC("soloPostScore", {
                    'points': 5,
                    'playerID': gameInfo.get("playerData").id
                }, true, function (successResponse) {
                    console.log("successResponse  for lazy invocation", successResponse);
                }, function (rpcErrorResponse) {
                    console.log("rpcErrorResponse  for lazy invocation", rpcErrorResponse);
                }
            );
        }
        gameInfo.setBulk({
            "boardStatus": {cells: Array.from({length: GAME_CONST.GRID.CELL_COUNT}, (v, k) => undefined)},
            "gameResume": false,
            "room": null,
            "playerMark": GAME_CONST.TURN.NONE,
            "gameOver": false,
            "win": 0,
        });
        console.log("Game Successfully Closed.");
    }, function (error) {
        console.log("endSoloGame Failed : ", error);
    });
}