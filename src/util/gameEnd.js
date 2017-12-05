'use strict';

import layoutStore from "../objects/store/layoutStore";
import SocialShare from "./SocialShare";
import GameStoreQuery from "../objects/store/KapowGameStore";
import gameInfo from "../objects/store/GameInfo";
import parseRoomAndRedirectToGame from "./roomRedirect";
import phaserGame from "../main";
import GAME_CONST from "../const/GAME_CONST";
import phaserManager from "./phaserManager";
import MESSAGE from "../const/MESSAGES";

export default function gameEndHandler(game, value) { // TODO : too big responsiblitly function. Seperate into smaller units
    renderGameEndUIChanges(game, value);
    if (gameInfo.get("gameOver") === false) {
        updateStats(value);
    }
    if (!gameInfo.get("gameLocked") && gameInfo.get("gameType") === "solo")// To ensure that game doesn't close multiple times in Kapow
    {
        kapowEndSoloGame(value);
    }
}

// TODO : @mayank : This should just return match position.
// Use GamePlayUtil.getWinningPosition.  call child in the parent file , and pass the layout
//
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

// TODO : this is not exported ?
function rematchButtonHandler() {
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
        phaserGame.state.start('Select');//TODO : Mention correct Phaser.Game object
    }
    else if (gameInfo.get("gameType") === "friend") {
        kapow.rematch(function (roomObj) {
                gameInfo.set("room", roomObj);
                gameInfo.set("playerMark", GAME_CONST.TURN.X);
                gameInfo.set("opponentMark", GAME_CONST.TURN.O);
                gameInfo.set("gameLayoutLoaded", false);
                parseRoomAndRedirectToGame();
                console.log("Rematch Room Created");
            },
            function (error) {
                console.log("Rematch Room creation FAILED.", error);
            });
    }
}

function renderGameEndUIChanges(game, value) {
    console.log("Game End Being Handled.");
    layoutStore.backgroundImage.inputEnabled = true;
    layoutStore.backgroundImage.input.priorityID = 2;
    layoutStore.backButton.input.priorityID = 3;
    layoutStore.musicButton.input.priorityID = 3;
    layoutStore.help.input.priorityID = 3;

    game.stage.removeChild(layoutStore.turnTextBackground);
    game.stage.removeChild(layoutStore.help);
    game.stage.removeChild(layoutStore.resign);
    game.stage.removeChild(layoutStore.turnText);

    let resultText = (value === 1) ? MESSAGE.LOSE : (value === 2 ? MESSAGE.WIN : MESSAGE.DRAW);
    let resultTextBackgroundColor;
    if (value === 2) {
        layoutStore.confetti.reset(111, 201);
        if (gameInfo.get("playerMark") === GAME_CONST.TURN.X) {
            layoutStore.resultBoard.frame = 0;
            resultTextBackgroundColor = "#48d1dc";
        }
        else {
            layoutStore.resultBoard.frame = 1;
            resultTextBackgroundColor = "#b9dc70";
        }
    }
    else if (value === 1) {
        layoutStore.resultBoard.frame = 2;
        resultTextBackgroundColor = "#f45842";
    }

    layoutStore.turnText = phaserManager.createText(game, {
        positionX: game.world.centerX,
        positionY: 276,
        message: resultText,
        align: "center",
        backgroundColor: resultTextBackgroundColor,
        fill: "#fefefe",
        font: 'nunito-regular',
        fontSize: "60px",
        fontWeight: 800,
        wordWrapWidth: 355,
        anchorX: 0.5,
        anchorY: 0
    });

    game.stage.addChild(layoutStore.turnText);
    let shareBackground = game.add.sprite(72, 1584, 'shareBackground');
    game.stage.addChild(shareBackground);

    let socialShareModal = new SocialShare(game, value === 1 ? "loss" : value === 0 ? "draw" : "won");

    let shareFbButton = socialShareModal.shareButton(294, 1614, 'facebook', 'fbShare');
    shareFbButton.input.priorityID = 3;
    layoutStore.fbShare = shareFbButton;
    game.stage.addChild(shareFbButton);

    let shareTwitterButton = socialShareModal.shareButton(408, 1614, 'twitter', 'twitterShare');
    shareTwitterButton.input.priorityID = 3;
    layoutStore.twitterShare = shareTwitterButton;
    game.stage.addChild(shareTwitterButton);

    let shareOtherButton = socialShareModal.shareButton(522, 1614, null, 'otherShare');
    shareOtherButton.input.priorityID = 3;
    layoutStore.otherShare = shareOtherButton;
    game.stage.addChild(shareOtherButton);

    let rematchButton = game.add.button(657, 1584, 'rematch', rematchButtonHandler, 0, 0, 1, 0);
    rematchButton.input.priorityID = 3;
    rematchButton.game = game;
    layoutStore.rematch = rematchButton;
    game.stage.addChild(rematchButton);
}

function updateStats(value) {
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

function kapowEndSoloGame(value) {
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
        let tempCells = [];
        for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
            tempCells.push(undefined);
        }
        gameInfo.set("boardStatus", {cells: tempCells});
        // gameInfo.set("botLevel", -1); //TODO : Remove This. Redundant
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