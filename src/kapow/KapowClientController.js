"use strict";

import gameInfo from "../objects/store/GameInfo";
import GameManager from "../controller/GameManager";
import GAME_CONST from "../const/GAME_CONST";
import parseRoomAndRedirectToGame from "../util/roomRedirect";
import kapowGameStore from "../objects/store/KapowGameStore";

class KapowClientController {
    handleOnLoad(room) {
        gameInfo.set("room", room);
        this._syncStats();
        this._loadScreen();
    }

    handleOnGameEnd(outcome) {
        let playerId = gameInfo.get("playerData").id,
            opponentId = gameInfo.get("opponentData").id;
        if (outcome.type === GAME_CONST.OUTCOME.RESIGNATION || outcome.type === GAME_CONST.OUTCOME.TIMEOUT) {
            if (outcome.ranks[playerId] === 1) {
                console.log("Game Won");
                GameManager.endGame(2);
            } else {
                console.log("Game Lost");
                GameManager.endGame(1);
            }
        }
        if (outcome.ranks[playerId] === 1 && outcome.ranks[opponentId] === 1) {
            console.log("Game Draw");
        }
        else if (outcome.ranks[playerId] === 1) {
            console.log("Game Won");
        }
        else {
            console.log("Game Lost");
        }
    }

    handleAffliliationChange() {
        kapow.getRoomInfo(function (room) {
            console.log("Client getRoomInfo - Room: " + JSON.stringify(room));
            gameInfo.set("room", room);
            gameInfo.set("playerMark", GAME_CONST.TURN.O);
            gameInfo.set("opponentMark", GAME_CONST.TURN.X);
            parseRoomAndRedirectToGame();
        }, function () {
            console.log("Client - onAffiliationChange failure");
        });
    }

    handleOnTurnChange(player) {
        if (player.id === gameInfo.get("playerData").id) {
            gameInfo.set("turnOfPlayer", player);
        }
        else {
            gameInfo.set("turnOfPlayer", undefined);
        }
    }

    handleMessage(message) {
        if (gameInfo.get("gameLayoutLoaded") === true && message.type === "move" && message.senderId === gameInfo.get("opponentData").id) {
            GameManager.reflectMove(message);
        }
        else if (gameInfo.get("gameLayoutLoaded") === false && message.type === "move" && message.data.type === "markSet") {
            this.handleAffliliationChange();
        }
    }

    handleOnPause() {
        GameManager.toggleMusic(true);
    }

