'use strict';

import phaserManager from "../util/phaserManager";
import globalVariableInstance from "../objects/store/gameGlobalVariables";
import gameEndHandler from '../util/gameEnd';
import {drawWinningLine} from '../util/gameEnd';
import gameLayoutVariables from "../objects/store/gameLayoutVariables";
import Bot from "../objects/bot/Bot";
import Game from "../objects/bot/Game";
import Background from "../objects/widgets/icons/Background";
import ResignButton from "../objects/widgets/button/ResignButton";
import saveGameData from "../util/saveGameData";
import MusicButton from "../objects/widgets/button/MusicButton";
import GameState from "../objects/bot/GameState";
import BackButton from "../objects/widgets/button/BackButton";
import HelpButton from "../objects/widgets/button/HelpButton";
import layoutConst from "../gameParam/gameConst";

export class Play extends Phaser.State {
    preload() {
        globalVariableInstance.set("screenState", 1);
        this.loadOpponentImage();
        gameLayoutVariables.clickBlocked = false;
    }

    create() {

        globalVariableInstance.set("screenState", 1);
        console.log("Loading Game Layout.");

        this.createBackground();
        this.createBoards();
        this.createResignButton();
        this.createHelpButton();
        this.createPlayerProfileImage();
        this.createOpponentProfileImage();
        this.createBackButton();
        this.createMusicButton();

        globalVariableInstance.set("win", 0);

        this.prepareGameBoard();

        if (globalVariableInstance.get("gameType") === 'solo') {
            this.initialiseBot();
        }
        else if (globalVariableInstance.get("gameType") === 'friend') {
            this.verifyOpponentAffiliationStatus();
            this.recreateResultForEndedGame();
        }

        globalVariableInstance.set("gameLayoutLoaded", true);

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    update() {
    }

    shutdown() {
        this.game.stage.removeChild(gameLayoutVariables.backgroundImage);
        this.game.stage.removeChild(gameLayoutVariables.turnText);
        this.game.stage.removeChild(gameLayoutVariables.turnTextBackground);
        this.game.stage.removeChild(gameLayoutVariables.backButton);
        this.game.stage.removeChild(this.musicButton);
        this.game.stage.removeChild(gameLayoutVariables.resultBoard);
        this.game.stage.removeChild(gameLayoutVariables.help);
        this.game.stage.removeChild(this.playerProfilePicMark);
        this.game.stage.removeChild(this.playerProfilePicMarkBackground);
        this.game.stage.removeChild(this.playerProfilePicBackground);
        this.game.stage.removeChild(gameLayoutVariables.playerProfilePic);
        this.game.stage.removeChild(gameLayoutVariables.playerProfilePic.mask);
        this.game.stage.removeChild(this.opponentProfilePicMark);
        this.game.stage.removeChild(this.opponentProfilePicMarkBackground);
        this.game.stage.removeChild(this.opponentProfilePicBackground);
        this.game.stage.removeChild(gameLayoutVariables.opponentProfilePic);
        this.game.stage.removeChild(gameLayoutVariables.opponentProfilePic.mask);
        // this.game.stage.removeChild(this.cells);

        // for (let i = this.game.stage.children.length - 1; i >= 0; i--)
        // {
        //     this.game.stage.removeChild(this.game.stage.children[i]);
        // }
        // while(this.game.stage.children.length > 0){   var child = this.game.stage.getChildAt(0);  this.game.stage.removeChild(child);}
    }

    clickHandlerSolo(sprite, pointer) {
        let cell = this.cells.children;
        if (sprite.frame === 0) {
            gameLayoutVariables.backgroundImage.enableInput(true);
            gameLayoutVariables.backgroundImage.setInputPriority(2);
            gameLayoutVariables.backButton.setInputPriority(2);
            this.musicButton.setInputPriority(2);
            gameLayoutVariables.resign.setInputPriority(2);
            console.log("Player Mark", globalVariableInstance.get("playerMark"));
            sprite.frame = globalVariableInstance.get("playerMark");
            console.log("Player's Sprite Set");

            gameLayoutVariables.turnText.text = "BOT'S TURN";
            gameLayoutVariables.opponentProfilePic.alpha = 1;
            gameLayoutVariables.playerProfilePic.alpha = 0.3;


            setTimeout(function () {
                this.nextMove(sprite, cell);
            }.bind(this), 1000);
        }
        else {
            console.log('Cell already occupied.');
        }

    }

    clickHandlerMulti(sprite) {
        console.log(globalVariableInstance.get("turnOfPlayer"), globalVariableInstance.get("playerData"), sprite.frame);

        if (globalVariableInstance.get("turnOfPlayer") !== undefined && globalVariableInstance.get("turnOfPlayer").id === globalVariableInstance.get("playerData").id && sprite.frame === 0) {
            gameLayoutVariables.backgroundImage.enableInput(true);
            gameLayoutVariables.backgroundImage.setInputPriority(2);
            gameLayoutVariables.backButton.setInputPriority(2);
            this.musicButton.setInputPriority(2);
            gameLayoutVariables.resign.setInputPriority(2);
            console.log("Player's Sprite Set");

            gameLayoutVariables.turnText.text = globalVariableInstance.get("gameType") === "solo" ? "BOT'S TURN" : "WAITING";
            gameLayoutVariables.opponentProfilePic.alpha = 1;
            gameLayoutVariables.playerProfilePic.alpha = 0.3;

            globalVariableInstance.set("turnOfPlayer", undefined);

            let tempCells = globalVariableInstance.get("boardStatus").cells;
            tempCells[sprite.frameIndex] = globalVariableInstance.get("playerMark");
            globalVariableInstance.set("boardStatus", {cells: tempCells});

            sprite.frame = globalVariableInstance.get("playerMark");
            sprite.alpha = 0.3;

            let sentData = {
                board: globalVariableInstance.get("boardStatus").cells,
                playerTurn: globalVariableInstance.get("playerData").id,
                opponentTurn: globalVariableInstance.get("opponentData").id,
                roomID: globalVariableInstance.get("room").roomId
            };
            console.log("Client - invokeRPC makeMove", sentData);
            kapow.invokeRPC("makeMove", sentData,
                function (obj) {
                    console.log("makeMove - success : obj: \n", obj);
                    sprite.frame = globalVariableInstance.get("playerMark");
                    sprite.alpha = 1;
                    if (obj.result === "lost") {
                        gameLayoutVariables.turnText.text = " YOU WON!";
                        drawWinningLine(this.game);
                        gameEndHandler(this.game, 2);
                        console.log("You won");
                    }
                    else if (obj.result === "draw") {
                        gameLayoutVariables.turnText.text = " GAME DRAW!";
                        console.log("Draw");
                        gameEndHandler(this.game, 0);
                    }
                    else {
                        gameLayoutVariables.backgroundImage.setInputPriority(1);
                        gameLayoutVariables.backgroundImage.enableInput(false);
                        gameLayoutVariables.backButton.setInputPriority(1);
                        this.musicButton.setInputPriority(1);
                        gameLayoutVariables.resign.setInputPriority(1);
                    }
                }.bind(this),
                function (error) {
                    sprite.frame = 0;
                    let tempCells = globalVariableInstance.get("boardStatus").cells;
                    tempCells[sprite.frameIndex] = 0;
                    globalVariableInstance.set("boardStatus", {cells: tempCells});
                    globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData"));
                    gameLayoutVariables.backgroundImage.setInputPriority(1);
                    gameLayoutVariables.backgroundImage.enableInput(false);
                    gameLayoutVariables.backButton.setInputPriority(1);
                    this.musicButton.setInputPriority(1);
                    gameLayoutVariables.resign.setInputPriority(1);

                    gameLayoutVariables.turnText.text = "YOUR TURN";
                    gameLayoutVariables.opponentProfilePic.alpha = 0.3;
                    gameLayoutVariables.playerProfilePic.alpha = 1;

                    console.log("makeMove - failure", error);
                }.bind(this)
            );
        }
    }

    nextMove(sprite, cell) {
        let next = new GameState(gameLayoutVariables.game.currentState);
        console.log("Click Acknowledged");
        next.board[sprite.frameIndex] = globalVariableInstance.get("playerMark");
        sprite.frame = globalVariableInstance.get("playerMark");
        console.log("Player's move logged");
        next.nextTurn();
        gameLayoutVariables.game.moveTo(next);
        for (let i = 0; i < layoutConst.CELL_COLS * layoutConst.CELL_ROWS; i++) {
            cell[i].frame = gameLayoutVariables.game.currentState.board[i];
        }
        if (globalVariableInstance.get("win") === 0 && gameLayoutVariables.game.gameStatus !== 3) {
            saveGameData(this.game, false);
            gameLayoutVariables.turnText.text = "YOUR TURN";
            gameLayoutVariables.opponentProfilePic.alpha = 0.3;
            gameLayoutVariables.playerProfilePic.alpha = 1;
            gameLayoutVariables.backgroundImage.setInputPriority(1);
            gameLayoutVariables.backgroundImage.enableInput(false);
            gameLayoutVariables.backButton.setInputPriority(1);
            this.musicButton.setInputPriority(1);
            gameLayoutVariables.resign.setInputPriority(1);
        }
        else {
            saveGameData(this.game, true);
        }
    }

    loadOpponentImage() {
        if (globalVariableInstance.get("gameType") === 'friend') {
            if (globalVariableInstance.get("opponentData") !== null) {
                this.game.load.image('opponentPic', globalVariableInstance.get("opponentData").profileImage);
            }
            else {
                console.log("opponentData was not set.");
            }
        }
        console.log(this.game.cache.checkImageKey('opponentPic'), this.load);
    }

    createBackground() {
        gameLayoutVariables.backgroundImage = new Background({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
        this.game.stage.addChild(gameLayoutVariables.backgroundImage);
    }

    backButtonHandler() {
        console.log("WebView BACK presed.");
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
        globalVariableInstance.set("opponentData", null);
        globalVariableInstance.set("turnOfPlayer", null);
        globalVariableInstance.set("gameOver", false);
        globalVariableInstance.set("win", 0);
        globalVariableInstance.set("gameLayoutLoaded", false);
        this.game.state.start('menu');
    }

    createPlayerProfileImage() {
        this.playerProfilePicBackground = this.game.add.image(366, 72, 'circle');
        this.playerProfilePicBackground.scale.set(120 / this.playerProfilePicBackground.width, 120 / this.playerProfilePicBackground.height);
        this.game.stage.addChild(this.playerProfilePicBackground);


        gameLayoutVariables.playerProfilePic = this.game.add.image(372, 78, 'profilePic');
        gameLayoutVariables.playerProfilePic.scale.set(108 / gameLayoutVariables.playerProfilePic.width, 108 / gameLayoutVariables.playerProfilePic.height);
        this.game.stage.addChild(gameLayoutVariables.playerProfilePic);

        let mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawCircle(426, 132, 108);
        gameLayoutVariables.playerProfilePic.mask = mask;
        this.game.stage.addChild(gameLayoutVariables.playerProfilePic.mask);

        this.playerProfilePicMarkBackground = this.game.add.image(438, 144, 'circle');
        this.playerProfilePicMarkBackground.scale.set(48 / this.playerProfilePicMarkBackground.width, 48 / this.playerProfilePicMarkBackground.height);
        this.game.stage.addChild(this.playerProfilePicMarkBackground);

        this.playerProfilePicMark = this.game.add.sprite(438, 144, 'cell');
        console.log("playerMark at time of showing on screen", globalVariableInstance.get("playerMark"));
        this.playerProfilePicMark.frame = globalVariableInstance.get("playerMark");
        this.playerProfilePicMark.scale.set(48 / this.playerProfilePicMark.width, 48 / this.playerProfilePicMark.height);
        this.game.stage.addChild(this.playerProfilePicMark);
    }

    createOpponentProfileImage() {
        this.opponentProfilePicBackground = this.game.add.image(594, 72, 'circle');
        this.opponentProfilePicBackground.scale.set(120 / this.opponentProfilePicBackground.width, 120 / this.opponentProfilePicBackground.height);
        this.game.stage.addChild(this.opponentProfilePicBackground);

        console.log(this.game.cache.checkImageKey('opponentPic'), this.load);
        gameLayoutVariables.opponentProfilePic = this.add.image(600, 78, globalVariableInstance.get("gameType") === 'solo' ? 'botPic' : "opponentPic");
        gameLayoutVariables.opponentProfilePic.scale.set(108 / gameLayoutVariables.opponentProfilePic.width);
        this.game.stage.addChild(gameLayoutVariables.opponentProfilePic);

        // console.log("Pointer");
        let mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawCircle(654, 132, 108);
        gameLayoutVariables.opponentProfilePic.mask = mask;
        this.game.stage.addChild(gameLayoutVariables.opponentProfilePic.mask);

        this.opponentProfilePicMarkBackground = this.game.add.image(594, 144, 'circle');
        this.opponentProfilePicMarkBackground.scale.set(48 / this.opponentProfilePicMarkBackground.width, 48 / this.opponentProfilePicMarkBackground.height);
        this.game.stage.addChild(this.opponentProfilePicMarkBackground);

        this.opponentProfilePicMark = this.game.add.sprite(594, 144, 'cell');
        this.opponentProfilePicMark.frame = ( (globalVariableInstance.get("playerMark") === 2) ? 1 : 2);
        this.opponentProfilePicMark.scale.set(48 / this.opponentProfilePicMark.width, 48 / this.opponentProfilePicMark.height);
        this.game.stage.addChild(this.opponentProfilePicMark);
    }

    createMusicButton() {
        this.musicButton = new MusicButton({
            game: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });
        this.game.stage.addChild(this.musicButton);
    }

    createBackButton() {
        gameLayoutVariables.backButton = new BackButton({
            game: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });
        this.game.stage.addChild(gameLayoutVariables.backButton);
    }

    createHelpButton() {
        gameLayoutVariables.help = new HelpButton({
            game: this.game,
            posX: 741,
            posY: 1584,
            label: 'helpEnd',
            anchorX: 0,
            anchorY: 0
            //0,0,1,0
        });
        this.game.stage.addChild(gameLayoutVariables.help);
    }

    createResignButton() {
        gameLayoutVariables.resign = new ResignButton({
            game: this.game,
            posX: 390,
            posY: 1584,
            label: 'resign',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0
        });
        this.game.stage.addChild(gameLayoutVariables.resign);
    }

    createBoards() {
        let boardLayout = this.game.add.sprite(57, 477, 'board');
        this.game.stage.addChild(boardLayout);

        gameLayoutVariables.resultBoard = this.game.add.sprite(315, 240, 'winBackground');
        gameLayoutVariables.resultBoard.frame = 0;
        this.game.stage.addChild(gameLayoutVariables.resultBoard);

        gameLayoutVariables.turnTextBackground = this.add.sprite(315, 240, 'turnTextBackground');
        this.game.stage.addChild(gameLayoutVariables.turnTextBackground);

        gameLayoutVariables.turnText = phaserManager.createText(this.game, {
            positionX: this.game.world.centerX,
            positionY: 276,
            messageToDisplay: (globalVariableInstance.get("gameOver") === true) ? globalVariableInstance.get("win") === globalVariableInstance.get("playerMark") ? "YOU WIN!" : "YOU LOSE!" : globalVariableInstance.get("gameType") === "solo" ? globalVariableInstance.get("playerMark") === 1 ? "YOUR TURN" : "BOT'S TURN" : globalVariableInstance.get("turnOfPlayer") === globalVariableInstance.get("playerData") ? "YOUR TURN" : "WAITING",
            align: "center",
            backgroundColor: "#5684fb",
            fill: "#fefefe",
            font: 'nunito-regular',
            fontSize: "60px",
            fontWeight: 800,
            wordWrapWidth: 355,
            anchorX: 0.5,
            anchorY: 0
        });
        this.game.stage.addChild(gameLayoutVariables.turnText);

        gameLayoutVariables.vs = phaserManager.createText(this.game, {
            positionX: 511,
            positionY: 105,
            messageToDisplay: "VS",
            align: "center",
            backgroundColor: "#5684fb",
            fill: "#fefefe",
            font: 'nunito-regular',
            fontSize: "42px",
            fontWeight: 800,
            wordWrapWidth: 58
        });
        this.game.stage.addChild(gameLayoutVariables.vs);
    }

    prepareGameBoard() {
        let count = 0;
        this.cells = this.game.add.group();
        this.game.stage.addChild(this.cells);
        this.player = 1;
        this.cells.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i < layoutConst.CELL_COLS; i++) {
            for (let j = 0; j < layoutConst.CELL_ROWS; j++) {
                let cell = this.cells.create(i * (layoutConst.CELL_WIDTH + layoutConst.CELL_WIDTH_PAD) + layoutConst.CELL_RELATIVE_LEFT, j * (layoutConst.CELL_HEIGHT + layoutConst.CELL_HEIGHT_PAD) + layoutConst.CELL_RELATIVE_TOP, 'cell');
                if (globalVariableInstance.get("gameResume") === true) {
                    cell.frame = globalVariableInstance.get("boardStatus").cells[count];
                    if (globalVariableInstance.get("boardStatus").cells[count] === 0 || globalVariableInstance.get("boardStatus").cells[count] === undefined || globalVariableInstance.get("boardStatus").cells[count] === null) {
                        cell.frame = 0;
                        cell.inputEnabled = !globalVariableInstance.get("gameOver");
                        cell.events.onInputDown.add(globalVariableInstance.get("gameType") === 'solo' ? this.clickHandlerSolo : this.clickHandlerMulti, this);
                    }
                    else {
                        cell.frame = globalVariableInstance.get("boardStatus").cells[count];
                        cell.inputEnabled = false;
                    }
                }
                else {
                    cell.frame = 0;
                    cell.inputEnabled = true;
                    cell.events.onInputDown.add(globalVariableInstance.get("gameType") === 'solo' ? this.clickHandlerSolo : this.clickHandlerMulti, this);
                }
                cell.frameIndex = count++;
                this.physics.arcade.enable(cell);
            }
        }
    }

    initialiseBot() {
        let myBot = new Bot();
        gameLayoutVariables.game = new Game(this.game, myBot);
        if (globalVariableInstance.get("playerMark") === 2 && globalVariableInstance.get("gameResume") === false) {
            this.cells.children[gameLayoutVariables.initialMark].frame = 1;
            this.cells.children[gameLayoutVariables.initialMark].inputEnabled = false;
        }
        if (globalVariableInstance.get("gameOver") === false) {
            saveGameData(this.game, false);// To store the initial state of the Game. Even if the user or bot haven't made any move.
        }
        myBot.gameAssigned(gameLayoutVariables.game);
        gameLayoutVariables.game.start();
        if (globalVariableInstance.get("gameOver") === true && globalVariableInstance.get("win") === 0) {
            gameEndHandler(this.game, 1);
        }
    }

    verifyOpponentAffiliationStatus() {
        if (globalVariableInstance.get("opponentData") !== null && globalVariableInstance.get("opponentData").affiliation === "accepted") {
            console.log("Opponent Accepted.");
        }
        else if (globalVariableInstance.get("opponentData").affiliation === null) {
            console.log("No Opponent Found.");
        }
        else if (globalVariableInstance.get("opponentData").affiliation === "invited") {
            console.log("Friend hasn't responded to invitation");
        }
        else if (globalVariableInstance.get("opponentData").affiliation === "rejected") {
            console.log("Friend rejected the invitation");
        }
        else if (globalVariableInstance.get("opponentData").affiliation === "left") {
            console.log("Friend left the room.");
        }
        else {
            console.log("Opponent not on Kapow. Waiting");
        }
    }

    recreateResultForEndedGame() {
        if (globalVariableInstance.get("gameOver") === true) {
            if (globalVariableInstance.get("turnOfPlayer") === 0) {
                gameEndHandler(this.game, 0);
            }
            else if (globalVariableInstance.get("turnOfPlayer").id === globalVariableInstance.get("opponentData").id) {
                drawWinningLine(this.game);
                gameEndHandler(this.game, 2);
            }
            else if (globalVariableInstance.get("turnOfPlayer").id === globalVariableInstance.get("playerData").id) {
                drawWinningLine(this.game);
                gameEndHandler(this.game, 1);
            }
        }
    }
}
