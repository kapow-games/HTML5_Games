var gameState = function(oldGameState) {
  this.turn = 0 ; // 0 : No One's Move // 1 : Player 1(x)'s Move // 2 : Player 2(o)'s Move'
  this.oMovesCount = 0 ;
  this.boardResult ; // 0 : Board Result Draw // 1 : Board Result Player 1(x) wins // 2 : Board Result Player 2(o) wins // undefined : game state not decided
  this.board = [] ; //board[i] = 0 : Empty //board[i] = 1 : 'X' //board[i] = 2 : 'O'
  if(typeof(oldGameState) !== "undefined") {
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
        gameLayoutVariables.winningMarkLine = i;
        this.boardResult = cell[i] ;
        return true ;
      }
    }
    //Checking Columns
    for (let i = 0, j = 1; i < CELL_ROWS*CELL_COLS; i+=CELL_COLS) {
      if(cell[i] !== 0 && cell[i] === cell[i+j] && cell[i+j] === cell[i+(2*j)]) {
        gameLayoutVariables.winningMarkLine = (i/CELL_COLS)+3;
        this.boardResult = cell[i] ;
        return true;
      }
    }
    //Checking Leading Diagonals '\'
    if(cell[0] !== 0 && cell[0] === cell[4] && cell[4] === cell[8]) {
      gameLayoutVariables.winningMarkLine = 6;
      this.boardResult = cell[4] ;
      return true;
    }
    //Checing other Diagonal '/'
    if(cell[2] !== 0 && cell[2] === cell[4] && cell[4] === cell[6]) {
      gameLayoutVariables.winningMarkLine = 7;
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
    nextGameState.board[this.movePosition] = (currentGameState.turn === 1 ? globalVariableInstance.get("playerMark") : ((globalVariableInstance.get("playerMark") === 1) ? 2 : 1));
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
    this.currentState.board[i] = globalVariableInstance.get("boardStatus").cells[i]!==undefined ? globalVariableInstance.get("boardStatus").cells[i] :0;
  }
  this.currentState.turn = 1 ;//playerMark === 1 ? 2 : 1 ;

  if(globalVariableInstance.get("playerMark") === 2 && globalVariableInstance.get("gameResume") === false) {
    var randomCell = Math.floor(Math.random() * CELL_ROWS*CELL_COLS);
    this.currentState.board[randomCell] = 1 ;
    gameLayoutVariables.initialMark = randomCell ;
  }

  this.gameStatus = -1 ;// To indicate game begining
  this.moveTo = function(_state) {
    this.currentState = _state ;
    if(_state.isTerminal()) {

      this.gameStatus = 3 // Indicating game Over
      // console.log(_state);
      if(_state.boardResult === 1) {
        globalVariableInstance.set("win", 1) ;
      }
      else if(_state.boardResult === 2) {
        globalVariableInstance.set("win", 2) ;
      }
      else {
        globalVariableInstance.set("win", 0) ;
      }
      if(globalVariableInstance.get("win") !== 0) {
        if(globalVariableInstance.get("win") === globalVariableInstance.get("playerMark")) {
          gameLayoutVariables.turnText.text = "  YOU WIN!";
          gameEndHandler(2);
        }
        else {
          gameLayoutVariables.turnText.text = "  YOU LOSE!";
          gameEndHandler(1);
        }
      }
      else {
        gameLayoutVariables.turnText.text = "GAME DRAW!";
        gameEndHandler(0);
        // gameInputHandler(0)
      }
      if(globalVariableInstance.get("win") !== 0) {
        switch(gameLayoutVariables.winningMarkLine) {
          case 0 : matchPosition = phaserGame.add.sprite(552, 633, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=90;break;
          case 1 : matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=90;break;
          case 2 : matchPosition = phaserGame.add.sprite(552, 1263, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=90;break;
          case 3 : matchPosition = phaserGame.add.sprite(222, 948, 'rectangle');matchPosition.anchor.setTo(0.5);break;
          case 4 : matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);break;
          case 5 : matchPosition = phaserGame.add.sprite(882, 948, 'rectangle');matchPosition.anchor.setTo(0.5);break;
          case 6 : matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=-45;break;
          case 7 : matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=45;break;
        }
      }
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