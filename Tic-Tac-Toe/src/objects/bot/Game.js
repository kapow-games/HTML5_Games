'use strict';

import GameState from "./GameState";
import gameLayoutVariables from "../store/gameLayoutVariables";
import gameEndHandler from "../../util/gameEnd";
import gameInfo from "../store/GameInfoStore";
import gameConst from "../../gameParam/gameConst";
import GAME_RESULT from "../../gameParam/gameResult";

export default class Game { // TODO : formatting , extra line . Only one extra line before class and import
    constructor(game, bot) { // TODO : just game ? @sukhmeet don't want to use game. also used as an object in game.js.
        this.game = game;
        this.bot = bot;
        this.currentState = new GameState();
        this.currentState.board = []; // TODO : is it a CONSTANT ? extract such CONSTANTS
        for (let i = 0; i < gameConst.CELL_COUNT ; i++) { // TODO : move to new line after 120 chars
            this.currentState.board.push(gameInfo.get("boardStatus").cells[i] !== undefined ?
                gameInfo.get("boardStatus").cells[i] : 0);
        }
        this.currentState.turnOfPlayer = true;
        if (gameInfo.get("playerMark") === gameConst.O && gameInfo.get("gameResume") === false) {
            let randomCell = Math.floor(Math.random() * gameConst.CELL_COUNT);
            this.currentState.board[randomCell] = 1;
            gameLayoutVariables.initialMark = randomCell;
        }
        this.gameStatus = GAME_RESULT.IN_PROGRESS;// To indicate game beginning
    }

    // Advances game to next state
    moveTo(state) {
        this.currentState = state;
        if (this.currentState.isTerminal()) { // TODO : logic can be simplified
            this.gameStatus = GAME_RESULT.FINISHED; // Indicating game Over  // TODO : can use alias enums
            if (this.currentState.boardResult === 1) {
                gameInfo.set("win", 1);
            }
            else if (this.currentState.boardResult === 2) {
                gameInfo.set("win", 2);
            }
            else {
                gameInfo.set("win", 0);
            }
            if (gameInfo.get("win") !== 0) {
                if (gameInfo.get("win") === gameInfo.get("playerMark")) {
                    gameLayoutVariables.turnText.text = "YOU WIN!"; // TODO : extra space intentional ?
                    gameEndHandler(this.game, 2);
                }
                else {
                    gameLayoutVariables.turnText.text = "YOU LOSE!";
                    gameEndHandler(this.game, 1);
                }
            }
            else {
                gameLayoutVariables.turnText.text = "GAME DRAW!"; // TODO : no extra space ?
                gameEndHandler(this.game, 0);
            }
            if (gameInfo.get("win") !== 0) {
                let matchPosition;
                switch (gameLayoutVariables.winningMarkLine) {
                    case 0 : {
                        matchPosition = this.game.add.sprite(552, 633, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 90;
                        break;
                    }
                    case 1 : {
                        matchPosition = this.game.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 90;
                        break;
                    }
                    case 2 : {
                        matchPosition = this.game.add.sprite(552, 1263, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 90;
                        break;
                    }
                    case 3 : {
                        matchPosition = this.game.add.sprite(222, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        break;
                    }
                    case 4 : {
                        matchPosition = this.game.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        break;
                    }
                    case 5 : {
                        matchPosition = this.game.add.sprite(882, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        break;
                    }
                    case 6 : {
                        matchPosition = this.game.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = -45;
                        break;
                    }
                    case 7 : {
                        matchPosition = this.game.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 45;
                        break;
                    }
                    default : {
                        console.log("Game Result inconsistent");
                    }
                }
                this.game.stage.addChild(matchPosition);
            }
        }
        else {
            if (!this.currentState.turnOfPlayer) {
                this.bot.notifyTurn(false);// TODO : rename to play move ?
            }
            // Otherwise, Player's Turn
        }
    }

    start() {
        if (this.gameStatus === -1) {
            this.moveTo(this.currentState);
            this.gameStatus = GAME_RESULT.IN_PROGRESS;
        }
    }

    score(state) {
        if (state.result !== 0) { // TODO : should the current state be changed too ?
            /*
                No this function is to
                calculate the the score of any state. It can be a state as per future move too, hence not necessarily
                current state.
            */
            if (state.boardResult === 1) {
                //X won
                return 10 - state.movesCount;
            }
            else if (state.boardResult === 2) {
                //O won
                return -10 + state.movesCount;
            }
            else {
                //Draw
                return 0;
            }
        }
    }
}