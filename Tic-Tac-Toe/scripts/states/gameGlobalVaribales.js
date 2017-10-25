use 'strict'
class gameGlobalVariables {
    constructor() {
        this.room = null;
        this.screenState = 0;
        this.playerData = undefined;
        this.boardStatus = {cells  : new Array(9)};
        this.gameResume = false;
        this.botLevel = -1;
        this.win = 0;
        this.playerMark = 0 ;
        this.opponentMark = 0 ;
        this.gameOver = false;
        this.gameType = null;
        this.opponentData = undefined;
        this.gameLocked = false;
        this.turnOfPlayer = undefined;
    }
	get(key) {
	    console.log("gameGlobalVaribales.get("+key+") invoked.Returning : "+this.key);
		return this[key];
	}
	set(key,val) {
	    console.log("gameGlobalVaribales.set("+key+","+val+") invoked.");
	    this[key] = val;
	}
}