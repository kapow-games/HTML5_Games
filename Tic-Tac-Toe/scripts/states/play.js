// 'use strict';
var CELL_COLS, CELL_ROWS;
CELL_COLS = 9 ;
CELL_ROWS = 9;
var initialMark;
var limit ;
var myBot;
var myGame;
var matchBar = 0 ;
var turnText;
var resign;
var bg;
var backButton;
var fbButton;
var twitterButton;
var shareButton;
var referee;
var help;
var gameEndHandler = function(value) {
  bg.inputEnabled = true;
  bg.input.priorityID = 1;
  backButton.input.priorityID = 2;
  referee.destroy();
  resign.destroy();
  help.destroy();
  shareText = (value===1)?"Lost":(value===2 ? "Won" : "Draw");
  var shareBackground = phaserGame.add.sprite(24, 528, 'shareBackground');
  var shareFbButton = phaserGame.add.button(98, 538, 'fbShare', function() {console.log("Fb share clicked");kapow.social.share(shareText, 'facebook', function(){console.log("Fb share Successfull")},function() { console.log("Fb Share Failed") });});
  shareFbButton.input.priorityID = 2 ;
  var shareTwitterButton = phaserGame.add.button(136, 538, 'twitterShare',  function() {console.log("Twitter share clicked");kapow.social.share(shareText, 'twitter',function(){console.log("Twitter share Successfull")},function() { console.log("Twitter Share Failed") });});
  shareTwitterButton.input.priorityID = 2 ;
  var shareOtherButton = phaserGame.add.button(174, 538, 'otherShare', function() {console.log("Other share clicked");kapow.social.share(shareText, null, function(){console.log("Other share Successfull")},function() { console.log("Other Share Failed") });});
  shareOtherButton.input.priorityID = 2 ;
  var rematchButton = phaserGame.add.button(219, 528, 'rematch',rematchButtonHandler, 0, 0, 1, 0);
  rematchButton.input.priorityID = 2 ;

  // social.share(text, medium ('facebook'/'twitter'/null), successCb, failureCb)
};
var rematchButtonHandler  = function() {
  console.log('rematchButtonHandler Clicked');
  console.log(myGame.gameStatus);
  kapow.endSoloGame(function() {
    boardStatus = {cells:new Array(9)};
    botLevel = -1 ;
    win = 0 ;
    room = null;
    playerMark = 0;
    gameResume = false ;
    console.log("Game Succesfully Closed.");
  }, function(error) {
    console.log("endSoloGame Failed : ",error);
  });
  phaserGame.state.start('select');
};
var gameState = function(oldGameState) {
  this.turn = 0 ; // 0 : No One's Move // 1 : Player 1(x)'s Move // 2 : Player 2(o)'s Move'
  this.oMovesCount = 0 ;
  this.boardResult ; // 0 : Board Result Draw // 1 : Board Result Player 1(x) wins // 2 : Board Result Player 2(o) wins // undefined : game state not decided
  this.board = [] ; //board[i] = 0 : Empty //board[i] = 1 : 'X' //board[i] = 2 : 'O'
  if( typeof(oldGameState) !== "undefined" ) {
    var len = oldGameState.board.length ;
    this.board = new Array(len) ;
    for( var i = 0 ; i < len ; i++ ) {
      this.board[i] = oldGameState.board[i] ;
    }
    this.turn = oldGameState.turn ;
    this.oMovesCount = oldGameState.oMovesCount ;
    this.boardResult = oldGameState.boardResult ;
  }
  this.nextTurn = function() {
    this.turn = ( this.turn === 1 )? 2 : 1 ;
  };
  this.emptyCells = function() {
    var indices = [] ;
    var len = this.board.length;
    for(let i = 0 ; i < len ; i++) {
      if(this.board[i]===0) {
        indices.push(i) ;
      }
    }
    return indices ;
  };
  this.isTerminal = function() {
    let cell = this.board;
    for (let i = 0, j = CELL_ROWS; i < CELL_COLS; i++) {
      if(cell[i] !== 0 && cell[i] === cell[i+j] && cell[i+j] === cell[i+(2*j)]) {
        matchBar = i;
        this.boardResult = cell[i] ;
        return true ;
      }
    }
    //Checking Columns
    for (let i = 0, j = 1; i < CELL_ROWS*CELL_COLS; i+=CELL_COLS) {
      if(cell[i] !== 0 && cell[i] === cell[i+j] && cell[i+j] === cell[i+(2*j)]) {
        matchBar = (i/CELL_COLS)+3;
        this.boardResult = cell[i] ;
        return true;
      }
    }
    //Checking Leading Diagonals '\'
    if(cell[0] !== 0 && cell[0] === cell[4] && cell[4] === cell[8]) {
      matchBar = 6;
      this.boardResult = cell[4] ;
      return true;
    }
    //Checing other Diagonal '/'
    if(cell[2] !== 0 && cell[2] === cell[4] && cell[4] === cell[6]) {
      matchBar = 7;
      this.boardResult = cell[4] ;
      return true;
    }
    if(this.emptyCells().length === 0) {
      this.boardResult = 0 ;
      return true;
    }
    else {
      return false ;
    }
  };
};

