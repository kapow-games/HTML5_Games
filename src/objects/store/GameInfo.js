'use strict';

import GAME_CONST from "../../const/GAME_CONST";

function GameInfoStore() { // TODO : do we actually need to initialize null values ? if value is not present it will be returned as `undefined`
    this.room = null;
    this.screenState = 0;
    this.playerData = null;
    this.boardStatus = {
        cells: []
    };
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
    this._init();
}

GameInfoStore.prototype._init = function () {
    for (let i = 0; i < GAME_CONST.GRID.CELL_COUNT; i++) {
        this.boardStatus.cells.push(undefined);
    }
};
GameInfoStore.prototype.get = function (key) {
    return this[key];
}; // TODO : should this be declared on prototype ?

GameInfoStore.prototype.set = function (key, val) {
    this[key] = val;
};

GameInfoStore.prototype.setBulk = function (arg) {
    for (let key in arg) {
        this[key] = arg[key];
    }
};

let gameInfo = new GameInfoStore();// TODO : let ?
export default gameInfo;