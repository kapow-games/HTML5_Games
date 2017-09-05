'use strict';
var menu = function() {};
menu.prototype = {
  preload: function() {
    this.gameDifficulty = -1 ;
  },
  create: function() {

    this.bg = this.add.image(0, 0, 'arena');
    // this.bg.height = this.height;
    // this.bg.width = this.width;

    // stage.backgroundColor = "#0000ff";

    // this.titleText = this.add.text(this.world.centerX, this.height/5 , 'Tic-Tac-Toe', style);
    this.titleText = this.add.image(55, 95, 'logo');
    this.titleText.anchor.setTo(0, 0);

    this.titleText = this.add.button(16, 256, 'onGoing');
    this.titleText.anchor.setTo(0, 0);

    this.titleText = this.add.button(16, 332, 'newGame',this.hardModeChoose,this);
    this.titleText.anchor.setTo(0, 0);

    this.titleText = this.add.button(16, 394, 'stats');
    this.titleText.anchor.setTo(0, 0);

    this.titleText = this.add.button(16, 456, 'leaderBoard');
    this.titleText.anchor.setTo(0, 0);

    this.titleText = this.add.button(16, 32, 'back');
    this.titleText.anchor.setTo(0, 0);

    this.titleText = this.add.button(320, 32, 'music');
    this.titleText.anchor.setTo(0, 0);



    // this.gameModeButton = this.add.button(this.world.centerX, (this.height*2)/5, 'easy_bot', this.easyModeChoose, this, 1, 0, 2);
    // this.gameModeButton.anchor.set(0.5);
    //
    // this.gameModeButton = this.add.button(this.world.centerX, (this.height*3)/5, 'medium_bot', this.mediumModeChoose, this, 1, 0, 2);
    // this.gameModeButton.anchor.set(0.5);
    //
    // this.gameModeButton = this.add.button(this.world.centerX, (this.height*4)/5, 'hard_bot', this.hardModeChoose, this, 1, 0, 2);
    // this.gameModeButton.anchor.set(0.5);

    // console.log(this.input.currentPointers);
  },
  update: function() {
    if(this.gameDifficulty !== -1) {
      botLevel = this.gameDifficulty ;
      this.state.start('select');
    }
  },
  easyModeChoose: function() {
    this.gameDifficulty = 0 ;
  },
  mediumModeChoose: function() {
    this.gameDifficulty = 1 ;
  },
  hardModeChoose: function() {
    this.gameDifficulty = 2 ;
  }
};
