'use strict';
import GameState from "./GameState";
import {gameLayoutVariables} from "./gameLayoutVariables";
import {gameEndHandler} from "../util/gameEnd";


export default class Game { // TODO : formatting , extra line . Only one extra line before class and import
    constructor(phaserGameObj, bot) { // TODO : just game ?
        this.phaserGame = phaserGameObj;
        this.bot = bot;
        this.currentState = new GameState();
        this.currentState.board = new Array(9); // TODO : is it a CONSTANT ? extract such CONSTANTS
        for (let i = 0; i < 9; i++) { // TODO : move to new line after 120 chars
            this.currentState.board[i] = globalVariableInstance.get("boardStatus").cells[i] !== undefined ? globalVariableInstance.get("boardStatus").cells[i] : 0;
        }
        this.currentState.turn = 1;//playerMark === 1 ? 2 : 1 ;
        if (globalVariableInstance.get("playerMark") === 2 && globalVariableInstance.get("gameResume") === false) {
            var randomCell = Math.floor(Math.random() * CELL_ROWS * CELL_COLS);
            this.currentState.board[randomCell] = 1;
            gameLayoutVariables.initialMark = randomCell;
        }
        this.gameStatus = -1;// To indicate game begining
    }

    moveTo(state) {
        this.currentState = state;
        if (state.isTerminal()) { // TODO : logic can be simplified
            this.gameStatus = 3; // Indicating game Over
            if (this.currentState.boardResult === 1) {
                globalVariableInstance.set("win", 1);
            }
            else if (this.currentState.boardResult === 2) {
                globalVariableInstance.set("win", 2);
            }
            else {
                globalVariableInstance.set("win", 0);
            }
            if (globalVariableInstance.get("win") !== 0) {
                if (globalVariableInstance.get("win") === globalVariableInstance.get("playerMark")) {
                    gameLayoutVariables.turnText.text = "  YOU WIN!";
                    gameEndHandler(this.phaserGame, 2);
                }
                else {
                    gameLayoutVariables.turnText.text = "  YOU LOSE!";
                    gameEndHandler(this.phaserGame, 1);
                }
            }
            else {
                gameLayoutVariables.turnText.text = "GAME DRAW!";
                gameEndHandler(this.phaserGame, 0);
            }
            if (globalVariableInstance.get("win") !== 0) {
                switch (gameLayoutVariables.winningMarkLine) {
                    case 0 : {
                        let matchPosition = this.phaserGame.add.sprite(552, 633, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 90;
                        break;
                    }
                    case 1 : {
                        let matchPosition = this.phaserGame.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 90;
                        break;
                    }
                    case 2 : {
                        let matchPosition = this.phaserGame.add.sprite(552, 1263, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 90;
                        break;
                    }
                    case 3 : {
                        let matchPosition = this.phaserGame.add.sprite(222, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        break;
                    }
                    case 4 : {
                        let matchPosition = this.phaserGame.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        break;
                    }
                    case 5 : {
                        let matchPosition = this.phaserGame.add.sprite(882, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        break;
                    }
                    case 6 : {
                        let matchPosition = this.phaserGame.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = -45;
                        break;
                    }
                    case 7 : {
                        let matchPosition = this.phaserGame.add.sprite(552, 948, 'rectangle');
                        matchPosition.anchor.setTo(0.5);
                        matchPosition.angle = 45;
                        break;
                    }
                }
            }
        }
        else {
            if (this.currentState.turn === 2) {
                this.bot.notifyTurn(2);// TODO : rename  to play move ?
            }
            // Otherwise, Player's Turn
        }
    }

    start() {
        if (this.gameStatus === -1) {
            this.moveTo(this.currentState);
            this.gameStatus = 0;
        }
    }

    score(state) {
        if (state.result !== 0) { // TODO : should the current state be changed too ?
            if (state.boardResult === 1) {
                //X won
                return 10 - state.oMovesCount;
            }
            else if (state.boardResult === 2) {
                //O won
                return -10 + state.oMovesCount;
            }
            else {
                //Draw
                return 0;
            }
        }
    }
}