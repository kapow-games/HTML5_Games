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
    this.load.image('botPic','assets/images/botPic.png');
		this.load.image('logo', 'assets/images/logo.png');
    this.load.spritesheet('onGoing', 'assets/images/onGoing.png', 984, 180);
    this.load.image('arena', 'assets/images/backGround.png');
    this.load.image('back', 'assets/images/back.png');
    // this.load.spritesheet('newGame', 'assets/images/newGame.png', 328, 46);
    // this.load.audiosprite('audio', 'assets/music/audioSprite.mp3', null, "assets/music/audioSprite.json");
    this.load.spritesheet('newGameTop', 'assets/images/newgame-top.png', 984, 108);
    this.load.spritesheet('newGameBottom', 'assets/images/newgame-bottom.png', 984, 114);
    this.load.spritesheet('music', 'assets/images/volume.png', 72, 72);
    this.load.spritesheet('leaderBoard', 'assets/images/leaderboard.png', 984, 138);
    this.load.spritesheet('stats', 'assets/images/stats.png', 984, 138);
    this.load.image('turnTextBackground', 'assets/images/turnBoard.png');
    this.load.image('circle', 'assets/images/circle.png');
    this.load.image('board', 'assets/images/board.png'); //Final Arena
    this.load.image('mark_selected', 'assets/images/mark-selected.png');
    this.load.image('startbutton_disabled', 'assets/images/startbutton-disabled.png');
    this.load.image('resignModal', 'assets/images/resign-modal.png');
    this.load.image('yesResign', 'assets/images/yes-resign.png');
    this.load.image('cancel', 'assets/images/cancel.png');
    this.load.image('shareBackground', 'assets/images/share-bg.png');
    this.load.image('fbShare', 'assets/images/fb.png');
    this.load.image('winBackground', 'assets/images/win-bg.png');
    this.load.image('confetti', 'assets/images/confetti.png');
    this.load.image('twitterShare', 'assets/images/twitter.png');
    this.load.image('otherShare', 'assets/images/other.png');
    this.load.image('darkOverlay', 'assets/images/dark-overlay.png');
    this.load.image('arrowRight', 'assets/images/arrowRight.png');
    this.load.spritesheet('startbutton', 'assets/images/startbutton.png', 630, 138);
    this.load.spritesheet('gameModes', 'assets/images/game-modes.png', 328, 84);
    // this.load.spritesheet('gameModesPatch', 'assets/images/gamemode-patch.png');
    this.load.spritesheet('rematch', 'assets/images/rematchbutton.png', 351, 120);
    this.load.image('rectangle', 'assets/images/rectangle.png');
    this.load.spritesheet('helpEnd', 'assets/images/helpEnd.png',120,120);
    this.load.spritesheet('help', 'assets/images/helpStart.png',72,72);
    this.load.spritesheet('resign', 'assets/images/resignbutton.png', 303, 120);
    this.load.image('choose_bg_mark','assets/images/mark-choose.png');
    // this.load.audiosprite("audio-backgroundMusic", "assets/images/audio/audiosprite.mp3");
    this.load.spritesheet('cell', 'assets/images/xo-sprite.png',264, 264);
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
