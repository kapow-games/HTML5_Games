'use strict';

import GameState from "./GameState";
import layoutStore from "../store/layoutStore";
import gameInfo from "../store/GameInfo";
import GAME_CONST from "../../const/GAME_CONST";
import GameManager from "../../controller/GameManager";

export default class Game {
    constructor(ticTacToeGame, bot) {
        this.game = ticTacToeGame;
        this.bot = bot;
        this.currentState = new GameState();
        this.currentState.board = [];
        for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
            this.currentState.board.push(gameInfo.get("boardStatus").cells[i] ?
                gameInfo.get("boardStatus").cells[i] : 0);
        }
        this.currentState.turnOfPlayer = true;
        if (gameInfo.get("playerMark") === GAME_CONST.TURN.O && gameInfo.get("gameResume") === false) {
            let randomCell = Math.floor(Math.random() * GAME_CONST.GRID.CELL_COUNT);
            this.currentState.board[randomCell] = 1;
            layoutStore.initialMark = randomCell;
        }
        this.gameStatus = GAME_CONST.GAME_RESULT.IN_PROGRESS;// To indicate game beginning
    }

    // Advances game to next state
    moveTo(state) {
        this.currentState = state;
        if (this.currentState.isTerminal()) { // TODO : logic can be simplified
            this.gameStatus = GAME_CONST.GAME_RESULT.FINISHED;
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
                    layoutStore.turnText.text = "YOU WIN!";
                    GameManager.endGame(2);
                }
                else {
                    layoutStore.turnText.text = "YOU LOSE!";
                    GameManager.endGame(1);
                }
            }
            else {
                layoutStore.turnText.text = "GAME DRAW!";
                GameManager.endGame(0);
            }
            if (gameInfo.get("win") !== 0) {
                let matchPosition;
                console.log("Drawing winning line");
                switch (layoutStore.winningMarkLine) {
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
                this.bot.playMove(false);// TODO : rename to play move ?
            }
            // Otherwise, Player's Turn
        }
    }

    start() {
        if (this.gameStatus === -1) {
            this.moveTo(this.currentState);
            this.gameStatus = GAME_CONST.GAME_RESULT.IN_PROGRESS;
        }
    }

    getScore(state) {
        if (state.result !== 0) { // TODO : should the current state be changed too ?
            /*
                No this function is to
                calculate the the getScore of any state. It can be a state as per future move too, hence not necessarily
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
