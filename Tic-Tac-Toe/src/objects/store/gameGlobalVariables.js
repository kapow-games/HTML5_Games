'use strict';
import gameConst from "../../gameParam/gameConst";
// TODO : Check if we can move  vars to different primitives or enums or booleans .
var gameGlobalVariables = function () { // TODO : Use Pascal  case , Rename it to Store
    this.room = null; // TODO : room = null and playerData = undefined  any reason for using different falsy values ?
    this.screenState = 0;
    this.playerData = null;
    this.boardStatus = {
        cells: [] // TODO : use []
    };
    this.gameResume = false;
    this.win = 0;
    this.playerMark = gameConst.NONE; // TODO : for states start using ENUMS/ alternative names  all places https://stijndewitt.com/2014/01/26/enums-in-javascript/
    this.opponentMark = gameConst.NONE;//@sukhmeet WIP for bringing similar changes at other occurrences.
    this.gameOver = false;
    this.gameType = null;
    this.opponentData = null;
    this.gameLocked = false;
    this.turnOfPlayer = null;
    this.gameLayoutLoaded = false;
    this.randomRoom = false;
    this._init = function () {
        for (let i = 0; i < 9; i++) {
            this.boardStatus.cells.push(undefined);
        }
    };
    this.get = function (key) {
        //console.log("gameGlobalVaribales.get("+key+") invoked.Returning = "+this[key]);
        return this[key];
    };
    this.set = function (key, val) {
        //console.log("gameGlobalVaribales.set("+key+";"+val+") invoked.");
        this[key] = val;
    };
};
var globalVariableInstance = new gameGlobalVariables();
globalVariableInstance._init();
export default globalVariableInstance;