var bot = function(difficultyLevel) {
  var botLevel = difficultyLevel ; //0 : easy //1 : Medium //2: Hard
  var gameDetail = {} ;
  function miniMaxValue(state) {
    if(state.isTerminal()) {
      return Game.score(state);
    }
    else {
      var stateScore;
      if(state.turn === 1) {
        stateScore = -1000 ;
      }
      else {
        stateScore = 1000 ;
      }
      var availablePositions = state.emptyCells() ;
      var availableNextStates = availablePositions.map(function(pos) {
        var action = new botBehaviour(pos);
        var nextState = action.applyTo(state);
        return nextState;
      });
      // console.log(availableNextStates);
      availableNextStates.forEach(function(nextState) {
        var nextScore = miniMaxValue(nextState);
        if(state.turn === 1) {
          if(nextScore > stateScore) {
            stateScore = nextScore ;
          }
        }
        else {
          if (nextScore < stateScore) {
            stateScore = nextScore;
          }
        }
      });
      return stateScore ;
    }
  };
  function easyBotMove(turn) {
    var available = gameDetail.currentState.emptyCells();
    var randomCell = available[Math.floor(Math.random() * available.length)];
    // cell[randomCell].frame = turn;
    var action = new botBehaviour(randomCell);
    var next = action.applyTo(gameDetail.currentState);
    //Reflect in UI
    gameDetail.moveTo(next);
  };
  function mediumBotMove(turn) {
    var available = gameDetail.currentState.emptyCells();
    var availableActions = available.map(function(pos) {
      var action = new botBehaviour(pos);
      var next = action.applyTo(gameDetail.currentState);
      action.miniMaxValue = miniMaxValue(next);
      return action;
    });
    if(turn === 2) {
      availableActions.sort(botBehaviour.ASCENDING);
    }
    else {
      availableActions.sort(botBehaviour.DESCENDING);
    }
    var chosenAction;
    if(Math.random()*100 <= 80) {
      chosenAction = availableActions[0];
    }
    else {
      if(availableActions.length >= 2) {
        chosenAction = availableActions[1];
      }
      else {
        chosenAction = availableActions[0];
      }
    }
    var next = chosenAction.applyTo(gameDetail.currentState);
    gameDetail.moveTo(next);
  };
  function hardBotMove(turn) {
    var available = gameDetail.currentState.emptyCells();
    var availableActions = available.map(function(pos) {
      var action = new botBehaviour(pos);
      var next = action.applyTo(gameDetail.currentState);
      action.miniMaxValue = miniMaxValue(next);
      return action;
    });
    if(turn == 2) {
      availableActions.sort(botBehaviour.ASCENDING);
    }
    else {
      availableActions.sort(botBehaviour.DESCENDING);
    }
    var chosenAction = availableActions[0];
    var next = chosenAction.applyTo(gameDetail.currentState);
    gameDetail.moveTo(next);
  };
  this.plays = function(_gameDetail) {
    gameDetail = _gameDetail ;
  };
  this.notifyTurn = function(turn) {
    switch(botLevel) {
      case 0 : easyBotMove(turn); break;
      case 1 : mediumBotMove(turn); break;
      case 2 : hardBotMove(turn); break;
    }
  };
};

