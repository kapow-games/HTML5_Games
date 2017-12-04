'use strict';

import phaserManager from "../util/phaserManager";
import gameInfo from "../objects/store/GameInfo";
import handleGameEnd from '../util/gameEnd';
import {drawWinningLine} from '../util/gameEnd';
import layoutStore from "../objects/store/layoutStore";
import Bot from "../objects/bot/Bot";
import Game from "../objects/bot/Game";
import Background from "../objects/widgets/icons/Background";
import ResignButton from "../objects/widgets/button/ResignButton";
import saveGameData from "../util/saveGameData";
import MusicButton from "../objects/widgets/button/MusicButton";
import GameState from "../objects/bot/GameState";
import BackButton from "../objects/widgets/button/BackButton";
import HelpButton from "../objects/widgets/button/HelpButton";
import GAME_CONST from "../const/GAME_CONST";
import MESSAGE from "../const/MESSAGES";

export class Play extends Phaser.State { // TODO : fix later. this screen has too much logic. Create a new controller class and move logic there
    preload() {
        gameInfo.set("screenState", 1);
        this.loadOpponentImage();
        layoutStore.clickBlocked = false;
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
        this.game.stage.removeChild(layoutStore.backgroundImage);
        this.game.stage.removeChild(layoutStore.turnText);
        this.game.stage.removeChild(layoutStore.turnTextBackground);
        this.game.stage.removeChild(layoutStore.backButton);
        this.game.stage.removeChild(layoutStore.musicButton);
        this.game.stage.removeChild(layoutStore.resultBoard);
        this.game.stage.removeChild(layoutStore.help);
        this.game.stage.removeChild(this.playerProfilePicMark);
        this.game.stage.removeChild(this.playerProfilePicMarkBackground);
        this.game.stage.removeChild(this.playerProfilePicBackground);
        this.game.stage.removeChild(layoutStore.playerProfilePic);
        this.game.stage.removeChild(layoutStore.playerProfilePic.mask);
        this.game.stage.removeChild(this.opponentProfilePicMark);
        this.game.stage.removeChild(this.opponentProfilePicMarkBackground);
        this.game.stage.removeChild(this.opponentProfilePicBackground);
        this.game.stage.removeChild(layoutStore.opponentProfilePic);
        this.game.stage.removeChild(layoutStore.opponentProfilePic.mask);
        this.game.stage.removeChild(this.boardLayout);
        this.game.stage.removeChild(layoutStore.vs);
        this.game.stage.removeChild(layoutStore.rematch);
        this.game.stage.removeChild(layoutStore.otherShare);
        this.game.stage.removeChild(layoutStore.twitterShare);
        this.game.stage.removeChild(layoutStore.fbShare);
        for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
            this.cells.children[i].inputEnabled = false;
        }
        this.game.stage.removeChild(this.cells);
    }

    clickHandlerSolo(sprite, pointer) {
        var cell = this.cells.children; // TODO : cell is an array . plural ?
        if (sprite.frame === 0) {
            layoutStore.backgroundImage.enableInput(true);
            layoutStore.backgroundImage.setInputPriority(2);
            layoutStore.backButton.setInputPriority(2);
            layoutStore.musicButton.setInputPriority(2);
            layoutStore.resign.setInputPriority(2);
            console.log("Player Mark", gameInfo.get("playerMark"));
            sprite.frame = gameInfo.get("playerMark");
            sprite.scale.setTo(0);
            let popUpMark = this.game.add.tween(sprite.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
            popUpMark.start();
            console.log("Player's Sprite Set");

            layoutStore.turnText.text = MESSAGE.BOT_TURN;
            layoutStore.opponentProfilePic.alpha = 1;
            layoutStore.playerProfilePic.alpha = 0.3;


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
            layoutStore.backgroundImage.enableInput(true);
            layoutStore.backgroundImage.setInputPriority(2);
            layoutStore.backButton.setInputPriority(2);
            layoutStore.musicButton.setInputPriority(2);
            layoutStore.resign.setInputPriority(2);
            console.log("Player's Sprite Set");

            layoutStore.turnText.text = gameInfo.get("gameType") === "solo" ? MESSAGE.BOT_TURN : MESSAGE.WAITING;
            layoutStore.opponentProfilePic.alpha = 1;
            layoutStore.playerProfilePic.alpha = 0.3;

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
                        layoutStore.backgroundImage.setInputPriority(1);
                        layoutStore.backgroundImage.enableInput(false);
                        layoutStore.backButton.setInputPriority(1);
                        layoutStore.musicButton.setInputPriority(1);
                        layoutStore.resign.setInputPriority(1);
                    }
                }.bind(this),
                function (error) {
                    sprite.frame = 0;
                    let tempCells = gameInfo.get("boardStatus").cells;
                    tempCells[sprite.frameIndex] = 0;
                    gameInfo.set("boardStatus", {cells: tempCells});
                    gameInfo.set("turnOfPlayer", gameInfo.get("playerData"));
                    layoutStore.backgroundImage.setInputPriority(1);
                    layoutStore.backgroundImage.enableInput(false);
                    layoutStore.backButton.setInputPriority(1);
                    layoutStore.musicButton.setInputPriority(1);
                    layoutStore.resign.setInputPriority(1);

                    layoutStore.turnText.text = MESSAGE.YOUR_TURN;
                    layoutStore.opponentProfilePic.alpha = 0.3;
                    layoutStore.playerProfilePic.alpha = 1;

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
        for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
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
            layoutStore.turnText.text = MESSAGE.YOUR_TURN;
            layoutStore.opponentProfilePic.alpha = 0.3;
            layoutStore.playerProfilePic.alpha = 1;
            layoutStore.backgroundImage.setInputPriority(1);
            layoutStore.backgroundImage.enableInput(false);
            layoutStore.backButton.setInputPriority(1);
            layoutStore.musicButton.setInputPriority(1);
            layoutStore.resign.setInputPriority(1);
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
        layoutStore.backgroundImage = new Background({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
        this.game.stage.addChild(layoutStore.backgroundImage);
    }

    backButtonHandler() { // TODO : too many objects to set on store. pass object
        console.log("WebView BACK presed.");
        kapow.unloadRoom(function () {
            console.log('Room Succesfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        let resetVar = {
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
        for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
            resetVar.boardStatus.cells.push(undefined);
        }
        gameInfo.setBulk(resetVar);
        this.game.state.start('Menu');
    }

    createPlayerProfileImage() {
        this.playerProfilePicBackground = this.game.add.image(366, 72, 'circle');
        this.playerProfilePicBackground.scale.set(120 / this.playerProfilePicBackground.width, 120 / this.playerProfilePicBackground.height);
        this.game.stage.addChild(this.playerProfilePicBackground);

        layoutStore.playerProfilePic = this.game.add.image(372, 78, 'profilePic');
        layoutStore.playerProfilePic.scale.set(108 / layoutStore.playerProfilePic.width, 108 / layoutStore.playerProfilePic.height);
        this.game.stage.addChild(layoutStore.playerProfilePic);

        let mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawCircle(426, 132, 108);
        layoutStore.playerProfilePic.mask = mask;
        this.game.stage.addChild(layoutStore.playerProfilePic.mask);

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
        layoutStore.opponentProfilePic = this.add.image(600, 78, gameInfo.get("gameType") === 'solo' ? 'botPic' : "opponentPic");
        layoutStore.opponentProfilePic.scale.set(108 / layoutStore.opponentProfilePic.width);
        this.game.stage.addChild(layoutStore.opponentProfilePic);

        // console.log("Pointer");
        let mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawCircle(654, 132, 108);
        layoutStore.opponentProfilePic.mask = mask;
        this.game.stage.addChild(layoutStore.opponentProfilePic.mask);

        this.opponentProfilePicMarkBackground = this.game.add.image(594, 144, 'circle');
        this.opponentProfilePicMarkBackground.scale.set(48 / this.opponentProfilePicMarkBackground.width, 48 / this.opponentProfilePicMarkBackground.height);
        this.game.stage.addChild(this.opponentProfilePicMarkBackground);

        this.opponentProfilePicMark = this.game.add.sprite(594, 144, 'cell');
        this.opponentProfilePicMark.frame = ( (gameInfo.get("playerMark") === 2) ? 1 : 2);
        this.opponentProfilePicMark.scale.set(48 / this.opponentProfilePicMark.width, 48 / this.opponentProfilePicMark.height);
        this.game.stage.addChild(this.opponentProfilePicMark);
    }

    createMusicButton() {
        layoutStore.musicButton = new MusicButton({
            game: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });
        this.game.stage.addChild(layoutStore.musicButton);
    }

    createBackButton() {
        layoutStore.backButton = new BackButton({
            game: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });
        this.game.stage.addChild(layoutStore.backButton);
    }

    createHelpButton() {
        layoutStore.help = new HelpButton({
            game: this.game,
            posX: 741,
            posY: 1584,
            label: 'helpEnd',
            anchorX: 0,
            anchorY: 0
            //0,0,1,0
        });
        this.game.stage.addChild(layoutStore.help);
    }

    createResignButton() {
        layoutStore.resign = new ResignButton({
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
        this.game.stage.addChild(layoutStore.resign);
    }

    createBoards() {
        this.boardLayout = this.game.add.sprite(57, 477, 'board');
        this.game.stage.addChild(this.boardLayout);

        layoutStore.confetti = this.game.add.image(111, 201, 'confetti');
        layoutStore.confetti.kill();
        this.game.stage.addChild(layoutStore.confetti);

        layoutStore.resultBoard = this.game.add.sprite(315, 240, 'winBackground');
        layoutStore.resultBoard.frame = 0;
        this.game.stage.addChild(layoutStore.resultBoard);

        layoutStore.turnTextBackground = this.add.sprite(315, 240, 'turnTextBackground');
        this.game.stage.addChild(layoutStore.turnTextBackground);

        console.log("Turn data",gameInfo.get("turnOfPlayer"));
        layoutStore.turnText = phaserManager.createText(this.game, {
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
        this.game.stage.addChild(layoutStore.turnText);

        layoutStore.vs = phaserManager.createText(this.game, {
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
        this.game.stage.addChild(layoutStore.vs);
    }

    prepareGameBoard() {
        let count = 0;
        console.log("BoardStatus on creating play screen:", gameInfo.get("gameResume"));
        this.cells = this.game.add.group();
        this.game.stage.addChild(this.cells);
        this.cells.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i < GAME_CONST.GRID.CELL_COLS; i++) {
            for (let j = 0; j < GAME_CONST.GRID.CELL_ROWS; j++) {
                let cell = this.cells.create(i * (GAME_CONST.GRID.CELL_WIDTH + GAME_CONST.GRID.CELL_WIDTH_PAD) + GAME_CONST.GRID.CELL_RELATIVE_LEFT + (GAME_CONST.GRID.CELL_WIDTH) * 0.5, j * (GAME_CONST.GRID.CELL_HEIGHT + GAME_CONST.GRID.CELL_HEIGHT_PAD) + GAME_CONST.GRID.CELL_RELATIVE_TOP + (GAME_CONST.GRID.CELL_HEIGHT) * 0.5, 'cell');
                cell.anchor.setTo(0.5);
                if (gameInfo.get("gameResume") === true) {
                    cell.frame = gameInfo.get("boardStatus").cells[count];
                    if (!gameInfo.get("boardStatus").cells[count] || !gameInfo.get("boardStatus").cells[count] || !gameInfo.get("boardStatus").cells[count]) {
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
        let gameBot = new Bot();
        this.botGame = new Game(this.game, gameBot);

        if (gameInfo.get("playerMark") === 2 && gameInfo.get("gameResume") === false) {
            this.cells.children[layoutStore.initialMark].frame = 1;
            this.cells.children[layoutStore.initialMark].inputEnabled = false;
        }
        if (gameInfo.get("gameOver") === false) {
            saveGameData(this.game, false);// To store the initial state of the Game. Even if the user or bot haven't made any move.
        }
        gameBot.storeGameDetail(this.botGame);
        this.botGame.start();
        if (gameInfo.get("gameOver") === true && gameInfo.get("win") === 0) {
            handleGameEnd(this.game, 1); // TODO : better name . HandleGameEnd ?
        }
    }

    verifyOpponentAffiliationStatus() { // TODO : no verification is done . only console log :D
        if (gameInfo.get("opponentData") && gameInfo.get("opponentData").affiliation === GAME_CONST.AFFILIATION.ACCEPTED) {
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
