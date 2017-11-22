'use strict';

export default globalVariableInstance = function () {
    this.room = null;
    this.screenState = 0;
    this.playerData = undefined;
    this.boardStatus = {
        cells: new Array(9)
    };
    this.gameResume = false;
    this.botLevel = -1;
    this.win = 0;
    this.playerMark = 0;
    this.opponentMark = 0;
    this.gameOver = false;
    this.gameType = null;
    this.opponentData = undefined;
    this.gameLocked = false;
    this.turnOfPlayer = undefined;
    this.gameLayoutLoaded = false;
    this.randomRoom = false;

    this.get = function (key) {
        //console.log("gameGlobalVaribales.get("+key+") invoked.Returning = "+this[key]);
        return this[key];
    };
    this.set = function (key, val) {
        //console.log("gameGlobalVaribales.set("+key+";"+val+") invoked.");
        this[key] = val;
    };
};

