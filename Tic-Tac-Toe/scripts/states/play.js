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
      resign.destroy();

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
        }
        else {
          turnText.text = "  YOU LOSE!";
        }
        tempCells = phaserGame.state.states.play.cells.children;
        for(let i = 0 ; i < 9 ; i++) {
          tempCells[i].inputEnabled = false;
        }
      }
      else {
        turnText.text = "GAME DRAW!";
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
    var bg = this.add.sprite(0, 0, 'arena');
    var gameBoard = this.add.sprite(19, 159, 'board');
    var referee = this.add.sprite(105, 80, 'referee');
    resign = this.add.button(130, 528, 'resign', this.resignEvent, this, 0, 0, 1, 0);
    this.help = this.add.button(247, 528, 'help', this.helpButtonHandler, this, 0, 0, 1, 0);

    this.playerProfilePic = phaserGame.add.image(122,24,'profilePic');
    this.playerProfilePic.scale.set(36/this.playerProfilePic.width,36/this.playerProfilePic.height);

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

    this.backButton = this.add.button(16, 32, 'back', this.backButtonHandler, this);
    this.backButton.anchor.setTo(0, 0);

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
    if(win === 0) {
      turnText.text = "YOUR TURN";
    }
  },
  resignEvent : function() {
    turnText.text = " YOU LOSE!";
    setTimeout(this.quitGame,2000);
  },
  quitGame  : function() {
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
  },
  musicButtonHandler  : function() {
    this.musicButton = (this.musicButton.frame + 1)%2;
  },
  backButtonHandler :function() {
    console.log(myGame.gameStatus);
    if(myGame.gameStatus !== 3) {
      saveGameData();
    }
    this.quitGame();
  }
};
