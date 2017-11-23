'use strict';

import gameLayoutVariables from "../store/gameLayoutVariables";
import layoutConst from "../../../src/gameParam/gameConst";

export default class GameState {
    constructor(oldGameState) { // TODO : rename it to just state ?
        this.turnOfPlayer = null;
        // null : No One's Move // true : Player's Move // false : Opponent's Move' // TODO : @mayank : Can be a boolean ?
        this.movesCount = 0; // Number of moves of Bot
        this.boardResult =  undefined; // 0 : Board Result Draw // 1 : Board Result Player 1(x) wins // 2 : Board Result Player 2(o) wins // undefined : game state not decided
        this.board = []; //board[i] = 0 : Empty //board[i] = 1 : 'X' //board[i] = 2 : 'O'
        if (oldGameState) { // TODO : can do if(oldGameState ) {} // undefined is falsy
            let len = oldGameState.board.length;
            this.board = []; // TODO : initialize array with [] https://stackoverflow.com/a/1273936
            for (let i = 0; i < len; i++) {
                this.board.push(oldGameState.board[i]);
            }
            this.turnOfPlayer = oldGameState.turnOfPlayer;
            this.movesCount = oldGameState.movesCount;
            this.boardResult = oldGameState.boardResult;
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
        for (let i = 0, j = layoutConst.CELL_ROWS; i < layoutConst.CELL_COLS; i++) {
            if (cell[i] !== 0 && cell[i] === cell[i + j] && cell[i + j] === cell[i + (2 * j)]) {
                gameLayoutVariables.winningMarkLine = i;
                this.boardResult = cell[i];
                return true;
            }
        }
        //Checking Columns
        for (let i = 0, j = 1; i < layoutConst.CELL_ROWS * layoutConst.CELL_COLS; i += layoutConst.CELL_COLS) {
            if (cell[i] !== 0 && cell[i] === cell[i + j] && cell[i + j] === cell[i + (2 * j)]) {
                gameLayoutVariables.winningMarkLine = (i / layoutConst.CELL_COLS) + layoutConst.CELL_ROWS;
                this.boardResult = cell[i];
                return true;
            }
        }
        //Checking Leading Diagonals '\'
        if (cell[0] !== 0 && cell[0] === cell[4] && cell[4] === cell[8]) {
            gameLayoutVariables.winningMarkLine = 6;
            this.boardResult = cell[4];
            return true;
        }
        //Checing other Diagonal '/'
        if (cell[2] !== 0 && cell[2] === cell[4] && cell[4] === cell[6]) {
            gameLayoutVariables.winningMarkLine = 7;
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
