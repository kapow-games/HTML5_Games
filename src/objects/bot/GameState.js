'use strict';

import gameInfo from "../store/layoutStore";
import GAME_CONST from "../../../src/gameParam/gameConst";

export default class GameState {
    constructor(state) {
        this.turnOfPlayer = null;
        // null : No One's Move // true : Player's Move // false : Opponent's Move' // TODO : @mayank : Can be a boolean ? // It is a boolean. Initialised with null
        this.movesCount = 0; // Number of moves of Bot
        this.boardResult = undefined; // 0 : Board Result Draw // 1 : Board Result Player 1(x) wins // 2 : Board Result Player 2(o) wins // undefined : game state not decided
        this.board = []; //board[i] = 0 : Empty //board[i] = 1 : 'X' //board[i] = 2 : 'O'
        if (state) {
            let len = state.board.length;
            this.board = [];
            for (let i = 0; i < len; i++) {
                this.board.push(state.board[i]);
            }
            this.turnOfPlayer = state.turnOfPlayer;
            this.movesCount = state.movesCount;
            this.boardResult = state.boardResult;
        }
    }

    nextTurn() {
        this.turnOfPlayer = !this.turnOfPlayer;
    }

    emptyCells() {
        let indices = [];
        let len = this.board.length;
        for (let i = 0; i < len; i++) {
            if (this.board[i] === 0) {
                indices.push(i);
            }
        }
        return indices;
    }

    isTerminal() {
        let cell = this.board;
        for (let i = 0, j = GAME_CONST.CELL_ROWS; i < GAME_CONST.CELL_COLS; i++) {
            if (cell[i] !== 0 && cell[i] === cell[i + j] && cell[i + j] === cell[i + (2 * j)]) {
                gameInfo.winningMarkLine = i;
                this.boardResult = cell[i];
                return true;
            }
        }
        //Checking Columns
        for (let i = 0, j = 1; i < GAME_CONST.CELL_COUNT; i += GAME_CONST.CELL_COLS) {
            if (cell[i] !== 0 && cell[i] === cell[i + j] && cell[i + j] === cell[i + (2 * j)]) {
                gameInfo.winningMarkLine = (i / GAME_CONST.CELL_COLS) + GAME_CONST.CELL_ROWS;
                this.boardResult = cell[i];
                return true;
            }
        }
        //Checking Leading Diagonals '\'
        if (cell[0] !== 0 && cell[0] === cell[4] && cell[4] === cell[8]) {
            gameInfo.winningMarkLine = 6;
            this.boardResult = cell[4];
            return true;
        }
        //Checing other Diagonal '/'
        if (cell[2] !== 0 && cell[2] === cell[4] && cell[4] === cell[6]) {
            gameInfo.winningMarkLine = 7;
            this.boardResult = cell[4];
            return true;
        }
        if (this.emptyCells().length === 0) {
            this.boardResult = 0;
            return true;
        }
        return false;
    }
}
