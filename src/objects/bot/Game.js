'use strict';

import GameState from "./GameState";
import gameLayoutVariables from "../store/gameLayoutVariables";
import handleGameEnd from "../../util/gameEnd";
import gameInfo from "../store/GameInfoStore";
import GAME_CONST from "../../gameParam/gameConst";
import GAME_RESULT from "../../gameParam/gameResult";

export default class Game {
    constructor(ticTacToeGame, bot) {
        this.game = ticTacToeGame;
        this.bot = bot;
        this.currentState = new GameState();
        this.currentState.board = [];
        for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
            this.currentState.board.push(gameInfo.get("boardStatus").cells[i] ?
                gameInfo.get("boardStatus").cells[i] : 0);
        }
        this.currentState.turnOfPlayer = true;
        if (gameInfo.get("playerMark") === GAME_CONST.O && gameInfo.get("gameResume") === false) {
            let randomCell = Math.floor(Math.random() * GAME_CONST.CELL_COUNT);
            this.currentState.board[randomCell] = 1;
            gameLayoutVariables.initialMark = randomCell;
        }
        this.gameStatus = GAME_RESULT.IN_PROGRESS;// To indicate game beginning
    }

    // Advances game to next state
    moveTo(state) {
        this.currentState = state;
        if (this.currentState.isTerminal()) { // TODO : logic can be simplified
            this.gameStatus = GAME_RESULT.FINISHED;
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
                    gameLayoutVariables.turnText.text = "YOU WIN!";
                    handleGameEnd(this.game, 2);
                }
                else {
                    gameLayoutVariables.turnText.text = "YOU LOSE!";
                    handleGameEnd(this.game, 1);
                }
            }
            else {
                gameLayoutVariables.turnText.text = "GAME DRAW!";
                handleGameEnd(this.game, 0);
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
                this.bot.playMove(false);// TODO : rename to play move ?
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
