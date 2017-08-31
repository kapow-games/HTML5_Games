'use strict';
var preload = function() {
  this.asset = null;
  this.ready = false;
};

preload.prototype = {
  preload : function() {
    this.asset = this.add.sprite(this.game.world.centerX,this.game.world.centerY,"loading");
    // this.asset = this.add.sprite(this.width/2,this.height/2, 'loading');
    this.asset.anchor.setTo(0.5,0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
		this.load.image('logo', 'assets/logo.svg');
    this.load.image('onGoing', 'assets/onGoing.svg');
    this.load.image('arena', 'assets/backGround.svg');
    this.load.image('back', 'assets/back.svg');
    this.load.image('newGame', 'assets/newGame.svg');
    this.load.image('music', 'assets/volume.svg');
    this.load.image('leaderBoard', 'assets/leaderboard.svg');
    this.load.image('stats', 'assets/stats.svg');
    this.load.image('x_mark', 'assets/o.png');
    this.load.image('y_mark', 'assets/x.png');
    this.load.spritesheet('cell', 'assets/cell.png', 107, 107);
    this.load.spritesheet('easy_bot', 'assets/button.png', 120, 40);
    this.load.spritesheet('medium_bot', 'assets/button.png', 120, 40);
    this.load.spritesheet('hard_bot', 'assets/button.png', 120, 40);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};
