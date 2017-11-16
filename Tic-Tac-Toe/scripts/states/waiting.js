'use strict';
export class Waiting extends Phaser.State {
    preload() {
        globalVariableInstance.set("screenState", 1);
        if(globalVariableInstance.get("opponentData") !== undefined) {
          this.load.image('opponentPic',globalVariableInstance.get("opponentData").profileImage+"?height=276&width=276");
        }
      }
      create() {
        this.bg = this.add.image(0, 0, 'arena');
        this.waitingPlayerBackground = this.add.image(48, 372, 'waitingPlayer');

        this.backButton = this.add.button(48, 96, 'back', this.backButtonHandler, this);
        this.backButton.anchor.setTo(0, 0);

        this.soundToggle = this.add.button(960, 96, 'music', this.musicToggle, this);
        this.soundToggle.anchor.setTo(0, 0);

        this.helpButton = this.add.button(840, 96, 'help', this.helpButtonHandler, this);
        this.helpButton.anchor.setTo(0, 0);


        this.waitingText = createText(366, 780, "");//phaserGame.add.text(366, 276, "");
        this.waitingText.anchor.setTo(0.5,0);
        this.waitingText.position.x = phaserGame.world.centerX;
        this.waitingText.font = 'nunito-regular';
        this.waitingText.fontSize = "60px";
        this.waitingText.fontWeight = 800;
        this.waitingText.wordWrapWidth = 355;
        this.waitingText.fill = "#6d616d";
        this.waitingText.align = "center";
        this.waitingText.backgroundColor = "#ffffff";


        this.playerProfilePic = this.add.image(222,444,'profilePic');
        this.playerProfilePic.scale.set(276/this.playerProfilePic.width);

        this.playerMask = phaserGame.add.graphics(0, 0);
        this.playerMask.beginFill("#f0f0f0");
        this.playerMask.drawCircle(360,582,276);
        this.playerProfilePic.mask = this.playerMask;

        if(globalVariableInstance.get("opponentData") !== undefined) {
          this.opponentProfilePic = this.add.image(582, 444, "opponentPic");
          this.opponentProfilePic.scale.set(276/this.opponentProfilePic.width);
          this.opponentMask = phaserGame.add.graphics(0, 0);
          this.opponentMask.beginFill("#f0f0f0");
          this.opponentMask.drawCircle(720,582,276);
          this.opponentProfilePic.mask = this.opponentMask;
          console.log('opponentData at waiting state : ',globalVariableInstance.get("opponentData"));
          this.waitingText.text = "WAITING FOR "+globalVariableInstance.get("opponentData").name.split(" ")[0].toUpperCase()+" TO JOIN";
        }
        else {
          this.opponentProfilePic = this.add.image(654, 492, "anonymousOpponentPic");
          this.opponentProfilePic.scale.set(132/this.opponentProfilePic.width);
          this.waitingText.text = "WAITING FOR AN OPPONENT";
        }
        this.activeGames = this.add.button(48, 942 , 'onGoing', this.showActiveGames, this, 0, 0, 1, 0);
        this.activeGames.anchor.setTo(0, 0);

        // console.log("Pointer");

      }
      update() {

      }
      backButtonHandler() {
        console.log("WebView BACK presed.");
        kapow.unloadRoom(function(){console.log('Room Succesfully Unloaded');},function(){console.log('Room Unloading Failed');});
        globalVariableInstance.set("gameResume", false);
        globalVariableInstance.set("room", null);
        globalVariableInstance.set("playerMark", 0);
        globalVariableInstance.set("gameType", null);
        globalVariableInstance.set("botLevel", -1);
        globalVariableInstance.set("boardStatus", {cells : new Array(9)});
        globalVariableInstance.set("opponentData", undefined);
        globalVariableInstance.set("turnOfPlayer", undefined);
        globalVariableInstance.set("gameOver", false);
        globalVariableInstance.set("win", 0);
        globalVariableInstance.set("gameLayoutLoaded", false);
        phaserGame.state.start('menu');
      }
      musicToggle() {
        this.soundToggle.frame = (1+this.soundToggle.frame)%2 ;
      }
      helpButtonHandler() {
        console.log('Helpp Button Clicked');
      }
}
