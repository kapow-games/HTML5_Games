"use strict";

import KapowGameStore from "../objects/store/KapowGameStore";
import gameInfo from "../objects/store/GameInfoStore";
import phaserGame from "../main";
import parseRoomAndRedirectToGame from "../util/roomRedirect";
import {drawWinningLine} from "../util/gameEnd";
import handleGameEnd from "../util/gameEnd";
import layoutStore from "../objects/store/layoutStore";
import GAME_CONST from "../gameParam/gameConst";
import MESSAGE from "../gameParam/message";

// TODO : make function private
window.game = {
    onLoad: function (room) {
        this._syncStats();
        console.log("Room returned by kapow onLoad - " + JSON.stringify(room));
        gameInfo.set("room", room);
        this._loadScreen();
    },
    onGameEnd: function (outcome) {
        console.log("CLIENT : Game Ended", outcome);
        if (outcome.type === "resignation" || outcome.type === "timeout") {
            if (outcome.ranks[gameInfo.get("playerData").id] === 1) {
                console.log("Game Won");
                handleGameEnd(phaserGame, 2);
            }
            else {
                console.log("Game Lost");
                handleGameEnd(phaserGame, 1);
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
        phaserGame.state.states.Boot.sound.mute = true;
    },
    onResume: function () {
        let gameStoreContainer = new KapowGameStore();
        gameStoreContainer.get("music", function (args, self) {
            console.log("gameStore fetch - Success.");
            console.log("Value fetched from gameStore was : ", args);
            let valueJSON = JSON.parse(args);
            phaserGame.state.states.Boot.sound.mute = valueJSON.volume === 0;
        });
        if (gameInfo.get("screenState") === 1 && gameInfo.get("gameType") === "friend") {
            gameInfo.set("gameResume", true);
            parseRoomAndRedirectToGame();
        }
        console.log('On Resume Triggered.');
    },
    onMessageReceived: function (message) {
        console.log('CLIENT : Message Received - ', message);
        if (gameInfo.get("gameLayoutLoaded") === true && message.type === "move" && message.senderId === gameInfo.get("opponentData").id) {
            for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
                phaserGame.state.states.Play.cells.children[i].frame = message.data.moveData.board[i];
            }
            layoutStore.opponentProfilePic.alpha = 0.3;
            layoutStore.playerProfilePic.alpha = 1;
            layoutStore.turnText.text = MESSAGE.YOUR_TURN;
            gameInfo.set("boardStatus", {cells: message.data.moveData.board});
            if (gameInfo.get("playerMark") === GAME_CONST.NONE) {
                gameInfo.set("playerMark", GAME_CONST.O);
            }
            if (message.data.result === "lost") {
                console.log("Lost");
                drawWinningLine(phaserGame);
                handleGameEnd(phaserGame, 1);
            }
            else if (message.data.result === "draw") {
                console.log("Draw");
                handleGameEnd(phaserGame, 0);
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
            gameInfo.set("playerMark", GAME_CONST.NONE);
            gameInfo.set("gameType", null);
            gameInfo.set("botLevel", -1);
            let tempCells = [];
            for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
                tempCells.push(undefined);
            }
            gameInfo.set("boardStatus", {cells: tempCells});
            gameInfo.set("opponentData", null);
            gameInfo.set("turnOfPlayer", null);
            gameInfo.set("gameOver", false);
            gameInfo.set("win", 0);
            phaserGame.state.start('Menu');
        }
        else if(gameInfo.get("screenState") === 3) {
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
    _syncStats: function () {
        let gameStoreContainer = new KapowGameStore();
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
    _loadScreen: function () {
        kapow.getUserInfo(function (user) {
            console.log("Client getUserInfoSuccess - User: " + JSON.stringify(user));
            gameInfo.set("playerData", user.player);
            if (gameInfo.get("room") !== null) { //Game already created sometime earlier
                this._loadOngoingGameData();
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
    _loadOngoingGameData: function () {
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
            gameInfo.set("playerMark", GAME_CONST.O);
            gameInfo.set("opponentMark", GAME_CONST.X);
            parseRoomAndRedirectToGame();
        }, function () {
            console.log("Client - onAffiliationChange failure");
        });
    }
};