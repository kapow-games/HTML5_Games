"use strict";

import GameStoreQuery from "../objects/store/GameStoreQuery";
import globalVariableInstance from "../objects/store/gameGlobalVariables";
import phaserGame from "../main";
import parseRoomAndRedirectToGame from "../util/parseRoomAndRedirectToGame";
import drawWinningLine from "../util/gameEnd";
import gameEndHandler from "../util/gameEnd";
import gameLayoutVariables from "../objects/store/gameLayoutVariables";

window.game = {
    onLoad: function (roomObj) {
        this.syncStats();
        console.log("Client onLoad - " + JSON.stringify(roomObj));

        globalVariableInstance.set("room", roomObj);
        console.log("roomObj loaded onLoad : ", globalVariableInstance.get("room"));

        this.loadScreen();
    },
    onGameEnd: function (outcome) {
        console.log("CLIENT : Game Ended", outcome);
        if (outcome.type === "resignation" || outcome.type === "timeout") {
            if (outcome.ranks[globalVariableInstance.get("playerData").id] === 1) {
                console.log("Game Won");
                gameEndHandler(phaserGame, 2);
            }
            else {
                console.log("Game Lost");
                gameEndHandler(phaserGame, 1);
            }
        }
        if (outcome.ranks[globalVariableInstance.get("playerData").id] === 1 && outcome.ranks[globalVariableInstance.get("opponentData").id] === 1) {
            console.log("Game Draw");
        }
        else if (outcome.ranks[globalVariableInstance.get("playerData").id] === 1) {
            console.log("Game Won");
        }
        else {
            console.log("Game Lost");
        }
    },
    onPlayerJoined: function (playerObj) {
        console.log("CLIENT onPlayerJoined - " + JSON.stringify(playerObj));
        //onAffiliationChange();
    },
    onInviteRejected: function (playerObj) {
        console.log("Client onInviteRejected - " + JSON.stringify(playerObj));
        this.onAffiliationChange();
    },
    onPlayerLeft: function (playerObj) {
        console.log("Client onPlayerLeft - " + JSON.stringify(playerObj));
    },
    onTurnChange: function (playerObj) {
        console.log("Player Turn Changed to : " + JSON.stringify(playerObj));
        if (playerObj.id === globalVariableInstance.get("playerData").id) {
            globalVariableInstance.set("turnOfPlayer", playerObj);
        }
        else {
            globalVariableInstance.set("turnOfPlayer", undefined);
        }
    },
    onPause: function () {
        console.log('On Pause Triggered.');
    },
    onResume: function () {
        if (globalVariableInstance.get("screenState") === 1 && globalVariableInstance.get("gameType") === "friend") {
            globalVariableInstance.set("gameResume", true);
            parseRoomAndRedirectToGame();
        }
        console.log('On Resume Triggered.');
    },
    onMessageReceived: function (message) {
        console.log('CLIENT : Message Received - ', message);
        if (globalVariableInstance.get("gameLayoutLoaded") === true && message.type === "move" && message.senderId === globalVariableInstance.get("opponentData").id) {
            for (let i = 0; i < 9; i++) {
                phaserGame.state.states.play.cells.children[i].frame = message.data.moveData.board[i];
            }
            gameLayoutVariables.opponentProfilePic.alpha = 0.3;
            gameLayoutVariables.playerProfilePic.alpha = 1;
            gameLayoutVariables.turnText.text = "YOUR TURN";
            globalVariableInstance.set("boardStatus", {cells: message.data.moveData.board});
            if (globalVariableInstance.get("playerMark") === 0) {
                globalVariableInstance.set("playerMark", 2);
            }
            if (message.data.result === "lost") {
                console.log("Lost");
                drawWinningLine(phaserGame);
                gameEndHandler(phaserGame, 1);
            }
            else if (message.data.result === "draw") {
                console.log("Draw");
                gameEndHandler(phaserGame, 0);
            }
        }
        else if (globalVariableInstance.get("gameLayoutLoaded") === false && message.type === "move" && message.data.type === "markSet") {
            this.onAffiliationChange();
        }
    },
    onBackButtonPressed: function () {
        console.log('BackButton Triggered.');
        if (globalVariableInstance.get("screenState") === 1) {
            kapow.unloadRoom(function () {
                console.log('Room Succesfully Unloaded');
            }, function () {
                console.log('Room Unloading Failed');
            });
            globalVariableInstance.set("gameResume", false);
            globalVariableInstance.set("room", null);
            globalVariableInstance.set("playerMark", 0);
            globalVariableInstance.set("gameType", null);
            globalVariableInstance.set("botLevel", -1);
            globalVariableInstance.set("boardStatus", {cells: new Array(9)});
            globalVariableInstance.set("opponentData", undefined);
            globalVariableInstance.set("turnOfPlayer", undefined);
            globalVariableInstance.set("gameOver", false);
            globalVariableInstance.set("win", 0);
            phaserGame.state.start('menu');
        }
        else {
            kapow.close();
        }
        return true;
    },
    onRoomLockStatusChange: function (roomObj) {
        console.log("Room Lock status changed for room :", roomObj);
    },
    syncStats: function () {
        let gameStoreContainer = new GameStoreQuery();
        gameStoreContainer.get("stats", function (statsValue, self) {
            if (statsValue) {
                console.log("Value fetched from gameStore was : ", statsValue);
                let valueJSON = JSON.parse(statsValue);
                //TODO : syncStats onLoading game.
            }
            else {
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
    },
    loadScreen: function () {
        kapow.getUserInfo(function (userObj) {
            console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
            let user = userObj.player;
            globalVariableInstance.set("playerData", user);

            if (globalVariableInstance.get("room") !== null) { //Game already created sometime earlier
                this.loadOngoingGameData();
            }
            else {
                globalVariableInstance.set("gameResume", false);
            }
            console.log("room : ", globalVariableInstance.get("room"));
            phaserGame.state.start('boot');
        }.bind(this), function () {
            console.log("Client getUserInfo failure");
        });
    },
    loadOngoingGameData: function () {
        globalVariableInstance.set("gameResume", true);

        if (globalVariableInstance.get("room").players.length > 1) {
            globalVariableInstance.set("gameType", "friend");
        }
        else if (globalVariableInstance.get("room").lockStatus === "locked") {
            globalVariableInstance.set("gameType", "solo");

            kapow.roomStore.get('game_data', function (value) {
                if (value) {
                    let valueJSON = JSON.parse(value);
                    console.log(valueJSON);
                    globalVariableInstance.set("playerMark", valueJSON.colorPlayer);
                    globalVariableInstance.set("botLevel", valueJSON.difficulty);
                    globalVariableInstance.set("boardStatus", valueJSON.board);
                    globalVariableInstance.set("playerData", valueJSON.playerData);
                    globalVariableInstance.set("gameOver", valueJSON.gameOver);
                    globalVariableInstance.set("gameLocked", globalVariableInstance.get("gameOver"));
                    globalVariableInstance.set("win", valueJSON.winner);
                }
                else {
                    console.log('Game Variables Not set');
                }
            }, function (error) {
                console.log("Nothing Found : ", error);
            });
        }
        else {
            globalVariableInstance.set("gameType", "friend");
        }
    },
    onAffiliationChange() {
        kapow.getRoomInfo(function (roomObj) {
            console.log("Client getRoomInfo - Room: " + JSON.stringify(roomObj));
            globalVariableInstance.set("room", roomObj);
            globalVariableInstance.set("playerMark", 2);
            globalVariableInstance.set("opponentMark", 1);
            parseRoomAndRedirectToGame();
        }, function () {
            console.log("Client - onAffiliationChange failure");
        });
    }
};
export default game;