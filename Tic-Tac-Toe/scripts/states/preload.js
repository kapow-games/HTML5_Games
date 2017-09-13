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
    this.load.image('botPic','assets/assets3x/botPic.png');
		this.load.image('logo', 'assets/assets3x/logo.png');
    this.load.spritesheet('onGoing', 'assets/assets3x/onGoing.png', 984, 180);
    this.load.image('arena', 'assets/assets3x/backGround.png');
    this.load.image('back', 'assets/assets3x/back.png');
    // this.load.spritesheet('newGame', 'assets/assets3x/newGame.png', 328, 46);
    // this.load.spritesheet('newGameType', 'assets/assets3x/newGameType.png', 328, 45);
    this.load.spritesheet('newGameTop', 'assets/assets3x/newgame-top.png', 984, 108);
    this.load.spritesheet('newGameBottom', 'assets/assets3x/newgame-bottom.png', 984, 114);
    this.load.spritesheet('music', 'assets/assets3x/volume.png', 72, 72);
    this.load.spritesheet('leaderBoard', 'assets/assets3x/leaderboard.png', 984, 138);
    this.load.spritesheet('stats', 'assets/assets3x/stats.png', 984, 138);
    this.load.image('turnTextBackground', 'assets/assets3x/turnBoard.png');
    this.load.image('circle', 'assets/assets3x/circle.png');
    this.load.image('board', 'assets/assets3x/board.png'); //Final Arena
    this.load.image('mark_selected', 'assets/assets3x/mark-selected.png');
    this.load.image('startbutton_disabled', 'assets/assets3x/startbutton-disabled.png');
    this.load.image('resignModal', 'assets/assets3x/resign-modal.png');
    this.load.image('yesResign', 'assets/assets3x/yes-resign.png');
    this.load.image('cancel', 'assets/assets3x/cancel.png');
    this.load.image('shareBackground', 'assets/assets3x/share-bg.png');
    this.load.image('fbShare', 'assets/assets3x/fb.png');
    this.load.image('winBackground', 'assets/assets3x/win-bg.png');
    this.load.image('confetti', 'assets/assets3x/confetti.png');
    this.load.image('twitterShare', 'assets/assets3x/twitter.png');
    this.load.image('otherShare', 'assets/assets3x/other.png');
    this.load.image('darkOverlay', 'assets/assets3x/dark-overlay.png');
    this.load.image('arrowRight', 'assets/assets3x/arrowRight.png');
    this.load.spritesheet('startbutton', 'assets/assets3x/startbutton.png', 630, 138);
    this.load.spritesheet('gameModes', 'assets/assets3x/game-modes.png', 328, 84);
    // this.load.spritesheet('gameModesPatch', 'assets/assets3x/gamemode-patch.png');
    this.load.spritesheet('rematch', 'assets/assets3x/rematchbutton.png', 351, 120);
    this.load.image('rectangle', 'assets/assets3x/rectangle.png');
    this.load.spritesheet('helpEnd', 'assets/assets3x/helpEnd.png',120,120);
    this.load.spritesheet('help', 'assets/assets3x/helpStart.png',72,72);
    this.load.spritesheet('resign', 'assets/assets3x/resignbutton.png', 303, 120);
    this.load.image('choose_bg_mark','assets/assets3x/mark-choose.png');
    // this.load.audiosprite("audio-backgroundMusic", "assets/assets3x/audio/audiosprite.mp3");
    this.load.spritesheet('cell', 'assets/assets3x/xo-sprite.png',264, 264);
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
