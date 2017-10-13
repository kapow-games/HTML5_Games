'use strict';
var menu = function() {};
menu.prototype = {
  create: function() {
    screenState = 0 ;
    this.bg = this.add.image(0, 0, 'arena');

    this.logo = this.add.image(165, 285, 'logo');
    this.logo.anchor.setTo(0, 0);

    this.activeGames = this.add.button(48, 768 , 'onGoing', this.showActiveGames, this, 0, 0, 1, 0);
    this.activeGames.anchor.setTo(0, 0);

    this.startNewGameBottom = this.add.sprite(48, 1020, 'newGameBottom');
    this.startNewGameBottom.frame = 0;
    this.startNewGameBottom.anchor.setTo(0, 0);

    this.gameModeFriend = this.add.button(48, 1020, 'gameModes', this.againstFriend, this, 0, 0, 0, 0);
    this.gameModeFriend.inputEnabled = false;
    this.gameModeFriend.anchor.setTo(0, 0);

    this.gameModeRandom = this.add.button(375, 1020, 'gameModes', this.againstRandom, this, 1, 1, 1, 1);
    this.gameModeRandom.inputEnabled = false;
    this.gameModeRandom.anchor.setTo(0, 0);

    this.gameModeSolo = this.add.button(702, 1020, 'gameModes', this.againstComputer, this, 2, 2, 2, 2);
    this.gameModeSolo.inputEnabled = false;
    this.gameModeSolo.anchor.setTo(0, 0);

    this.startNewGameTop = this.add.button(48, 996, 'newGameTop', this.newGameButtonHandler, this, 0, 0, 1, 0);
    this.startNewGameTop.anchor.setTo(0, 0);
    this.startNewGameTop.onInputDown.add(this.startNewGameTopInputDown, this) ;
    this.startNewGameTop.onInputUp.add(this.startNewGameTopInputUp, this) ;
    this.startNewGameTop.onInputOut.add(this.startNewGameTopInputUp, this) ;

    this.arrowRight = this.add.sprite(972, 1062, 'arrowRight');
    this.arrowRight.anchor.setTo(0.5,0.5);

    this.stats = this.add.button(48, 1182, 'stats', this.statHandler, this, 0, 0, 1, 0);
    this.stats.anchor.setTo(0, 0);

    this.leaderboard = this.add.button(48, 1368, 'leaderBoard', this.leaderboardHandler, this, 0, 0, 1, 0);
    this.leaderboard.anchor.setTo(0, 0);

    this.backButton = this.add.button(48, 96, 'back', this.backButtonHandler, this);
    this.backButton.anchor.setTo(0, 0);

    this.soundToggle = this.add.button(960, 96, 'music', this.musicToggle, this);
    this.soundToggle.anchor.setTo(0, 0);

    this.helpButton = this.add.button(840, 96, 'help', this.helpButtonHandler, this);
    this.helpButton.anchor.setTo(0, 0);

    this.slideDirection = 0 ; // 0 signigies downward glide and 1 signifies upward
    this.slideStatsDown = this.add.tween(this.stats).to( { y: 1314 }, 300, "Quart.easeOut");
    this.slideLeaderboardDown = this.add.tween(this.leaderboard).to( { y: 1500 }, 300, "Quart.easeOut");

    this.slideStatsUp = this.add.tween(this.stats).to( { y: 1182 }, 300, "Quart.easeOut");
    this.slideLeaderboardUp = this.add.tween(this.leaderboard).to( { y: 1368 }, 300, "Quart.easeOut");
    this.slideNewGameBottomDown = this.add.tween(this.startNewGameBottom).to( { y: 1104 }, 300, "Quart.easeOut");
    this.slideNewGameBottomUp = this.add.tween(this.startNewGameBottom).to( { y: 1020 }, 300, "Quart.easeOut");

    this.slideGameModeFriendDown = this.add.tween(this.gameModeFriend).to( { y: 1104 }, 300, "Quart.easeOut");
    this.slideGameModeFriendUp = this.add.tween(this.gameModeFriend).to( { y: 1020 }, 300, "Quart.easeOut");
    this.slideGameModeRandomDown = this.add.tween(this.gameModeRandom).to( { y: 1104 }, 300, "Quart.easeOut");
    this.slideGameModeRandomUp = this.add.tween(this.gameModeRandom).to( { y: 1020 }, 300, "Quart.easeOut");
    this.slideGameModeSoloDown = this.add.tween(this.gameModeSolo).to( { y: 1104 }, 300, "Quart.easeOut");
    this.slideGameModeSoloUp = this.add.tween(this.gameModeSolo).to( { y: 1020 }, 300, "Quart.easeOut");
    this.arrowRotateRightToDown = this.add.tween(this.arrowRight).to( { angle: 90 }, 200, Phaser.Easing.Linear.None);
    this.arrowRotateDownToRight = this.add.tween(this.arrowRight).to( { angle: 0 }, 200, Phaser.Easing.Linear.None);
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
    //TODO : Stats handler
    this.darkOverlay = phaserGame.add.button(0, 0, 'darkOverlay', this.cancelStats, this);
    this.darkOverlay.inputEnabled = true ;
    this.darkOverlay.input.priorityID = 2 ;

    this.statsModal = phaserGame.add.sprite(540, 961.5, 'statsBackground');
    this.statsModal.inputEnabled = true ;
    this.statsModal.input.priorityID = 3 ;
    this.statsModal.anchor.setTo(0.5);
    ////////
    this.statsModal.scale.setTo(0);
    this.popUpStatsModal = this.add.tween(this.statsModal.scale).to( { x : 1, y :1 }, 600, "Quart.easeOut");
    this.popUpStatsModal.start();
    this.popUpStatsModal.onComplete.add(function() {
      this.statsLogo = phaserGame.add.sprite(360, 465, 'statsLogo');
      // this.statsLogoTween = this.add.tween(this.statsLogo).to({ x: this.statsLogo.position.x + aRadius}, aTime, function (k) {
      //   return Easing.wiggle(k, aXPeriod1, aXPeriod2);
      // }, true, 0, -1);
      this.myStatsText = createText(394.5, 848, 'MY STATS');
      this.myStatsText.font = 'nunito-regular';
      this.myStatsText.fontSize = "60px";
      this.myStatsText.fontWeight = 800;
      this.myStatsText.wordWrapWidth = 291;
      this.myStatsText.fill = "#6d616d";
      this.myStatsText.align = "center";
      this.myStatsText.backgroundColor = "#fefefe";

      this.cancelButton = phaserGame.add.button(888, 441, 'statsClose', this.cancelStats, this);
      this.cancelButton.inputEnabled = true ;
      this.cancelButton.input.priorityID = 4 ;
      var that = this;
      kapow.gameStore.get('stats',function(statsValue) {
        console.log("gameStore fetch successfull.");
        if(statsValue) {
          console.log("Value fetched from gameStore was : ",statsValue);
          let valueJSON = JSON.parse(statsValue);
          that.statsModeBackground = phaserGame.add.sprite(120, 978, 'modeBackground');

          that.statsTotalBackground = phaserGame.add.sprite(120, 1362, 'statsTotalBackground');

          that.modeText = createText(156, 1002, "MODE");
          that.modeText.font = 'nunito-regular';
          that.modeText.fontSize = "36px";
          that.modeText.fontWeight = 800;
          that.modeText.wordWrapWidth = 109;
          that.modeText.fill = "#9e7eff";
          that.modeText.align = "center";
          that.modeText.backgroundColor = "#e2e6ff";

          that.playedText = createText(414.5, 1002, "PLAYED");
          that.playedText.font = 'nunito-regular';
          that.playedText.fontSize = "36px";
          that.playedText.fontWeight = 800;
          that.playedText.wordWrapWidth = 143;
          that.playedText.fill = "#9e7eff";
          that.playedText.align = "center";
          that.playedText.backgroundColor = "#e2e6ff";

          that.wonText = createText(576, 1002, "WON");
          that.wonText.font = 'nunito-regular';
          that.wonText.fontSize = "36px";
          that.wonText.fontWeight = 800;
          that.wonText.wordWrapWidth = 96;
          that.wonText.fill = "#9e7eff";
          that.wonText.align = "center";
          that.wonText.backgroundColor = "#e2e6ff";

          that.lostText = createText(691, 1002, "LOST");
          that.lostText.font = 'nunito-regular';
          that.lostText.fontSize = "36px";
          that.lostText.fontWeight = 800;
          that.lostText.wordWrapWidth = 94;
          that.lostText.fill = "#9e7eff";
          that.lostText.align = "center";
          that.lostText.backgroundColor = "#e2e6ff";

          that.drawText = createText(804.5, 1002, "DRAW");
          that.drawText.font = 'nunito-regular';
          that.drawText.fontSize = "36px";
          that.drawText.fontWeight = 800;
          that.drawText.wordWrapWidth = 119;
          that.drawText.fill = "#9e7eff";
          that.drawText.align = "center";
          that.drawText.backgroundColor = "#e2e6ff";

          that.friendsText = createText(156, 1110, "FRIENDS");
          that.friendsText.font = 'nunito-regular';
          that.friendsText.fontSize = "36px";
          that.friendsText.fontWeight = 800;
          that.friendsText.wordWrapWidth = 158;
          that.friendsText.fill = "#7a797a";
          that.friendsText.align = "center";
          that.friendsText.backgroundColor = "#fefefe";

          that.randomText = createText(156, 1194, "RANDOM");
          that.randomText.font = 'nunito-regular';
          that.randomText.fontSize = "36px";
          that.randomText.fontWeight = 800;
          that.randomText.wordWrapWidth = 167;
          that.randomText.fill = "#7a797a";
          that.randomText.align = "center";
          that.randomText.backgroundColor = "#fefefe";

          that.practiceText = createText(156, 1278, "PRACTICE");
          that.practiceText.font = 'nunito-regular';
          that.practiceText.fontSize = "36px";
          that.practiceText.fontWeight = 800;
          that.practiceText.wordWrapWidth = 181;
          that.practiceText.fill = "#7a797a";
          that.practiceText.align = "center";
          that.practiceText.backgroundColor = "#fefefe";

          that.totalText = createText(156, 1386, "TOTAL");
          that.totalText.font = 'nunito-regular';
          that.totalText.fontSize = "36px";
          that.totalText.fontWeight = 800;
          that.totalText.wordWrapWidth = 117;
          that.totalText.fill = "#f0a207";
          that.totalText.align = "center";
          that.totalText.backgroundColor = "#fefefe";

          that.randomPlayedText = createText(486, 1218.5, (valueJSON.randomStats.won + valueJSON.randomStats.lost + valueJSON.randomStats.draw).toString());
          that.randomPlayedText.anchor.setTo(0.5,0.5);
          that.randomPlayedText.font = 'nunito-regular';
          that.randomPlayedText.fontSize = "36px";
          that.randomPlayedText.fontWeight = 800;
          that.randomPlayedText.wordWrapWidth = 181;
          that.randomPlayedText.fill = "#7a797a";
          that.randomPlayedText.align = "center";
          that.randomPlayedText.backgroundColor = "#fefefe";

          that.randomWonText = createText(624, 1218.5, valueJSON.randomStats.won.toString());
          that.randomWonText.anchor.setTo(0.5,0.5);
          that.randomWonText.font = 'nunito-regular';
          that.randomWonText.fontSize = "36px";
          that.randomWonText.fontWeight = 800;
          that.randomWonText.wordWrapWidth = 181;
          that.randomWonText.fill = "#7a797a";
          that.randomWonText.align = "center";
          that.randomWonText.backgroundColor = "#fefefe";

          that.randomLostText = createText(738, 1218.5, valueJSON.randomStats.lost.toString());
          that.randomLostText.anchor.setTo(0.5,0.5);
          that.randomLostText.font = 'nunito-regular';
          that.randomLostText.fontSize = "36px";
          that.randomLostText.fontWeight = 800;
          that.randomLostText.wordWrapWidth = 181;
          that.randomLostText.fill = "#7a797a";
          that.randomLostText.align = "center";
          that.randomLostText.backgroundColor = "#fefefe";

          that.randomDrawText = createText(864, 1218.5, valueJSON.randomStats.draw.toString());
          that.randomDrawText.anchor.setTo(0.5,0.5);
          that.randomDrawText.font = 'nunito-regular';
          that.randomDrawText.fontSize = "36px";
          that.randomDrawText.fontWeight = 800;
          that.randomDrawText.wordWrapWidth = 181;
          that.randomDrawText.fill = "#7a797a";
          that.randomDrawText.align = "center";
          that.randomDrawText.backgroundColor = "#fefefe";

          that.friendsPlayedText = createText(486, 1134.5, (valueJSON.friendsStats.won + valueJSON.friendsStats.lost + valueJSON.friendsStats.draw).toString());
          that.friendsPlayedText.anchor.setTo(0.5,0.5);
          that.friendsPlayedText.font = 'nunito-regular';
          that.friendsPlayedText.fontSize = "36px";
          that.friendsPlayedText.fontWeight = 800;
          that.friendsPlayedText.wordWrapWidth = 181;
          that.friendsPlayedText.fill = "#7a797a";
          that.friendsPlayedText.align = "center";
          that.friendsPlayedText.backgroundColor = "#fefefe";

          that.friendsWonText = createText(624, 1134.5, valueJSON.friendsStats.won.toString());
          that.friendsWonText.anchor.setTo(0.5,0.5);
          that.friendsWonText.font = 'nunito-regular';
          that.friendsWonText.fontSize = "36px";
          that.friendsWonText.fontWeight = 800;
          that.friendsWonText.wordWrapWidth = 181;
          that.friendsWonText.fill = "#7a797a";
          that.friendsWonText.align = "center";
          that.friendsWonText.backgroundColor = "#fefefe";

          that.friendsLostText = createText(738, 1134.5, valueJSON.friendsStats.lost.toString());
          that.friendsLostText.anchor.setTo(0.5,0.5);
          that.friendsLostText.font = 'nunito-regular';
          that.friendsLostText.fontSize = "36px";
          that.friendsLostText.fontWeight = 800;
          that.friendsLostText.wordWrapWidth = 181;
          that.friendsLostText.fill = "#7a797a";
          that.friendsLostText.align = "center";
          that.friendsLostText.backgroundColor = "#fefefe";

          that.friendsDrawText = createText(864, 1134.5, valueJSON.friendsStats.draw.toString());
          that.friendsDrawText.anchor.setTo(0.5,0.5);
          that.friendsDrawText.font = 'nunito-regular';
          that.friendsDrawText.fontSize = "36px";
          that.friendsDrawText.fontWeight = 800;
          that.friendsDrawText.wordWrapWidth = 181;
          that.friendsDrawText.fill = "#7a797a";
          that.friendsDrawText.align = "center";
          that.friendsDrawText.backgroundColor = "#fefefe";

          that.soloPlayedText = createText(486, 1302.5, (valueJSON.soloStats.won + valueJSON.soloStats.lost + valueJSON.soloStats.draw).toString());
          that.soloPlayedText.anchor.setTo(0.5,0.5);
          that.soloPlayedText.font = 'nunito-regular';
          that.soloPlayedText.fontSize = "36px";
          that.soloPlayedText.fontWeight = 800;
          that.soloPlayedText.wordWrapWidth = 181;
          that.soloPlayedText.fill = "#7a797a";
          that.soloPlayedText.align = "center";
          that.soloPlayedText.backgroundColor = "#fefefe";

          that.soloWonText = createText(624, 1302.5, valueJSON.soloStats.won.toString());
          that.soloWonText.anchor.setTo(0.5,0.5);
          that.soloWonText.font = 'nunito-regular';
          that.soloWonText.fontSize = "36px";
          that.soloWonText.fontWeight = 800;
          that.soloWonText.wordWrapWidth = 181;
          that.soloWonText.fill = "#7a797a";
          that.soloWonText.align = "center";
          that.soloWonText.backgroundColor = "#fefefe";

          that.soloLostText = createText(738, 1302.5, valueJSON.soloStats.lost.toString());
          that.soloLostText.anchor.setTo(0.5,0.5);
          that.soloLostText.font = 'nunito-regular';
          that.soloLostText.fontSize = "36px";
          that.soloLostText.fontWeight = 800;
          that.soloLostText.wordWrapWidth = 181;
          that.soloLostText.fill = "#7a797a";
          that.soloLostText.align = "center";
          that.soloLostText.backgroundColor = "#fefefe";

          that.soloDrawText = createText(864, 1302.5, valueJSON.soloStats.draw.toString());
          that.soloDrawText.anchor.setTo(0.5,0.5);
          that.soloDrawText.font = 'nunito-regular';
          that.soloDrawText.fontSize = "36px";
          that.soloDrawText.fontWeight = 800;
          that.soloDrawText.wordWrapWidth = 181;
          that.soloDrawText.fill = "#7a797a";
          that.soloDrawText.align = "center";
          that.soloDrawText.backgroundColor = "#fefefe";

          that.totalPlayedText = createText(486, 1410.5, (valueJSON.soloStats.won + valueJSON.soloStats.lost + valueJSON.soloStats.draw + valueJSON.friendsStats.won + valueJSON.friendsStats.lost + valueJSON.friendsStats.draw + valueJSON.randomStats.won + valueJSON.randomStats.lost + valueJSON.randomStats.draw).toString());
          that.totalPlayedText.anchor.setTo(0.5,0.5);
          that.totalPlayedText.font = 'nunito-regular';
          that.totalPlayedText.fontSize = "36px";
          that.totalPlayedText.fontWeight = 800;
          that.totalPlayedText.wordWrapWidth = 181;
          that.totalPlayedText.fill = "#f0a207";
          that.totalPlayedText.align = "center";
          that.totalPlayedText.backgroundColor = "#fcf6e4";

          that.totalWonText = createText(624, 1410.5, (valueJSON.soloStats.won + valueJSON.friendsStats.won + valueJSON.randomStats.won).toString());
          that.totalWonText.anchor.setTo(0.5,0.5);
          that.totalWonText.font = 'nunito-regular';
          that.totalWonText.fontSize = "36px";
          that.totalWonText.fontWeight = 800;
          that.totalWonText.wordWrapWidth = 181;
          that.totalWonText.fill = "#f0a207";
          that.totalWonText.align = "center";
          that.totalWonText.backgroundColor = "#fcf6e4";

          that.totalLostText = createText(738, 1410.5, (valueJSON.soloStats.lost + valueJSON.friendsStats.lost + valueJSON.randomStats.lost).toString());
          that.totalLostText.anchor.setTo(0.5,0.5);
          that.totalLostText.font = 'nunito-regular';
          that.totalLostText.fontSize = "36px";
          that.totalLostText.fontWeight = 800;
          that.totalLostText.wordWrapWidth = 181;
          that.totalLostText.fill = "#f0a207";
          that.totalLostText.align = "center";
          that.totalLostText.backgroundColor = "#fcf6e4";

          that.totalDrawText = createText(864, 1410.5, (valueJSON.soloStats.draw + valueJSON.friendsStats.draw + valueJSON.randomStats.draw).toString());
          that.totalDrawText.anchor.setTo(0.5,0.5);
          that.totalDrawText.font = 'nunito-regular';
          that.totalDrawText.fontSize = "36px";
          that.totalDrawText.fontWeight = 800;
          that.totalDrawText.wordWrapWidth = 181;
          that.totalDrawText.fill = "#f0a207";
          that.totalDrawText.align = "center";
          that.totalDrawText.backgroundColor = "#fcf6e4";
        }
      },
      function(error) {
        console.log("stats data fetch from gameStore failed with error :",error);
      });
    }, this);
    console.log('Stat handler funtion implemented');
  },
  leaderboardHandler : function() {
    console.log('Leaderboard handler funtion implemented');
    kapow.boards.display({'metric':'points','interval':'alltime'});
  },
  showActiveGames : function() {
    console.log('Active games requested');
    kapow.showActiveRooms();
  },
  newGameButtonHandler: function() {
    console.log('New Game Button Clicked');
    if(this.slideDirection === 0) {
      this.arrowRotateRightToDown.start();
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
      this.arrowRotateDownToRight.start();
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
  },
  againstRandom : function() {
    gameType = 'random';
    randomRoom = true;
    console.log("Creating room for Random game");
    kapow.startGameWithRandomPlayers({'difficulty':'medium'}, function(roomDetail) {
      room = roomDetail;
      playerMark = 1 ;
      opponentMark = 2 ;
      parseRoomAndRedirectToGame();
    }, function(error) {
      console.log("startvsRandomGame Failed : ",error);
    });
  },
  againstFriend : function() {
    gameType = 'friend';
    kapow.startGameWithFriends(2, 2, function(roomDetail) {
      room = roomDetail;
      playerMark = 1 ;
      opponentMark = 2 ;
      parseRoomAndRedirectToGame();
    }, function(error) {
      console.log("startvsFriendGame Failed : ",error);
    });
  },
  againstComputer : function() {
    gameType = 'solo';
    this.state.start('select');
  },
  helpButtonHandler : function() {
    console.log('Help Button Clicked');
  },
  cancelStats  : function() {
    this.statsLogo.destroy();
    this.modeText.destroy();
    this.playedText.destroy();
    this.wonText.destroy();
    this.lostText.destroy();
    this.drawText.destroy();
    this.cancelButton.destroy();
    this.statsModal.destroy();
    this.darkOverlay.destroy();
    this.randomText.destroy();
    this.friendsText.destroy();
    this.practiceText.destroy();
    this.totalText.destroy();
    this.myStatsText.destroy();
    this.friendsPlayedText.destroy();
    this.friendsWonText.destroy();
    this.friendsLostText.destroy();
    this.friendsDrawText.destroy();
    this.randomPlayedText.destroy();
    this.randomWonText.destroy();
    this.randomLostText.destroy();
    this.randomDrawText.destroy();
    this.soloPlayedText.destroy();
    this.soloWonText.destroy();
    this.soloLostText.destroy();
    this.soloDrawText.destroy();
    this.totalPlayedText.destroy();
    this.totalWonText.destroy();
    this.totalLostText.destroy();
    this.totalDrawText.destroy();
    this.statsModeBackground.destroy();
    this.statsTotalBackground.destroy();
  }
};
// var wiggle = function(aProgress, aPeriod1, aPeriod2){
//     var current1 = aProgress * Math.PI * 2 * aPeriod1;
//     var current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2);
//
//     return Math.sin(current1) * Math.cos(current2);
// };
