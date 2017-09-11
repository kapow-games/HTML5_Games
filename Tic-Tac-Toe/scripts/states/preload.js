'use strict';
var preload = function() {
  this.asset = null;
  this.ready = false;
};
var WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    // active: function() { phaserGame.time.events.add(Phaser.Timer.SECOND, preload, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Nunito']
    }

};
preload.prototype = {
  preload : function() {
    console.log("Preloading Assets");
    phaserGame.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.asset = this.add.sprite(this.world.centerX,this.world.centerY,"loading");
    this.asset.anchor.setTo(0.5,0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('profilePic',playerData.player.profileImage);
    this.load.image('botPic','assets/botPic.png');
		this.load.image('logo', 'assets/logo.svg');
    this.load.spritesheet('onGoing', 'assets/onGoing.png', 328, 60);
    this.load.image('arena', 'assets/backGround.svg');
    this.load.image('back', 'assets/back.svg');
    this.load.spritesheet('newGame', 'assets/newGame.png', 328, 46);
    this.load.spritesheet('music', 'assets/volume.png', 24, 24);
    this.load.spritesheet('leaderBoard', 'assets/leaderboard.png', 328, 46);
    this.load.spritesheet('stats', 'assets/stats.png', 328, 46);
    this.load.image('turnTextBackground', 'assets/turnBoard.svg');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('board', 'assets/board.svg'); //Final Arena
    this.load.image('difficulty_bg', 'assets/difficulty-bg.svg');
    this.load.image('mark_selected', 'assets/mark-selected.svg');
    this.load.image('difficulty_selected', 'assets/difficulty-selected.svg');
    this.load.image('startbutton_disabled', 'assets/startbutton-disabled.svg');
    this.load.image('resignModal', 'assets/resign-modal.svg');
    this.load.image('yesResign', 'assets/yes-resign.svg');
    this.load.image('cancel', 'assets/cancel.svg');
    this.load.image('shareBackground', 'assets/share-bg.png');
    this.load.image('fbShare', 'assets/fb.png');
    this.load.image('winBackground', 'assets/win-bg.png');
    this.load.image('confetti', 'assets/confetti.png');
    this.load.image('twitterShare', 'assets/twitter.png');
    this.load.image('otherShare', 'assets/other.png');
    this.load.image('darkOverlay', 'assets/dark-overlay.png');
    this.load.spritesheet('startbutton', 'assets/startbutton.png', 210, 46);
    this.load.spritesheet('rematch', 'assets/rematchbutton.png', 117, 40);
    this.load.image('rectangle', 'assets/rectangle.png');
    this.load.spritesheet('helpEnd', 'assets/help.png',40,40);
    this.load.spritesheet('help', 'assets/help.svg',40,40);
    this.load.spritesheet('resign', 'assets/resign.png', 101, 40);
    this.load.image('choose_bg_mark','assets/mark_choose.svg');
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
