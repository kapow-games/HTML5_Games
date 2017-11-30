'use strict';

import GAME_CONST from "../../gameParam/gameConst";

// TODO : Check if we can move  vars to different primitives or enums or booleans .
function GameInfoStore() {
    this.room = null;
    this.screenState = 0;
    this.playerData = null;
    this.boardStatus = {
        cells: []
    };
    this.gameResume = false;
    this.win = 0;
    this.playerMark = GAME_CONST.NONE;
    this.opponentMark = GAME_CONST.NONE;
    this.gameOver = false;
    this.gameType = null;
    this.opponentData = null;
    this.gameLocked = false;
    this.turnOfPlayer = null;
    this.gameLayoutLoaded = false;
    this.randomRoom = false;
    this._init = function () {
        for (let i = 0; i < GAME_CONST.CELL_COUNT; i++) {
            this.boardStatus.cells.push(undefined);
        }
    };
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

var gameInfo = new GameInfoStore();
gameInfo._init();
export default gameInfo;