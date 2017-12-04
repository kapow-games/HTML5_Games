"use strict";

import gameInfo from "../objects/store/GameInfoStore";

class KapowClientController {
    handleOnLoad(room) {
        gameInfo.set("room", room);
        this._syncStats();
        this._loadScreen();
    }

    handleGameEnd(outcome) {
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
    }

    handleAffliliationChange() {
        kapow.getRoomInfo(function (roomObj) {
            console.log("Client getRoomInfo - Room: " + JSON.stringify(roomObj));
            gameInfo.set("room", roomObj);
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
            for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
                phaserGame.state.states.Play.cells.children[i].frame = message.data.moveData.board[i];
            }
            layoutStore.opponentProfilePic.alpha = 0.3;
            layoutStore.playerProfilePic.alpha = 1;
            layoutStore.turnText.text = MESSAGE.YOUR_TURN;
            gameInfo.set("boardStatus", {cells: message.data.moveData.board});
            if (gameInfo.get("playerMark") === GAME_CONST.TURN.NONE) {
                gameInfo.set("playerMark", GAME_CONST.TURN.O);
            }
            if (message.data.result === "lost") {
                console.log("Lost");
                let winningPosition = GamePlayUtil.getWinningPosition(gameInfo.get("boardStatus").cells);
                if (winningPosition) {
                    let sprite = phaserGame.add.sprite(winningPosition.x, winningPosition.y, winningPosition.key);
                    sprite.anchor.setTo(winningPosition.anchor);
                    phaserGame.stage.addChild(sprite);
                }
                // TODO : remove like drawWinningLine
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
    }

    handleOnPause() {
        phaserGame.state.states.Boot.sound.mute = true;
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
            phaserGame.state.start('Menu');
        }
        else if (gameInfo.get("screenState") === 3) {
            phaserGame.state.start('Menu');
        }
        else {
            kapow.close();
        }
    }

    handleGameResume() {
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
    }

    _syncStats() {
        let kapowGameStore = new KapowGameStore();
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
    }

    _loadOngoingGameData() {
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
    }

}

export let kapowClientController = new KapowClientController();