'use strict';
// TODO : Check if we can move  vars to different primitives or enums or booleans .
var globalVariableInstance = function () { // TODO : Use Pascal  case , Rename it to Store
    this.room = null; // TODO : room = null and playerData = undefined  any reason for using different falsy values ?
    this.screenState = 0;
    this.playerData = null;
    this.boardStatus = {
        cells: new Array(9) // TODO : use [] //@sukhmeet How will I make sure that the length of the array is 9 in the very begining here ?
    };
    this.gameResume = false;
    this.win = 0;
    this.playerMark = 0; // TODO : for states start using ENUMS/ alternative names  all places https://stijndewitt.com/2014/01/26/enums-in-javascript/
    this.opponentMark = 0;
    this.gameOver = false;
    this.gameType = null;
    this.opponentData = null;
    this.gameLocked = false;
    this.turnOfPlayer = null;
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

export default globalVariableInstance;