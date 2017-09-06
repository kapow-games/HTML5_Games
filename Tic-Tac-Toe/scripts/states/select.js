'use strict'
var select = function() {};
select.prototype = {
  preload : function() {
    this.gameDifficulty = -1 ;
    this.mark = 0 ;
  },
  create  : function() {
    var bg = this.add.sprite(0, 0, 'arena');
    bg.height = this.game.height;
    bg.width = this.game.width;
    // game.stage.backgroundColor = "#0000ff";

    this.markBackground = this.game.add.image(75,149,'choose_bg_mark');
    this.markBackground.anchor.setTo(0,0);


    this.markSelectedX = this.game.add.image(83, 180, 'mark_selected');
    this.markSelectedX.anchor.setTo(0, 0);
    this.markSelectedX.alpha = 0;


    this.markSelectedO = this.game.add.image(187, 180, 'mark_selected');
    this.markSelectedO.anchor.setTo(0, 0);
    this.markSelectedO.alpha = 0;


    this.xMark = this.game.add.button(83, 180, 'cell', this.selectMarkX, this,1,1,1);
    this.xMark.anchor.setTo(0, 0);

    this.oMark = this.game.add.button(187, 180, 'cell', this.selectMarkO, this,2,2,2);
    this.oMark.anchor.setTo(0, 0);

    this.difficultyBackground = this.game.add.image(75,294,'difficulty_bg');
    this.difficultyBackground.anchor.setTo(0,0);

    this.difficultySelectedEasy = this.game.add.image(80, 330, 'difficulty_selected');
    this.difficultySelectedEasy.anchor.setTo(0, 0);
    this.difficultySelectedEasy.alpha = 0;

    this.difficultySelectedMedium = this.game.add.image(150, 330, 'difficulty_selected');
    this.difficultySelectedMedium.anchor.setTo(0, 0);
    this.difficultySelectedMedium.alpha = 0;

    this.difficultySelectedHard = this.game.add.image(220, 330, 'difficulty_selected');
    this.difficultySelectedHard.anchor.setTo(0, 0);
    this.difficultySelectedHard.alpha = 0;


    this.easyLevel = this.game.add.button(75, 325, 'difficulty', this.easyModeChoose, this,0,0,0);
    this.easyLevel.anchor.setTo(0, 0);

    this.mediumLevel = this.game.add.button(145, 325, 'difficulty', this.mediumModeChoose, this,1,1,1);
    this.mediumLevel.anchor.setTo(0, 0);

    this.hardLevel = this.game.add.button(215, 325, 'difficulty', this.hardModeChoose, this,2,2,2);
    this.hardLevel.anchor.setTo(0, 0);


    this.startButton = this.game.add.button(75, 397, 'startbutton_enabled',this.startGame);
    this.startButton.anchor.setTo(0, 0);
    this.startButton.inputEnabled = false ;

    this.startButtonDisabled = this.game.add.image(75, 397, 'startbutton_disabled');
    this.startButtonDisabled.anchor.setTo(0, 0);




    // this.gameModeButton = this.game.add.button(this.game.world.centerX, (this.game.height*2)/5, 'easy_bot', this.easyModeChoose, this, 1, 0, 2);
    // this.gameModeButton.anchor.set(0.5);
    //
    // this.gameModeButton = this.game.add.button(this.game.world.centerX, (this.game.height*3)/5, 'medium_bot', this.mediumModeChoose, this, 1, 0, 2);
    // this.gameModeButton.anchor.set(0.5);
    //
    // this.gameModeButton = this.game.add.button(this.game.world.centerX, (this.game.height*4)/5, 'hard_bot', this.hardModeChoose, this, 1, 0, 2);
    // this.gameModeButton.anchor.set(0.5);

    this.backButton = this.game.add.button(16, 32, 'back', this.backButtonHandler, this);
    this.backButton.anchor.setTo(0, 0);

    this.musicButton = this.game.add.button(320, 32, 'music', this.musicToggle, this);
    this.musicButton.anchor.setTo(0, 0);
  },
  update: function() {
    if(this.gameDifficulty !== -1 && this.mark !== 0) {
      // console.log(this.startButton);
      this.startButtonDisabled.destroy();
      this.startButton.key = 'startbutton_enabled';
      this.startButton.inputEnabled = true ;
      botLevel = this.gameDifficulty ;
      playerMark = this.mark ;
    }
  },
  startGame : function() {
    kapow.startSoloGame(function(roomDetail) {
      room = roomDetail;
      phaserGame.state.start('play');
    }, function(error) {
      console.log("startSoloGame Failed : ",error);
    });
  },
  easyModeChoose: function() {
    this.gameDifficulty = 0 ;
    this.difficultySelectedHard.alpha = this.difficultySelectedMedium.alpha = 0 ;
    this.difficultySelectedEasy.alpha = 1 ;
    console.log("Easy");
  },
  mediumModeChoose: function() {
    this.gameDifficulty = 1 ;
    this.difficultySelectedHard.alpha = this.difficultySelectedEasy.alpha = 0 ;
    this.difficultySelectedMedium.alpha = 1 ;
    console.log("Medium");
  },
  hardModeChoose: function() {
    this.gameDifficulty = 2 ;
    this.difficultySelectedEasy.alpha = this.difficultySelectedMedium.alpha = 0 ;
    this.difficultySelectedHard.alpha = 1 ;
    console.log("Hard");
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
