'use strict';
var botLevel = -1 ;
var menu = function() {};
menu.prototype = {
  preload: function() {
    this.gameDifficulty = -1 ;
  },
  create: function() {
    var style = { font: '65px Arial', fill: 'black', align: 'center'};

    var bg = this.add.sprite(0, 0, 'arena');
    bg.anchor.set(0.5);
    bg.scale.setTo(3,3);

    this.titleText = this.game.add.text(this.game.world.centerX, 80, 'Tic-Tac-Toe', style);
    this.titleText.anchor.setTo(0.5, 1);

    this.gameModeButton = this.game.add.button(this.game.world.centerX, 120, 'easy_bot', this.easyModeChoose, this, 1, 0, 2);
    this.gameModeButton.anchor.set(0.5);

    this.gameModeButton = this.game.add.button(this.game.world.centerX, 160, 'medium_bot', this.mediumModeChoose, this, 1, 0, 2);
    this.gameModeButton.anchor.set(0.5);

    this.gameModeButton = this.game.add.button(this.game.world.centerX, 200, 'hard_bot', this.hardModeChoose, this, 1, 0, 2);
    this.gameModeButton.anchor.set(0.5);

    // this.instructionsText = this.game.add.text(this.game.world.centerX, 180, '1 Player', { font: '16px Arial', fill: 'black', align: 'center'});
    // this.instructionsText.anchor.setTo(0.5, 0.5);
    //
    // this.instructionsText = this.game.add.text(this.game.world.centerX, 280, '2 Player', { font: '16px Arial', fill: 'black', align: 'center'});
    // this.instructionsText.anchor.setTo(0.5, 0.5);

    console.log(this.game.input.currentPointers);
  },
  update: function() {
    if(this.gameDifficulty !== -1) {
      botLevel = this.gameDifficulty ;
      this.game.state.start('play');
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