var botBehaviour = function(pos) {
  this.movePosition = pos;
  this.miniMaxValue = 0 ;
  this.applyTo = function(currentGameState) {
    var nextGameState = new gameState(currentGameState);
    nextGameState.board[this.movePosition] = (currentGameState.turn === 1 ? playerMark : ((playerMark === 1) ? 2 : 1));
    if(currentGameState.turn == 2) {
      nextGameState.oMovesCount++;
    }
    nextGameState.nextTurn();
    return nextGameState;
  }
};

botBehaviour.ASCENDING = function(firstAction, secondAction) {
  if(firstAction.miniMaxValue < secondAction.miniMaxValue) {
    return -1;
  }
  else if(firstAction.miniMaxValue > secondAction.miniMaxValue) {
    return 1 ;
  }
  else {
    return 0 ;
  }
}

botBehaviour.DESCENDING = function(firstAction, secondAction) {
  if(firstAction.miniMaxValue > secondAction.miniMaxValue) {
    return -1;
  }
  else if(firstAction.miniMaxValue < secondAction.miniMaxValue) {
    return 1 ;
  }
  else {
    return 0 ;
  }
}

var Game = function(bot) {
  this.bot = bot ;
  this.currentState = new gameState();
  this.currentState.board = new Array(9);
  for(let i = 0 ; i < CELL_COLS*CELL_ROWS ; i++) {
    // this.currentState.board.push(0);
    this.currentState.board[i] = boardStatus.cells[i]!==undefined ? boardStatus.cells[i] :0;
  }
  this.currentState.turn = 1 ;//playerMark === 1 ? 2 : 1 ;

  if(playerMark === 2 && gameResume === false) {
    var randomCell = Math.floor(Math.random() * CELL_ROWS*CELL_COLS);
    this.currentState.board[randomCell] = 1 ;
    initialMark = randomCell ;
  }

  this.gameStatus = -1 ;// To indicate game begining
  this.moveTo = function(_state) {
    this.currentState = _state ;
    if(_state.isTerminal()) {

      this.gameStatus = 3 // Indicating game Over
      // console.log(_state);
      if(_state.boardResult === 1) {
        win = 1 ;
      }
      else if(_state.boardResult === 2) {
        win = 2 ;
      }
      else {
        win = 0 ;
      }
      if(win !== 0) {
        if(win === playerMark) {
          turnText.text = "  YOU WIN!";
          gameEndHandler(2);
        }
        else {
          turnText.text = "  YOU LOSE!";
          gameEndHandler(1);
        }
        // tempCells = phaserGame.state.states.play.cells.children;
        // for(let i = 0 ; i < 9 ; i++) {
        //   tempCells[i].inputEnabled = false;
        // }
      }
      else {
        turnText.text = "GAME DRAW!";
        gameEndHandler(0);
        // gameInputHandler(0)
      }
      if(win !== 0) {
        switch(matchBar) {
          case 0 : this.matchPosition = phaserGame.add.sprite(184, 211, 'rectangle');this.matchPosition.anchor.setTo(0.5);this.matchPosition.angle=90;break;
          case 1 : this.matchPosition = phaserGame.add.sprite(184, 316, 'rectangle');this.matchPosition.anchor.setTo(0.5);this.matchPosition.angle=90;break;
          case 2 : this.matchPosition = phaserGame.add.sprite(184, 421, 'rectangle');this.matchPosition.anchor.setTo(0.5);this.matchPosition.angle=90;break;
          case 3 : this.matchPosition = phaserGame.add.sprite(74, 316, 'rectangle');this.matchPosition.anchor.setTo(0.5);break;
          case 4 : this.matchPosition = phaserGame.add.sprite(184, 316, 'rectangle');this.matchPosition.anchor.setTo(0.5);break;
          case 5 : this.matchPosition = phaserGame.add.sprite(294, 316, 'rectangle');this.matchPosition.anchor.setTo(0.5);break;
          case 6 : this.matchPosition = phaserGame.add.sprite(184, 316, 'rectangle');this.matchPosition.anchor.setTo(0.5);this.matchPosition.angle=-45;break;
          case 7 : this.matchPosition = phaserGame.add.sprite(184, 316, 'rectangle');this.matchPosition.anchor.setTo(0.5);this.matchPosition.angle=45;break;
        }
      }
      // kapow.endSoloGame(function() {
      //   boardStatus = {cells:new Array(9)};
      //   botLevel = -1 ;
      //   room = null;
      //   playerMark = 0;
      //   gameResume = false ;
      //   console.log("Game Succesfully Closed.");
      //   // phaserGame.state.start('gameover');
      // }, function(error) {
      //   console.log("endSoloGame Failed : ",error);
      // });
    }
    else {
      if(this.currentState.turn === 1) {
        //Player's Turn
      }
      else {
        this.bot.notifyTurn(2);
      }
    }
  };
  this.start = function() {
    if(this.gameStatus === -1) {
      this.moveTo(this.currentState);
      this.gameStatus = 0;
    }
  };
};

