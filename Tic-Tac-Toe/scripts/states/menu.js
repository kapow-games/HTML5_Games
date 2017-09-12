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

    // this.startNewGameType = this.add.sprite(16, 332, 'newGameType');
    // this.startNewGameType.frame = 1;
    // this.startNewGameType.anchor.setTo(0, 0);
    //
    // this.startNewGame = this.add.button(16, 332, 'newGame', this.newGameButtonHandler, this, 0, 0, 1, 0);
    // this.startNewGame.anchor.setTo(0, 0);

    this.startNewGameBottom = this.add.sprite(16, 340, 'newGameBottom');
    this.startNewGameBottom.frame = 0;
    this.startNewGameBottom.anchor.setTo(0, 0);

    // this.gameModeFriend = this.add.sprite(16, 340, 'gameModes');
    this.gameModeFriend = this.add.button(16, 340, 'gameModes', this.againstFriend, this, 0, 0, 0, 0);
    this.gameModeFriend.inputEnabled = false;
    this.gameModeFriend.anchor.setTo(0, 0);

    this.gameModeRandom = this.add.button(125, 340, 'gameModes', this.againstRandom, this, 1, 1, 1, 1);
    this.gameModeRandom.inputEnabled = false;
    this.gameModeRandom.anchor.setTo(0, 0);

    this.gameModeSolo = this.add.button(234, 340, 'gameModes', this.againstComputer, this, 2, 2, 2, 2);
    this.gameModeSolo.inputEnabled = false;
    this.gameModeSolo.anchor.setTo(0, 0);



    this.startNewGameTop = this.add.button(16, 332, 'newGameTop', this.newGameButtonHandler, this, 0, 0, 1, 0);
    this.startNewGameTop.anchor.setTo(0, 0);
    this.startNewGameTop.onInputDown.add(this.startNewGameTopInputDown, this) ;
    this.startNewGameTop.onInputUp.add(this.startNewGameTopInputUp, this) ;
    this.startNewGameTop.onInputOut.add(this.startNewGameTopInputUp, this) ;

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

    this.slideDirection = 0 ; // 0 signigies downward glide and 1 signifies upward
    this.slideStatsDown = this.add.tween(this.stats).to( { y: 438 }, 300, "Quart.easeOut");
    this.slideLeaderboardDown = this.add.tween(this.leaderboard).to( { y: 500 }, 300, "Quart.easeOut");

    this.slideStatsUp = this.add.tween(this.stats).to( { y: 394 }, 300, "Quart.easeOut");
    this.slideLeaderboardUp = this.add.tween(this.leaderboard).to( { y: 456 }, 300, "Quart.easeOut");
    // this.slideLeaderboard.chain(this.slideStats);
    this.slideNewGameBottomDown = this.add.tween(this.startNewGameBottom).to( { y: 368 }, 300, "Quart.easeOut");
    this.slideNewGameBottomUp = this.add.tween(this.startNewGameBottom).to( { y: 340 }, 300, "Quart.easeOut");

    this.slideGameModeFriendDown = this.add.tween(this.gameModeFriend).to( { y: 368 }, 300, "Quart.easeOut");
    this.slideGameModeFriendUp = this.add.tween(this.gameModeFriend).to( { y: 340 }, 300, "Quart.easeOut");
    this.slideGameModeRandomDown = this.add.tween(this.gameModeRandom).to( { y: 368 }, 300, "Quart.easeOut");
    this.slideGameModeRandomUp = this.add.tween(this.gameModeRandom).to( { y: 340 }, 300, "Quart.easeOut");
    this.slideGameModeSoloDown = this.add.tween(this.gameModeSolo).to( { y: 368 }, 300, "Quart.easeOut");
    this.slideGameModeSoloUp = this.add.tween(this.gameModeSolo).to( { y: 340 }, 300, "Quart.easeOut");
  },
  update: function() {
    screenState = 0;
  },
  startNewGameTopInputDown : function() {
    this.startNewGameBottom.frame = 1 ;
  },
  startNewGameTopInputUp : function() {
    this.startNewGameBottom.frame = 0 ;
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
    if(this.slideDirection === 0) {
      this.slideNewGameBottomDown.start();
      this.slideGameModeSoloDown.start();
      this.slideGameModeRandomDown.start();
      this.slideGameModeFriendDown.start();
      this.slideStatsDown.start();
      this.slideLeaderboardDown.start();
      this.gameModeSolo.inputEnabled = true;
      this.gameModeFriend.inputEnabled = true;
      this.gameModeRandom.inputEnabled = true;
    }
    else {
      this.slideGameModeFriendUp.start();
      this.slideGameModeRandomUp.start();
      this.slideGameModeSoloUp.start();
      this.slideNewGameBottomUp.start();
      this.slideLeaderboardUp.start();
      this.slideStatsUp.start();
      this.gameModeSolo.inputEnabled = false;
      this.gameModeRandom.inputEnabled = false;
      this.gameModeFriend.inputEnabled = false;
    }
    this.slideDirection = (this.slideDirection + 1)%2 ;
    // this.state.start('select');
  },
  againstRandom : function() {

  },
  againstFriend : function() {

  },
  againstComputer : function() {
    this.state.start('select');
  },
  helpButtonHandler : function() {
    console.log('Helpp Button Clicked');
  }
};
