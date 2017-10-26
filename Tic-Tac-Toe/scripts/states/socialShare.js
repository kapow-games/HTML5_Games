'use strict';
class socialShare {
    constructor(val) {
        this.shareText = (val === "draw" || val === "loss") ? "I just played a game of Tic Tac Toe on Kapow. Join Kapow now to play with me!":"I just won a game of Tic Tac Toe on Kapow. Join Kapow now to beat me!"
    }
	shareButton(x,y,shareLoad,medium,buttonID) {
        return phaserGame.add.button(x, y, buttonID, function() {
            console.log(buttonID+" share clicked");
            shareLoad.reset(phaserGame.world.centerX, phaserGame.world.centerY);
            kapow.social.share(shareText, medium, function(){
              shareLoad.kill();
              console.log(buttonID+"Fb share Successfull");
            },
            function(error){
              shareLoad.kill();
              console.log(buttonID," Share Failed",error);
            });
          });
	}
}