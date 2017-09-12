'use strict';

var boot = function() {
  console.log("%cStarting my awesome game", "color:white; background:red");
};
boot.prototype = {
  preload : function() {
    this.load.image("loading","assets/loading.png");
  },
  create  : function() {
    // this.stage.disableVisibilityChange = true;

    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // this.scale.isPortrait = false;
    this.scale.forceOrientation(true, false);
    // this.scale.setScreenSize();
    phaserGame.add.text(0, 0, "hack", {font:"1px nunito", fill:"#000000"});
    this.input.maxPointers = 1;
    this.state.start('preload');
  }
};
