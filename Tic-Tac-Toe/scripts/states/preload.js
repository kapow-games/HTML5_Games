'use strict';
var preload = function() {
  this.asset = null;
  this.ready = false;
};

preload.prototype = {
  preload : function() {
    this.asset = this.add.sprite(160,240,"loading");
    // this.asset = this.add.sprite(this.width/2,this.height/2, 'loading');
    this.asset.anchor.setTo(0.5,0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
		this.load.image('kapow', 'assets/Kapow_Logo.png');
    this.load.image('arena', 'assets/Background_Arena.png');
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
