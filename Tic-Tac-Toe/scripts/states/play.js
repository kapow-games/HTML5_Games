'use strict';
var win = 0 ;
var CELL_COLS, CELL_ROWS;
CELL_COLS = 9 ;
CELL_ROWS = 9;
var limit ;
var myBot;
var myGame;
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
        this.boardResult = cell[i] ;
        return true ;
      }
    }
    //Checking Columns
    for (let i = 0, j = 1; i < CELL_ROWS*CELL_COLS; i+=CELL_COLS) {
      if(cell[i] !== 0 && cell[i] === cell[i+j] && cell[i+j] === cell[i+(2*j)]) {
        this.boardResult = cell[i] ;
        return true;
      }
    }
    //Checking Leading Diagonals '\'
    if(cell[0] !== 0 && cell[0] === cell[4] && cell[4] === cell[8]) {
      this.boardResult = cell[4] ;
      return true;
    }
    //Checing other Diagonal '/'
    if(cell[2] !== 0 && cell[2] === cell[4] && cell[4] === cell[6]) {
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
  var game = {} ;
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
    var available = game.currentState.emptyCells();
    var randomCell = available[Math.floor(Math.random() * available.length)];
    // cell[randomCell].frame = turn;
    var action = new botBehaviour(randomCell);
    var next = action.applyTo(game.currentState);
    //Reflect in UI
    game.moveTo(next);
  };
  function mediumBotMove(turn) {
    var available = game.currentState.emptyCells();
    var availableActions = available.map(function(pos) {
      var action = new botBehaviour(pos);
      var next = action.applyTo(game.currentState);
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
    var next = chosenAction.applyTo(game.currentState);
    game.moveTo(next);
  };
  function hardBotMove(turn) {
    var available = game.currentState.emptyCells();
    var availableActions = available.map(function(pos) {
      var action = new botBehaviour(pos);
      var next = action.applyTo(game.currentState);
      action.miniMaxValue = miniMaxValue(next);
      return action
    });
    if(turn == 2) {
      availableActions.sort(botBehaviour.ASCENDING);
    }
    else {
      availableActions.sort(botBehaviour.DESCENDING);
    }
    var chosenAction = availableActions[0];
    var next = chosenAction.applyTo(game.currentState);
    game.moveTo(next);
  };
  this.plays = function(_game) {
    game = _game ;
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
    nextGameState.board[this.movePosition] = currentGameState.turn;
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
  this.currentState.board = [];
  for(let i = 0 ; i < CELL_COLS*CELL_ROWS ; i++) {
    this.currentState.board.push(0);
  }
  this.currentState.turn = 1 ;
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
      game.state.start('gameover');
    }
    else {
      if(this.currentState.turn == 1) {
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
  create: function() {
    var CELL_WIDTH, CELL_HEIGHT;
    CELL_WIDTH = CELL_HEIGHT = 107;
    CELL_COLS = CELL_ROWS = 3;
    limit  = (CELL_ROWS*CELL_COLS) -1 ;
    var bg = this.add.sprite(0, 0, 'arena');
    // bg.anchor.set(0.5);
    // bg.scale.setTo(3,3);
    bg.height = this.game.height;
    bg.width = this.game.width;
    var count = 0 ;
    win = 0 ;
    this.cells = this.game.add.group();
    this.player = 1;
    this.cellFilled = 0 ;
    this.cells.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < CELL_COLS; i++) {
      for (var j = 0; j < CELL_ROWS; j++) {
        var cell = this.cells.create(i * CELL_WIDTH, j * CELL_HEIGHT, 'cell');
        cell.frame = 0;
        cell.inputEnabled = true;
        cell.frameIndex = count++ ;
        // cell.events.onInputDown.add(this.addPlayerMarker, this);
        cell.events.onInputDown.add(this.clickHandler, this);
        this.game.physics.arcade.enable(cell);
      }
    }
    console.log(botLevel);
    myBot = new bot(botLevel);
    myGame = new Game(myBot);
    myBot.plays(myGame);
    myGame.start();
    // console.log(this.cells);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  update: function() {

  },
  clickListener: function() {
    this.game.state.start('gameover');
  },

  clickHandler: function(sprite, pointer) {
    var cell = this.cells.children;
    if(sprite.frame === 0) {
      // console.log("Hi");
      sprite.frame = 1;
      var next = new gameState(myGame.currentState);
      next.board[sprite.frameIndex]=1;
      sprite.frame = 1;
      // console.log(myGame);
      next.nextTurn();
      myGame.moveTo(next);
      for(let i = 0 ; i < CELL_COLS * CELL_ROWS ;i++) {
        cell[i].frame = myGame.currentState.board[i];
      }
      // console.log(myGame.currentState.board);
    }
  },

  // Try to implement a list of cells which are not filled and take randoms cell nos.
  //Will rediuce no. of calls.
  //TODO on Wed
  addPlayerMarker: function(sprite, pointer) {
    let cell = this.cells.children;
    if(sprite.frame === 0) {
      sprite.frame = this.player;
      this.player = this.player === 1 ? 2 : 1;
      this.checkMaze(cell);
      if(win !== 0) {
        return;
      }
      this.cellFilled++;
      let cellNo = Math.floor(Math.random() * (limit+1)) ;
      // console.log(limit,cellNo,cell);
      if(this.cellFilled < CELL_ROWS*CELL_COLS ) {
        while(cell[cellNo].frame !== 0) {
          cellNo = Math.floor(Math.random() * (limit+1)) ;
          // console.log(limit,cellNo,cell);
        }
        this.cellFilled++;
        cell[cellNo].frame = this.player;
      }
      else {
        game.state.start('gameover');
      }
      this.checkMaze();
      this.player = this.player === 1 ? 2 : 1;
    }
    //Checking Rows
    // console.log(this.cells.children[0]);
  },
  checkMaze : function() {
    let cell = this.cells.children;
    for (let i = 0, j = CELL_ROWS; i < CELL_COLS; i++) {
      if(cell[i].frame !== 0 && cell[i].frame === cell[i+j].frame && cell[i+j].frame === cell[i+(2*j)].frame) {
        win = cell[i].frame ;
      }
    }
    //Checking Columns
    for (let i = 0, j = 1; i < CELL_ROWS*CELL_COLS; i+=CELL_COLS) {
      if(cell[i].frame !== 0 && cell[i].frame === cell[i+j].frame && cell[i+j].frame === cell[i+(2*j)].frame) {
        win = cell[i].frame ;
      }
    }
    //Checking Leading Diagonals '\'
    if(cell[0].frame !== 0 && cell[0].frame === cell[4].frame && cell[4].frame === cell[8].frame) {
      win = cell[4].frame ;
    }
    //Checing other Diagonal '/'
    if(cell[2].frame !== 0 && cell[2].frame === cell[4].frame && cell[4].frame === cell[6].frame) {
      win = cell[4].frame ;
    }
    if(win!==0) {
      game.state.start('gameover');
    }
  }
};