    handleBackButton() {
        console.log('BackButton Triggered.');
        if (gameInfo.get("screenState") === 1) {
            kapow.unloadRoom(function () {
                console.log('Room Succesfully Unloaded');
            }, function () {
                console.log('Room Unloading Failed');
            });
            gameInfo.set("gameResume", false);
            gameInfo.set("room", null);
            gameInfo.set("playerMark", GAME_CONST.TURN.NONE);
            gameInfo.set("gameType", null);
            gameInfo.set("botLevel", -1);
            let tempCells = [];
            for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
                tempCells.push(undefined);
            }
            gameInfo.set("boardStatus", {cells: tempCells});
            gameInfo.set("opponentData", null);
            gameInfo.set("turnOfPlayer", null);
            gameInfo.set("gameOver", false);
            gameInfo.set("win", 0);
            GameManager.startState('Menu');
        }
        else if (gameInfo.get("screenState") === 3) {
            GameManager.startState('Menu');
        }
        else {
            kapow.close();
        }
    }

    handleOnResume() {
        kapowGameStore.get("music", function (args, self) {
            console.log("gameStore fetch - Success.");
            console.log("Value fetched from gameStore was : ", args);
            let valueJSON = JSON.parse(args);
            GameManager.toggleMusic(valueJSON.volume === 0);
        });
        if (gameInfo.get("screenState") === 1 && gameInfo.get("gameType") === "friend") {
            gameInfo.set("gameResume", true);
            parseRoomAndRedirectToGame();
        }
        console.log('On Resume Triggered.');
    }

    _syncStats() {
        kapowGameStore.get("stats", function (statsValue, self) {
            if (statsValue) {
                let valueJSON = JSON.parse(statsValue);
                //TODO : syncStats onLoading game.
            } else {
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

    _loadScreen() {
        kapow.getUserInfo(function (user) {
            console.log("Client getUserInfoSuccess - User: " + JSON.stringify(user));
            gameInfo.set("playerData", user.player);
            if (gameInfo.get("room") !== null) {
                this._loadOngoingGameData();
            } else {
                gameInfo.set("gameResume", false);
            }
            GameManager.startGame();
        }.bind(this), function () {
            console.log("Client getUserInfo failure");
        });
    }

    _loadOngoingGameData() {
        gameInfo.set("gameResume", true);
        if (gameInfo.get("room").players.length > 1) {
            gameInfo.set("gameType", "friend");
        } else if (gameInfo.get("room").lockStatus === "locked") {
            gameInfo.set("gameType", "solo");
            kapow.roomStore.get('game_data', function (value) {
                if (value) {
                    let valueJSON = JSON.parse(value);
                    console.log(valueJSON);
                    gameInfo.set("playerMark", valueJSON.colorPlayer); // TODO : @mayank : can we store these like gameData instead of different values ? also gameInfo.playerMark should map value.playerMark
                    gameInfo.set("botLevel", valueJSON.difficulty);
                    gameInfo.set("boardStatus", valueJSON.board);
                    gameInfo.set("playerData", valueJSON.playerData);
                    gameInfo.set("gameOver", valueJSON.gameOver);
                    gameInfo.set("gameLocked", gameInfo.get("gameOver"));
                    gameInfo.set("win", valueJSON.winner);
                } else {
                    console.log('Game Variables Not set');
                }
            }, function (error) {
                console.log("Nothing Found : ", error);
            });
        } else {
            gameInfo.set("gameType", "friend");
        }
    }

    handleDisplayActiveRooms() {
        kapow.displayActiveRooms();
    }

    handleInvokeRPC(methodName, parameters, invokeLazily, successCallback, failureCallback) {
        if (invokeLazily) {
            kapow.rpc.invoke({
                    "functionName": methodName,
                    "parameters": parameters,
                    "invokeLazily": true
                },
                successCallback, failureCallback
            );
        }
        else {
            kapow.invokeRPC(methodName, parameters, successCallback, failureCallback);
        }
    }

    handleDisplayScoreboard(parameters) {
        kapow.boards.displayScoreboard(parameters);
    }

    handleStartGameWithFriends(minimumNumberOfPlayers, maximumNumberOfPlayers, successCallback, failureCallback) {
        kapow.startGameWithFriends(minimumNumberOfPlayers, maximumNumberOfPlayers, successCallback, failureCallback);
    }

    handleStartGameWithFriends(minimumNumberOfPlayers, maximumNumberOfPlayers, successCallback, failureCallback) {
        kapow.startGameWithFriends(minimumNumberOfPlayers, maximumNumberOfPlayers, successCallback, failureCallback);
    }

    handleStartGameWithRandomPlayers(attributes, successCallback, failureCallback) {
        kapow.startGameWithRandomPlayers(attributes, successCallback, failureCallback);
    }

    handleRematch(successCallback, failureCallback) {
        kapow.rematch(successCallback, failureCallback);
    }

    handleEndSoloGame(successCallback, failureCallback) {
        kapow.endSoloGame(successCallback, failureCallback);
    }

    handleFetchHistorySince(messageId, numberOfMessages, successCallback, failureCallback) {
        kapow.fetchHistorySince(messageId, numberOfMessages, successCallback, failureCallback);
    }

    handleFetchHistoryBefore(messageId, numberOfMessages, successCallback, failureCallback) {
        kapow.fetchHistoryBefore(messageId, numberOfMessages, successCallback, failureCallback);
    }

    handleSocialShare(text, medium, successCallback, failureCallback) {
        kapow.social.share(text, medium, successCallback, failureCallback);
    }
}

let kapowClientController = new KapowClientController();
export default kapowClientController;