Game.score = function(_state) {
  if(_state.result !== 0) {
    if(_state.boardResult === 1) {
      //X won
      return 10 - _state.oMovesCount;
    }
    else if(_state.boardResult === 2) {
      //O won
      return -10 + _state.oMovesCount;
    }
    else {
      //Draw
      return 0;
    }
  }
};

var play = function() {};
play.prototype = {
  preload:  function() {
    screenState = 1;
    this.clickBlocked = false;
  },
  create: function() {
    screenState = 1 ;
    console.log("Loading Game Layout.");
    var CELL_WIDTH, CELL_HEIGHT, CELL_WIDTH_PAD, CELL_HEIGHT_PAD, CELL_RELATIVE_TOP, CELL_RELATIVE_LEFT;
    CELL_WIDTH = CELL_HEIGHT = 88;
    CELL_COLS = CELL_ROWS = 3;
    CELL_WIDTH_PAD = CELL_HEIGHT_PAD = 18;
    CELL_RELATIVE_TOP = 167;
    CELL_RELATIVE_LEFT = 30;

    limit  = (CELL_ROWS*CELL_COLS) -1 ;
    bg = phaserGame.add.sprite(0, 0, 'arena');
    // bg.inputEnabled = false;

    var gameBoard = this.add.sprite(19, 159, 'board');
    var resultBoard = phaserGame.add.sprite(105, 80, 'winBackground');
    referee = this.add.sprite(105, 80, 'referee');
    resign = this.add.button(130, 528, 'resign', this.resignEvent, this, 0, 0, 1, 0);
    help = this.add.button(247, 528, 'helpEnd', this.helpButtonHandler, this, 0, 0, 1, 0);

    this.playerProfilePicBackground = this.add.image(122,24,'circle');
    this.playerProfilePicBackground.scale.set(40/this.playerProfilePicBackground.width,40/this.playerProfilePicBackground.height);


    this.playerProfilePic = this.add.image(124,26,'profilePic');
    this.playerProfilePic.scale.set(36/this.playerProfilePic.width,36/this.playerProfilePic.height);

    mask = phaserGame.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(142,44,36);
    this.playerProfilePic.mask = mask;

    this.playerProfilePicMarkBackground = this.add.image(146,48,'circle');
    this.playerProfilePicMarkBackground.scale.set(16/this.playerProfilePicMarkBackground.width,16/this.playerProfilePicMarkBackground.height);

    this.playerProfilePicMark = this.add.sprite(146,48,'cell');
    this.playerProfilePicMark.frame = playerMark ;
    this.playerProfilePicMark.scale.set(16/this.playerProfilePicMark.width,16/this.playerProfilePicMark.height);


    this.botProfilePicBackground = this.add.image(198,24,'circle');
    this.botProfilePicBackground.scale.set(40/this.botProfilePicBackground.width,40/this.botProfilePicBackground.height);

    this.botProfilePic = this.add.image(200,26,'botPic');
    this.botProfilePic.scale.set(36/this.botProfilePic.width,36/this.botProfilePic.height);

    mask = phaserGame.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(218,44,36);
    this.botProfilePic.mask = mask;

    this.botProfilePicMarkBackground = this.add.image(198,48,'circle');
    this.botProfilePicMarkBackground.scale.set(16/this.botProfilePicMarkBackground.width,16/this.botProfilePicMarkBackground.height);

    this.botProfilePicMark = this.add.sprite(198,48,'cell');
    this.botProfilePicMark.frame = ( (playerMark === 2) ? 1 : 2) ;
    this.botProfilePicMark.scale.set(16/this.botProfilePicMark.width,16/this.botProfilePicMark.height);



    turnText = phaserGame.add.text(122, 92, "YOUR TURN");
    turnText.fontStyle = 'normal';
    turnText.fontSize = "20px";
    turnText.fontWeight = 800;
    turnText.wordWrapWidth = 119;
    turnText.fill = "#fefefe";
    turnText.align = "center";
    turnText.backgroundColor = "#5684fb";

    this.vs = phaserGame.add.text(170, 35, "VS");
    this.vs.fontStyle = 'normal';
    this.vs.fontSize = "14px";
    this.vs.fontWeight = 800;
    this.vs.wordWrapWidth = 119;
    this.vs.fill = "#fefefe";
    this.vs.align = "center";
    this.vs.backgroundColor = "#5684fb";

    backButton = this.add.button(16, 32, 'back', this.backButtonHandler, this);
    backButton.anchor.setTo(0, 0);

    this.musicButton = this.add.button(320, 32, 'music', this.musicButtonHandler, this);
    this.musicButton.anchor.setTo(0, 0);

    // bg.height = this.height;
    // bg.width = this.width;
    var count = 0 ;
    win = 0 ;
    this.cells = this.add.group();
    this.player = 1;
    this.cellFilled = 0 ;
    this.cells.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < CELL_COLS; i++) {
      for (var j = 0; j < CELL_ROWS; j++) {
        var cell = this.cells.create(i * (CELL_WIDTH+CELL_WIDTH_PAD) + CELL_RELATIVE_LEFT, j * (CELL_HEIGHT+CELL_HEIGHT_PAD) + CELL_RELATIVE_TOP, 'cell');
        if(gameResume === true){
          cell.frame = boardStatus.cells[count] ;
          if(boardStatus.cells[count] === 0 ) {
            cell.frame = 0;
            cell.inputEnabled = true;
            cell.events.onInputDown.add(this.clickHandler, this);
          }
          else {
            cell.frame = boardStatus.cells[count] ;
          }
          // cell.events.onInputDown.add(this.addPlayerMarker, this);
        }
        else {
          cell.frame = 0;
          cell.inputEnabled = true;
          cell.events.onInputDown.add(this.clickHandler, this);
        }
        cell.frameIndex = count++;
        this.physics.arcade.enable(cell);
      }
    }
    // if(playerMark === 2) {
    //   initialBoard[randomCell] = 1 ;
    //   var randomCell = Math.floor(Math.random() * CELL_ROWS*CELL_COLS);
    //   this.cells.children[randomCell] =
    // }
    myBot = new bot(1);
    myGame = new Game(myBot);
    if(playerMark === 2 && gameResume === false) {
      this.cells.children[initialMark].frame = 1;
      this.cells.children[initialMark].inputEnabled = false ;
    }
    myBot.plays(myGame);
    myGame.start();

    // console.log(this.cells);
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },
  update: function() {

  },

  clickHandler: function(sprite, pointer) {
    console.log(this.clickBlocked);
    if(this.clickBlocked === false) {
      this.clickBlocked = true ;
      console.log(this.clickBlocked);
      var cell = this.cells.children;
      if(sprite.frame === 0) {
        // console.log("Hi");
        sprite.frame = playerMark;
        turnText.text = "BOT'S TURN";

        this.nextMove(sprite, pointer, cell);
        // saveRoomData();

        // console.log(myGame.currentState.board);
      }
      this.clickBlocked = false;
    }
    else {
      console.log('Click Cancelled');
    }
  },

  nextMove: function(sprite, pointer, cell) {
    var next = new gameState(myGame.currentState);
    next.board[sprite.frameIndex]=playerMark;
    sprite.frame = playerMark;
    // console.log(myGame);
    next.nextTurn();
    myGame.moveTo(next);
    for(let i = 0 ; i < CELL_COLS * CELL_ROWS ;i++) {
      cell[i].frame = myGame.currentState.board[i];
    }
    if(win === 0 && myGame.gameStatus !== 3) {
      turnText.text = "YOUR TURN";
    }
  },
  resignEvent : function() {
    this.darkOverlay = phaserGame.add.button(0, 0, 'darkOverlay', this.cancelResign, this);
    this.darkOverlay.inputEnabled = true ;
    this.darkOverlay.input.priorityID = 1 ;

    this.resignModal = phaserGame.add.sprite(24, 180, 'resignModal');
    this.resignModal.inputEnabled = true ;
    this.resignModal.input.priorityID = 2 ;

    this.cancelButton = phaserGame.add.button(97, 397, 'cancel', this.cancelResign, this);
    this.cancelButton.inputEnabled = true ;
    this.cancelButton.input.priorityID = 3 ;

    this.yesResignButton = phaserGame.add.button(174, 397, 'yesResign', this.quitGame, this);
    this.yesResignButton.inputEnabled = true ;
    this.yesResignButton.input.priorityID = 3 ;


    // turnText.text = " YOU LOSE!";
    // bg.input.priorityID = 1 ;
    // setTimeout(this.quitGame,4000);
  },
  cancelResign  : function() {
    this.yesResignButton.destroy();
    this.cancelButton.destroy();
    this.resignModal.destroy();
    this.darkOverlay.destroy();
  },
  quitGame  : function() {
    bg.inputEnabled = true;
    bg.input.priorityID = 1 ;
    this.yesResignButton.destroy();
    this.cancelButton.destroy();
    this.resignModal.destroy();
    this.darkOverlay.destroy();
    tempCells = phaserGame.state.states.play.cells.children;
    turnText.text = " YOU LOSE!";
    gameEndHandler(1);
    setTimeout(function() {
      kapow.endSoloGame(function() {
        boardStatus = {cells:new Array(9)};
        botLevel = -1 ;
        win = 0 ;
        room = null;
        playerMark = 0;
        gameResume = false ;
        console.log("Game Succesfully Closed.");
        phaserGame.state.start('menu');
      }, function(error) {
        console.log("endSoloGame Failed : ",error);
      });
    },2000);
  },
  musicButtonHandler  : function() {
    this.musicButton = (this.musicButton.frame + 1)%2;
  },
  backButtonHandler :function() {
    console.log(myGame.gameStatus);
    if(myGame.gameStatus !== 3) {
      saveGameData();
    }
    else {
      kapow.endSoloGame(function() {
        boardStatus = {cells:new Array(9)};
        botLevel = -1 ;
        win = 0 ;
        room = null;
        playerMark = 0;
        gameResume = false ;
        console.log("Game Succesfully Closed.");
      }, function(error) {
        console.log("endSoloGame Failed : ",error);
      });
    }
    phaserGame.state.start('menu');
  }
};
