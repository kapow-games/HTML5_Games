'use strict';
var menu = function() {};
menu.prototype = {
  create: function() {
    screenState = 0 ;
    this.bg = this.add.image(0, 0, 'arena');

    this.logo = this.add.image(55, 95, 'logo');
    this.logo.anchor.setTo(0, 0);

    this.activeGames = this.add.button(16, 256, 'onGoing', this.showActiveGames, this, 0, 0, 1, 0);
    this.activeGames.anchor.setTo(0, 0);

    this.startNewGame = this.add.button(16, 332, 'newGame', this.newGameButtonHandler, this, 0, 0, 1, 0);
    this.startNewGame.anchor.setTo(0, 0);

    this.stats = this.add.button(16, 394, 'stats', this.statHandler, this, 0, 0, 1, 0);
    this.stats.anchor.setTo(0, 0);

    this.leaderboard = this.add.button(16, 456, 'leaderBoard', this.leaderboardHandler, this, 0, 0, 1, 0);
    this.leaderboard.anchor.setTo(0, 0);

    this.backButton = this.add.button(16, 32, 'back', this.backButtonHandler, this);
    this.backButton.anchor.setTo(0, 0);

    this.soundToggle = this.add.button(320, 32, 'music', this.musicToggle, this);
    this.soundToggle.anchor.setTo(0, 0);

    this.helpButton = this.add.button(280, 32, 'help', this.helpButtonHandler, this);
    this.helpButton.anchor.setTo(0, 0);

  },
  update: function() {
    screenState = 0;
  },
  backButtonHandler : function() {
    kapow.close();
  },
  musicToggle : function() {
    this.soundToggle.frame = (1+this.soundToggle.frame)%2 ;
  },
  statHandler : function() {
    console.log('Stat handler funtion not implemented');
  },
  leaderboardHandler : function() {
    console.log('Leaderboard handler funtion not implemented');
  },
  showActiveGames : function() {
    console.log('Active game funtion not implemented');
  },
  newGameButtonHandler: function() {
    console.log('New Game Button Clicked');
    this.state.start('select');
  },
  helpButtonHandler : function() {
    console.log('Helpp Button Clicked');
  }
};
