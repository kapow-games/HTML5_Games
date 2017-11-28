'use strict';

import phaserManager from "../util/phaserManager";
import gameInfo from "../objects/store/GameInfoStore";
import handleGameEnd from '../util/gameEnd';
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
import GAME_CONST from "../gameParam/gameConst";
import MESSAGE from "../gameParam/message";
import AFFILIATION from "../gameParam/affiliation";

export class Play extends Phaser.State { // TODO : fix laer. this screen has too much logic. Create a new controller class and move logic there
    preload() {
        gameInfo.set("screenState", 1);
        this.loadOpponentImage();
        gameLayoutVariables.clickBlocked = false;
    }

    create() {
        console.log("Loading Game Layout.");

        this.createBackground();
        this.createBoards();
        this.createResignButton();
        this.createHelpButton();
        this.createPlayerProfileImage();
        this.createOpponentProfileImage();
        this.createBackButton();
        this.createMusicButton();

        gameInfo.set("win", 0);

        this.prepareGameBoard();

        if (gameInfo.get("gameType") === 'solo') {
            this.initialiseBot();
        }
        else if (gameInfo.get("gameType") === 'friend') {
            this.verifyOpponentAffiliationStatus();
            this.recreateResultForEndedGame();
        }

        gameInfo.set("gameLayoutLoaded", true);

        this.physics.startSystem(Phaser.Physics.ARCADE);
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
        this.game.stage.removeChild(this.boardLayout);
        this.game.stage.removeChild(gameLayoutVariables.vs);
        this.game.stage.removeChild(gameLayoutVariables.rematch);
        this.game.stage.removeChild(gameLayoutVariables.otherShare);
        this.game.stage.removeChild(gameLayoutVariables.twitterShare);
        this.game.stage.removeChild(gameLayoutVariables.fbShare);
        for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
            this.cells.children[i].inputEnabled = false;
        }
        this.game.stage.removeChild(this.cells);
    }

    clickHandlerSolo(sprite, pointer) {
        var cell = this.cells.children; // TODO : cell is an array . plural ?
        if (sprite.frame === 0) {
            gameLayoutVariables.backgroundImage.enableInput(true);
            gameLayoutVariables.backgroundImage.setInputPriority(2);
            gameLayoutVariables.backButton.setInputPriority(2);
            this.musicButton.setInputPriority(2);
            gameLayoutVariables.resign.setInputPriority(2);
            console.log("Player Mark", gameInfo.get("playerMark"));
            sprite.frame = gameInfo.get("playerMark");
            sprite.scale.setTo(0);
            let popUpMark = this.game.add.tween(sprite.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
            popUpMark.start();
            console.log("Player's Sprite Set");

            gameLayoutVariables.turnText.text = MESSAGE.BOT_TURN;
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
        console.log(gameInfo.get("turnOfPlayer"), gameInfo.get("playerData"), sprite.frame);

        if (gameInfo.get("turnOfPlayer") !== undefined && gameInfo.get("turnOfPlayer").id === gameInfo.get("playerData").id && sprite.frame === 0) {
            gameLayoutVariables.backgroundImage.enableInput(true);
            gameLayoutVariables.backgroundImage.setInputPriority(2);
            gameLayoutVariables.backButton.setInputPriority(2);
            this.musicButton.setInputPriority(2);
            gameLayoutVariables.resign.setInputPriority(2);
            console.log("Player's Sprite Set");

            gameLayoutVariables.turnText.text = gameInfo.get("gameType") === "solo" ? MESSAGE.BOT_TURN : MESSAGE.WAITING;
            gameLayoutVariables.opponentProfilePic.alpha = 1;
            gameLayoutVariables.playerProfilePic.alpha = 0.3;

            gameInfo.set("turnOfPlayer", undefined);

            let tempCells = gameInfo.get("boardStatus").cells;
            tempCells[sprite.frameIndex] = gameInfo.get("playerMark");
            gameInfo.set("boardStatus", {cells: tempCells});

            sprite.frame = gameInfo.get("playerMark");
            sprite.alpha = 0.3;

            let sentData = {
                board: gameInfo.get("boardStatus").cells,
                playerTurn: gameInfo.get("playerData").id,
                opponentTurn: gameInfo.get("opponentData").id,
                roomID: gameInfo.get("room").roomId
            };
            console.log("Client - invokeRPC makeMove", sentData);
            kapow.invokeRPC("makeMove", sentData,
                function (obj) {
                    console.log("makeMove - success : obj: \n", obj);
                    sprite.frame = gameInfo.get("playerMark");
                    sprite.alpha = 1;
                    if (obj.result === "lost") {
                        drawWinningLine(this.game);
                        handleGameEnd(this.game, 2);
                        console.log("You won");
                    }
                    else if (obj.result === "draw") {
                        console.log("Draw");
                        handleGameEnd(this.game, 0);
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
                    let tempCells = gameInfo.get("boardStatus").cells;
                    tempCells[sprite.frameIndex] = 0;
                    gameInfo.set("boardStatus", {cells: tempCells});
                    gameInfo.set("turnOfPlayer", gameInfo.get("playerData"));
                    gameLayoutVariables.backgroundImage.setInputPriority(1);
                    gameLayoutVariables.backgroundImage.enableInput(false);
                    gameLayoutVariables.backButton.setInputPriority(1);
                    this.musicButton.setInputPriority(1);
                    gameLayoutVariables.resign.setInputPriority(1);

                    gameLayoutVariables.turnText.text = MESSAGE.YOUR_TURN;
                    gameLayoutVariables.opponentProfilePic.alpha = 0.3;
                    gameLayoutVariables.playerProfilePic.alpha = 1;

                    console.log("makeMove - failure", error);
                }.bind(this)
            );
        }
    }

    nextMove(sprite, cell) {
        let next = new GameState(this.botGame.currentState);
        console.log("Click Acknowledged");
        next.board[sprite.frameIndex] = gameInfo.get("playerMark");
        sprite.frame = gameInfo.get("playerMark");
        console.log("Player's move logged");
        next.nextTurn();
        this.botGame.moveTo(next);
        let changePos;
        for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
            if (cell[i].frame !== this.botGame.currentState.board[i]) {
                changePos = i;
                cell[i].frame = this.botGame.currentState.board[i];
            }
        }
        cell[changePos].scale.setTo(0);
        let popUpMark = this.game.add.tween(cell[changePos].scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        popUpMark.start();
        if (gameInfo.get("win") === 0 && this.botGame.gameStatus !== 3) {
            saveGameData(this.game, false);
            gameLayoutVariables.turnText.text = MESSAGE.YOUR_TURN;
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
        if (gameInfo.get("gameType") === 'friend') {
            if (gameInfo.get("opponentData") !== null) {
                this.game.load.image('opponentPic', gameInfo.get("opponentData").profileImage);
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

    backButtonHandler() { // TODO : too many objects to set on store. pass object
        console.log("WebView BACK presed.");
        kapow.unloadRoom(function () {
            console.log('Room Succesfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        let resetVar ={
            gameResume: false,
            room: null,
            playerMark: 0,
            gameType: null,
            botLevel: -1,
            boardStatus: {cells: []},
            opponentData: null,
            turnOfPlayer: null,
            gameOver: false,
            win: 0,
            gameLayoutLoaded: false
        };
        for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
            resetVar.boardStatus.cells.push(undefined);
        }
        gameInfo.setBulk(resetVar);
        this.game.state.start('Menu');
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
        console.log("playerMark at time of showing on screen", gameInfo.get("playerMark"));
        this.playerProfilePicMark.frame = gameInfo.get("playerMark");
        this.playerProfilePicMark.scale.set(48 / this.playerProfilePicMark.width, 48 / this.playerProfilePicMark.height);
        this.game.stage.addChild(this.playerProfilePicMark);
    }

    createOpponentProfileImage() {
        this.opponentProfilePicBackground = this.game.add.image(594, 72, 'circle');
        this.opponentProfilePicBackground.scale.set(120 / this.opponentProfilePicBackground.width, 120 / this.opponentProfilePicBackground.height);
        this.game.stage.addChild(this.opponentProfilePicBackground);

        console.log(this.game.cache.checkImageKey('opponentPic'), this.load);
        gameLayoutVariables.opponentProfilePic = this.add.image(600, 78, gameInfo.get("gameType") === 'solo' ? 'botPic' : "opponentPic");
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
        this.opponentProfilePicMark.frame = ( (gameInfo.get("playerMark") === 2) ? 1 : 2);
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
        this.boardLayout = this.game.add.sprite(57, 477, 'board');
        this.game.stage.addChild(this.boardLayout);

        gameLayoutVariables.confetti = this.game.add.image(111, 201, 'confetti');
        gameLayoutVariables.confetti.kill();
        this.game.stage.addChild(gameLayoutVariables.confetti);

        gameLayoutVariables.resultBoard = this.game.add.sprite(315, 240, 'winBackground');
        gameLayoutVariables.resultBoard.frame = 0;
        this.game.stage.addChild(gameLayoutVariables.resultBoard);

        gameLayoutVariables.turnTextBackground = this.add.sprite(315, 240, 'turnTextBackground');
        this.game.stage.addChild(gameLayoutVariables.turnTextBackground);

        gameLayoutVariables.turnText = phaserManager.createText(this.game, {
            positionX: this.game.world.centerX,
            positionY: 276,
            message: (gameInfo.get("gameOver") === true) ? gameInfo.get("win") === gameInfo.get("playerMark") ? MESSAGE.WIN : MESSAGE.LOSE : gameInfo.get("gameType") === "solo" ? gameInfo.get("playerMark") === 1 ? MESSAGE.YOUR_TURN : MESSAGE.BOT_TURN : gameInfo.get("turnOfPlayer") === gameInfo.get("playerData") ? MESSAGE.YOUR_TURN : MESSAGE.WAITING,
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
            message: MESSAGE.VS,
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
        console.log("BoardStatus on creating play screen:",gameInfo.get("gameResume"));
        this.cells = this.game.add.group();
        this.game.stage.addChild(this.cells);
        this.cells.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i < GAME_CONST.CELL_COLS; i++) {
            for (let j = 0; j < GAME_CONST.CELL_ROWS; j++) {
                let cell = this.cells.create(i * (GAME_CONST.CELL_WIDTH + GAME_CONST.CELL_WIDTH_PAD) + GAME_CONST.CELL_RELATIVE_LEFT + (GAME_CONST.CELL_WIDTH) * 0.5, j * (GAME_CONST.CELL_HEIGHT + GAME_CONST.CELL_HEIGHT_PAD) + GAME_CONST.CELL_RELATIVE_TOP + (GAME_CONST.CELL_HEIGHT) * 0.5, 'cell');
                cell.anchor.setTo(0.5);
                if (gameInfo.get("gameResume") === true) {
                    cell.frame = gameInfo.get("boardStatus").cells[count];
                    // TODO : too complex falsy value check can be simplified
                    if ( !gameInfo.get("boardStatus").cells[count] || !gameInfo.get("boardStatus").cells[count] || !gameInfo.get("boardStatus").cells[count]) {
                        cell.frame = 0;
                        cell.inputEnabled = !gameInfo.get("gameOver");
                        cell.events.onInputDown.add(gameInfo.get("gameType") === 'solo' ? this.clickHandlerSolo : this.clickHandlerMulti, this);
                    }
                    else {
                        cell.frame = gameInfo.get("boardStatus").cells[count];
                        cell.inputEnabled = false;
                    }
                }
                else {
                    cell.frame = 0;
                    cell.inputEnabled = true;
                    cell.events.onInputDown.add(gameInfo.get("gameType") === 'solo' ? this.clickHandlerSolo : this.clickHandlerMulti, this);
                }
                cell.frameIndex = count++;
                this.physics.arcade.enable(cell);
            }
        }
    }

    initialiseBot() { // TODO : fix later , this does more then initBot . Seperate it
        let gameBot = new Bot(); // TODO : rename to gameBot ?
        this.botGame = new Game(this.game, gameBot); // TODO :  LayoutStore storing game ??

        if (gameInfo.get("playerMark") === 2 && gameInfo.get("gameResume") === false) {
            this.cells.children[gameLayoutVariables.initialMark].frame = 1;
            this.cells.children[gameLayoutVariables.initialMark].inputEnabled = false;
        }
        if (gameInfo.get("gameOver") === false) { //
            saveGameData(this.game, false);// To store the initial state of the Game. Even if the user or bot haven't made any move.
        }// TODO fix later: is the save needed ?
        gameBot.assignGame(this.botGame); // TODO : fix later.. use names like assignName as an action which stores data . assignGame is a boolean check function name.
        this.botGame.start(); // TODO : starting game from layout store ? Should change this flow .
        if (gameInfo.get("gameOver") === true && gameInfo.get("win") === 0) {
            handleGameEnd(this.game, 1); // TODO : better name . HandleGameEnd ?
        }
    }

    verifyOpponentAffiliationStatus() { // TODO : no verification is done . only console log :D
        if (gameInfo.get("opponentData") && gameInfo.get("opponentData").affiliation === AFFILIATION.ACCEPTED) { // TODO : fix later . extract enum Affiliation . String comparision are more prone to errors
            console.log("Opponent Accepted.");
        }
        else if (gameInfo.get("opponentData").affiliation === null) {
            console.log("No Opponent Found.");
        }
        else if (gameInfo.get("opponentData").affiliation === AFFILIATION.INVITED) {
            console.log("Friend hasn't responded to invitation");
        }
        else if (gameInfo.get("opponentData").affiliation === AFFILIATION.REJECTED) {
            console.log("Friend rejected the invitation");
        }
        else if (gameInfo.get("opponentData").affiliation === AFFILIATION.LEFT) {
            console.log("Friend left the room.");
        }
        else {
            console.log("Opponent not on Kapow. Waiting");
        }
    }

    recreateResultForEndedGame() {
        if (gameInfo.get("gameOver") === true) {
            if (gameInfo.get("turnOfPlayer") === 0) {
                handleGameEnd(this.game, 0);
            }
            else if (gameInfo.get("turnOfPlayer").id === gameInfo.get("opponentData").id) {
                drawWinningLine(this.game);
                handleGameEnd(this.game, 2);
            }
            else if (gameInfo.get("turnOfPlayer").id === gameInfo.get("playerData").id) {
                drawWinningLine(this.game);
                handleGameEnd(this.game, 1);
            }
        }
    }
}
