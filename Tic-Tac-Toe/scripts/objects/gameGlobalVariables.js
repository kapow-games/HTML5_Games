'use strict';
// TODO : Check if we can move  vars to different primitives or enums or booleans .
export default globalVariableInstance = function () { // TODO : Use Pascal  case , Rename it to Store
    this.room = null;// TODO : room = null and playerData = undefined  any reason for using different falsy values ?
    this.screenState = 0;
    this.playerData = undefined;
    this.boardStatus = {
        cells: new Array(9) // TODO : use []
    };
    this.gameResume = false;
    this.botLevel = -1;
    this.win = 0;
    this.playerMark = 0; // TODO : for states start using ENUMS/ alternative names  all places https://stijndewitt.com/2014/01/26/enums-in-javascript/
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

