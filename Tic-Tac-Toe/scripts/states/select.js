'use strict'
var select = function() {};
select.prototype = {
  preload : function() {
    this.gameDifficulty = -1 ;
    this.mark = 0 ;
    this.startButtonFlag = true ;
    screenState = 0 ;
  },
  create  : function() {
    var bg = this.add.sprite(0, 0, 'arena');
    bg.height = this.game.height;
    bg.width = this.game.width;

    this.markBackground = this.game.add.image(225,663,'choose_bg_mark');
    this.markBackground.anchor.setTo(0,0);

    this.markSelectedX = this.game.add.image(249, 756, 'mark_selected');
    this.markSelectedX.anchor.setTo(0, 0);
    this.markSelectedX.alpha = 0;

    this.markSelectedO = this.game.add.image(561, 756, 'mark_selected');
    this.markSelectedO.anchor.setTo(0, 0);
    this.markSelectedO.alpha = 0;


    this.xMark = this.game.add.button(249, 756, 'cell', this.selectMarkX, this,1,1,1);
    this.xMark.anchor.setTo(0, 0);

    this.oMark = this.game.add.button(561, 756, 'cell', this.selectMarkO, this,2,2,2);
    this.oMark.anchor.setTo(0, 0);


    this.startButton = this.game.add.button(225, 1122, 'startbutton',this.startGame, this, 1, 1, 2);
    this.startButton.anchor.setTo(0, 0);
    this.startButton.inputEnabled = false ;

    this.startButtonDisabled = this.game.add.image(225, 1122, 'startbutton_disabled', this);
    this.startButtonDisabled.anchor.setTo(0, 0);

    this.backButton = this.game.add.button(48, 96, 'back', this.backButtonHandler, this);
    this.backButton.anchor.setTo(0, 0);

    this.musicButton = this.game.add.button(960, 96, 'music', this.musicToggle, this);
    this.musicButton.anchor.setTo(0, 0);
    screenState = 0 ;
  },
  update: function() {
    if(this.mark !== 0) {
      // console.log("Mark Selection Done");
      this.startButtonDisabled.destroy();
      if(this.startButtonFlag === true) {
        this.startButton.inputEnabled = true ;
        this.startButtonFlag = false ;
      }
      playerMark = this.mark ;
    }
  },
  startGame : function() {
    this.startButton.inputEnabled = false ;
    kapow.startSoloGame(function(roomDetail) {
      room = roomDetail;
      phaserGame.state.start('play');
    }, function(error) {
      console.log("startSoloGame Failed : ",error);
    });
  },
  selectMarkX : function() {
    console.log('X');
    this.markSelectedX.alpha = 1 ;
    this.markSelectedO.alpha = 0 ;
    this.mark = 1 ;
  },
  selectMarkO : function() {
    console.log('O');
    this.markSelectedO.alpha = 1;
    this.markSelectedX.alpha = 0;
    this.mark = 2 ;
  },
  backButtonHandler : function() {
    console.log('back Button Pressed.');
    phaserGame.state.start('menu');
  },
  musicToggle : function() {
    console.log('music Toggled');
    this.musicButton.frame = (this.musicButton.frame+1)%2;
  }
};
