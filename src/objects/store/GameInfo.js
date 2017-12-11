'use strict';

import GAME_CONST from "../../const/GAME_CONST";

function GameInfoStore() { // TODO : do we actually need to initialize null values ? if value is not present it will be returned as `undefined`
    this.room = null;
    this.screenState = 0;
    this.playerData = null;
    this.boardStatus = {cells: Array.from({length: GAME_CONST.GRID.CELL_COUNT}, (v, k) => undefined)},
    this.gameResume = false;
    this.win = 0;
    this.playerMark = GAME_CONST.TURN.NONE;
    this.opponentMark = GAME_CONST.TURN.NONE;
    this.gameOver = false;
    this.gameType = null;
    this.opponentData = null;
    this.gameLocked = false;
    this.turnOfPlayer = null;
    this.gameLayoutLoaded = false;
    this.randomRoom = false;
}

GameInfoStore.prototype.get = function (key) {
    return this[key];
};

GameInfoStore.prototype.set = function (key, val) {
    this[key] = val;
};

GameInfoStore.prototype.setBulk = function (arg) {
    for (let key in arg) {
        this[key] = arg[key];
    }
};

let gameInfo = new GameInfoStore();
export default gameInfo;