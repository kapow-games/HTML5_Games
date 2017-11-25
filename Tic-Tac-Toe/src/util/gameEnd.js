'use strict';

import gameLayoutVariables from "../objects/store/gameLayoutVariables";
import SocialShare from "./SocialShare";
import GameStoreQuery from "../objects/store/GameStoreQuery";
import gameInfo from "../objects/store/GameGlobalVariables";
import parseRoomAndRedirectToGame from "../util/parseRoomAndRedirectToGame";
import phaserGame from "../main";
import gameConst from "../gameParam/gameConst";

export default function gameEndHandler(game, value) {
    console.log("Game End Being Handled.");
    gameLayoutVariables.backgroundImage.inputEnabled = true;
    gameLayoutVariables.backgroundImage.input.priorityID = 2;
    gameLayoutVariables.backButton.input.priorityID = 3;
    gameLayoutVariables.resultBoard.frame = value === 1 ? 2 : value === 0 ? 1 : 0;
    gameLayoutVariables.turnTextBackground.destroy();
    gameLayoutVariables.resign.destroy();
    gameLayoutVariables.help.destroy();
    gameLayoutVariables.turnText.text = (value === 1) ? "YOU LOST!" : (value === 2 ? "YOU WON!" : "GAME DRAW!");
    if (value === 2) {
        if (gameInfo.get("playerMark") === gameConst.X) {
            gameLayoutVariables.resultBoard.frame = 0;
            gameLayoutVariables.turnText.backgroundColor = "#48d1dc";
        }
        else {
            gameLayoutVariables.resultBoard.frame = 1;
            gameLayoutVariables.turnText.backgroundColor = "#b9dc70";
        }
    }
    else if (value === 1) {
        gameLayoutVariables.resultBoard.frame = 2;
        gameLayoutVariables.turnText.backgroundColor = "#f45842";
    }

    let shareBackground = game.add.sprite(72, 1584, 'shareBackground');
    game.stage.addChild(shareBackground);

    let shareLoad = game.add.sprite(game.world.centerX, game.world.centerY, 'loaderSpinner');
    shareLoad.anchor.setTo(0.5);
    game.stage.addChild(shareLoad);

    let shareLoadTween = game.add.tween(shareLoad).to({angle: 359}, 400, null, true, 0, Infinity);
    shareLoad.kill();
    shareLoadTween.start();

    let socialShareModal = new SocialShare(game, value === 1 ? "loss" : value === 0 ? "draw" : "won");

    let shareFbButton = socialShareModal.shareButton(294, 1614, shareLoad, 'facebook', 'fbShare');
    shareFbButton.input.priorityID = 3;
    game.stage.addChild(shareFbButton);

    let shareTwitterButton = socialShareModal.shareButton(408, 1614, shareLoad, 'twitter', 'twitterShare');
    shareTwitterButton.input.priorityID = 3;
    game.stage.addChild(shareTwitterButton);

    let shareOtherButton = socialShareModal.shareButton(522, 1614, shareLoad, null, 'otherShare');
    shareOtherButton.input.priorityID = 3;
    game.stage.addChild(shareOtherButton);

    let rematchButton = game.add.button(657, 1584, 'rematch', rematchButtonHandler, 0, 0, 1, 0);
    rematchButton.input.priorityID = 3;
    rematchButton.game = game;
    game.stage.addChild(rematchButton);

    if (gameInfo.get("gameOver") === false) {
        let gameStoreContainer = new GameStoreQuery();
        gameStoreContainer.get("stats", function (statsValue, self) {
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
    if (gameInfo.get("gameLocked") === false)// To ensure that game doesn't close multiple times in Kapow
    {
        if (gameInfo.get("gameType") === "solo") {
            kapow.endSoloGame(function () {
                if (value === 2) {
                    kapow.rpc.invoke({
                            "functionName": 'soloPostScore',
                            "parameters": {'points': 5, 'playerID': gameInfo.get("playerData").id},
                            "invokeLazily": true
                        }, function (successResponse) {
                            console.log("successResponse  for lazy invocation", successResponse);
                        }, function (rpcErrorResponse) {
                            console.log("rpcErrorResponse  for lazy invocation", rpcErrorResponse);
                        }
                    );
                }
                gameInfo.set("boardStatus", {cells: new Array(9)});
                // gameInfo.set("botLevel", -1); //TODO : Remove This. Redundant
                gameInfo.set("win", 0);
                gameInfo.set("gameOver", false);
                gameInfo.set("room", null);
                gameInfo.set("playerMark", gameConst.NONE);
                gameInfo.set("gameResume", false);
                console.log("Game Succesfully Closed.");
            }, function (error) {
                console.log("endSoloGame Failed : ", error);
            });
        }
    }
}

export function drawWinningLine(phaserGame) {
    let gameFinalLayout = gameInfo.get("boardStatus").cells;
    let matchPosition;
    console.log("draw winning line called", gameFinalLayout);
    if (gameFinalLayout[0] !== null && gameFinalLayout[0] !== undefined && gameFinalLayout[0] === gameFinalLayout[1] && gameFinalLayout[0] === gameFinalLayout[2]) {
        matchPosition = phaserGame.add.sprite(222, 948, 'rectangle');
        matchPosition.anchor.setTo(0.5);
    }
    else if (gameFinalLayout[3] !== null && gameFinalLayout[3] !== undefined && gameFinalLayout[3] === gameFinalLayout[4] && gameFinalLayout[3] === gameFinalLayout[5]) {
        matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');
        matchPosition.anchor.setTo(0.5);
    }
    else if (gameFinalLayout[6] !== null && gameFinalLayout[6] !== undefined && gameFinalLayout[6] === gameFinalLayout[7] && gameFinalLayout[6] === gameFinalLayout[8]) {
        matchPosition = phaserGame.add.sprite(882, 948, 'rectangle');
        matchPosition.anchor.setTo(0.5);
    }
    else if (gameFinalLayout[0] !== null && gameFinalLayout[0] !== undefined && gameFinalLayout[0] === gameFinalLayout[3] && gameFinalLayout[0] === gameFinalLayout[6]) {
        matchPosition = phaserGame.add.sprite(552, 633, 'rectangle');
        matchPosition.anchor.setTo(0.5);
        matchPosition.angle = 90;
    }
    else if (gameFinalLayout[1] !== null && gameFinalLayout[1] !== undefined && gameFinalLayout[1] === gameFinalLayout[4] && gameFinalLayout[1] === gameFinalLayout[7]) {
        matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');
        matchPosition.anchor.setTo(0.5);
        matchPosition.angle = 90;
    }
    else if (gameFinalLayout[2] !== null && gameFinalLayout[2] !== undefined && gameFinalLayout[2] === gameFinalLayout[5] && gameFinalLayout[2] === gameFinalLayout[8]) {
        matchPosition = phaserGame.add.sprite(552, 1263, 'rectangle');
        matchPosition.anchor.setTo(0.5);
        matchPosition.angle = 90;
    }
    else if (gameFinalLayout[0] !== null && gameFinalLayout[0] !== undefined && gameFinalLayout[0] === gameFinalLayout[4] && gameFinalLayout[0] === gameFinalLayout[8]) { // Diagonal
        matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');
        matchPosition.anchor.setTo(0.5);
        matchPosition.angle = -45;
    }
    else if (gameFinalLayout[2] !== null && gameFinalLayout[2] !== undefined && gameFinalLayout[2] === gameFinalLayout[4] && gameFinalLayout[2] === gameFinalLayout[6]) {
        matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');
        matchPosition.anchor.setTo(0.5);
        matchPosition.angle = 45;
    }
    else {
        console.log("CLient doesn't confirm result.")
    }
    console.log("Adding winning line");
    if (matchPosition !== undefined) {
        phaserGame.stage.addChild(matchPosition);
    }
}

function rematchButtonHandler() {
    console.log('rematchButtonHandler Clicked');
    gameInfo.set("boardStatus", {cells: new Array(9)});
    gameInfo.set("win", 0);
    gameInfo.set("gameOver", false);
    gameInfo.set("room", null);
    gameInfo.set("playerMark", gameConst.NONE);
    gameInfo.set("gameResume", false);
    gameInfo.set("gameLocked", false);
    if (gameInfo.get("gameType") === "solo") {
        //gameInfo.set("botLevel", -1); //TODO : Remove This. Redundant
        gameInfo.set("gameLayoutLoaded", false);
        phaserGame.state.start('Select');//TODO : Mention correct Phaser.Game object
    }
    else if (gameInfo.get("gameType") === "friend") {
        kapow.rematch(function (roomObj) {
                gameInfo.set("room", roomObj);
                gameInfo.set("playerMark", gameConst.X);
                gameInfo.set("opponentMark", gameConst.O);
                gameInfo.set("gameLayoutLoaded", false);
                parseRoomAndRedirectToGame();
                console.log("Rematch Room Created");
            },
            function (error) {
                console.log("Rematch Room creation FAILED.", error);
            });
    }
}