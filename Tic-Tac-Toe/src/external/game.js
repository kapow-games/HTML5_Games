"use strict";

import GameStoreQuery from "../objects/store/KapowGameStore";
import gameInfo from "../objects/store/GameInfoStore";
import phaserGame from "../main";
import parseRoomAndRedirectToGame from "../util/parseRoomAndRedirectToGame";
import {drawWinningLine} from "../util/gameEnd";
import gameEndHandler from "../util/gameEnd";
import gameLayoutVariables from "../objects/store/gameLayoutVariables";
import gameConst from "../gameParam/gameConst";

window.game = {
    onLoad: function (roomObj) {
        this.syncStats();
        console.log("Room returned by kapow onLoad - " + JSON.stringify(roomObj));
        gameInfo.set("room", roomObj);
        this.loadScreen();
    },
    onGameEnd: function (outcome) {
        console.log("CLIENT : Game Ended", outcome);
        if (outcome.type === "resignation" || outcome.type === "timeout") {
            if (outcome.ranks[gameInfo.get("playerData").id] === 1) {
                console.log("Game Won");
                gameEndHandler(phaserGame, 2);
            }
            else {
                console.log("Game Lost");
                gameEndHandler(phaserGame, 1);
            }
        }
        if (outcome.ranks[gameInfo.get("playerData").id] === 1 && outcome.ranks[gameInfo.get("opponentData").id] === 1) {
            console.log("Game Draw");
        }
        else if (outcome.ranks[gameInfo.get("playerData").id] === 1) {
            console.log("Game Won");
        }
        else {
            console.log("Game Lost");
        }
    },
    onPlayerJoined: function (playerObj) {
        console.log("CLIENT onPlayerJoined - " + JSON.stringify(playerObj));
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
        if (playerObj.id === gameInfo.get("playerData").id) {
            gameInfo.set("turnOfPlayer", playerObj);
        }
        else {
            gameInfo.set("turnOfPlayer", undefined);
        }
    },
    onPause: function () {
        console.log('On Pause Triggered.');
    },
    onResume: function () {
        if (gameInfo.get("screenState") === 1 && gameInfo.get("gameType") === "friend") {
            gameInfo.set("gameResume", true);
            parseRoomAndRedirectToGame();
        }
        console.log('On Resume Triggered.');
    },
    onMessageReceived: function (message) {
        console.log('CLIENT : Message Received - ', message);
        if (gameInfo.get("gameLayoutLoaded") === true && message.type === "move" && message.senderId === gameInfo.get("opponentData").id) {
            for (let i = 0; i < gameConst.CELL_COUNT; i++) {
                phaserGame.state.states.Play.cells.children[i].frame = message.data.moveData.board[i];
            }
            gameLayoutVariables.opponentProfilePic.alpha = 0.3;
            gameLayoutVariables.playerProfilePic.alpha = 1;
            gameLayoutVariables.turnText.text = "YOUR TURN";
            gameInfo.set("boardStatus", {cells: message.data.moveData.board});
            if (gameInfo.get("playerMark") === gameConst.NONE) {
                gameInfo.set("playerMark", gameConst.O);
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
        else if (gameInfo.get("gameLayoutLoaded") === false && message.type === "move" && message.data.type === "markSet") {
            this.onAffiliationChange();
        }
    },
    onBackButtonPressed: function () {
        console.log('BackButton Triggered.');
        if (gameInfo.get("screenState") === 1) {
            kapow.unloadRoom(function () {
                console.log('Room Succesfully Unloaded');
            }, function () {
                console.log('Room Unloading Failed');
            });
            gameInfo.set("gameResume", false);
            gameInfo.set("room", null);
            gameInfo.set("playerMark", gameConst.NONE);
            gameInfo.set("gameType", null);
            gameInfo.set("botLevel", -1);
            let tempCells = [];
            for(let i = 0 ; i < gameConst.CELL_COUNT ; i++) {
                tempCells.push(undefined);
            }
            gameInfo.set("boardStatus", {cells: tempCells});
            gameInfo.set("opponentData", null);
            gameInfo.set("turnOfPlayer", null);
            gameInfo.set("gameOver", false);
            gameInfo.set("win", 0);
            phaserGame.state.start('Menu');
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
            gameInfo.set("playerData", user);

            if (gameInfo.get("room") !== null) { //Game already created sometime earlier
                this.loadOngoingGameData();
            }
            else {
                gameInfo.set("gameResume", false);
            }
            console.log("room : ", gameInfo.get("room"));
            phaserGame.state.start('Boot');
        }.bind(this), function () {
            console.log("Client getUserInfo failure");
        });
    },
    loadOngoingGameData: function () {
        gameInfo.set("gameResume", true);

        if (gameInfo.get("room").players.length > 1) {
            gameInfo.set("gameType", "friend");
        }
        else if (gameInfo.get("room").lockStatus === "locked") {
            gameInfo.set("gameType", "solo");

            kapow.roomStore.get('game_data', function (value) {
                if (value) {
                    let valueJSON = JSON.parse(value);
                    console.log(valueJSON);
                    gameInfo.set("playerMark", valueJSON.colorPlayer);
                    gameInfo.set("botLevel", valueJSON.difficulty);
                    gameInfo.set("boardStatus", valueJSON.board);
                    gameInfo.set("playerData", valueJSON.playerData);
                    gameInfo.set("gameOver", valueJSON.gameOver);
                    gameInfo.set("gameLocked", gameInfo.get("gameOver"));
                    gameInfo.set("win", valueJSON.winner);
                }
                else {
                    console.log('Game Variables Not set');
                }
            }, function (error) {
                console.log("Nothing Found : ", error);
            });
        }
        else {
            gameInfo.set("gameType", "friend");
        }
    },
    onAffiliationChange() {
        kapow.getRoomInfo(function (roomObj) {
            console.log("Client getRoomInfo - Room: " + JSON.stringify(roomObj));
            gameInfo.set("room", roomObj);
            gameInfo.set("playerMark", gameConst.O);
            gameInfo.set("opponentMark", gameConst.X);
            parseRoomAndRedirectToGame();
        }, function () {
            console.log("Client - onAffiliationChange failure");
        });
    }
};
export default game;