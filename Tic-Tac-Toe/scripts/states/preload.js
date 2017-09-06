'use strict';
var preload = function() {
  this.asset = null;
  this.ready = false;
};

preload.prototype = {
  preload : function() {
    this.asset = this.add.sprite(this.world.centerX,this.world.centerY,"loading");
    // this.asset = this.add.sprite(this.width/2,this.height/2, 'loading');
    this.asset.anchor.setTo(0.5,0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
		this.load.image('logo', 'assets/logo.svg');
    this.load.spritesheet('onGoing', 'assets/onGoing.png', 328, 60);
    // this.load.image('onGoing', 'assets/onGoing.svg');
    this.load.image('arena', 'assets/backGround.svg');
    this.load.image('back', 'assets/back.svg');
    this.load.spritesheet('newGame', 'assets/newGame.png', 328, 46);
    // this.load.image('newGame', 'assets/newGame.svg');
    this.load.spritesheet('music', 'assets/volume.png', 24, 24);
    // this.load.image('music', 'assets/volume.svg');
    this.load.spritesheet('leaderBoard', 'assets/leaderboard.png', 328, 46);
    // this.load.image('leaderBoard', 'assets/leaderboard.svg');
    this.load.spritesheet('stats', 'assets/stats.png', 328, 46);
    // this.load.image('stats', 'assets/stats.svg');
    this.load.image('referee', 'assets/turnBoard.svg');
    this.load.image('board', 'assets/board.svg'); //Final Arena
    this.load.image('difficulty_bg', 'assets/difficulty-bg.svg');
    this.load.image('mark_selected', 'assets/mark-selected.svg');
    this.load.image('difficulty_selected', 'assets/difficulty-selected.svg');
    this.load.image('startbutton_disabled', 'assets/startbutton-disabled.svg');
    this.load.image('startbutton_enabled', 'assets/startbutton-enabled.svg');
    this.load.image('resign', 'assets/resign.svg');
    this.load.image('match', 'assets/match.svg');

    this.load.spritesheet('choose_bg_mark','assets/mark_choose.svg');
    this.load.spritesheet('difficulty', 'assets/difficulty-levels.png',70,40);
    // this.load.audiosprite("audio-backgroundMusic", "assets/audio/audiosprite.mp3");
    this.load.spritesheet('cell', 'assets/xo-sprite.png', 88, 88);
    // this.load.script('font.r','//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(this.ready) {
      if(gameResume === true) {
        this.state.start('play');
      }
      else {
        this.state.start('menu');
      }
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};
