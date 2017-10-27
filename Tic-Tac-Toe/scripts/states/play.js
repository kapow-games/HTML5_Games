// 'use strict';
var CELL_COLS, CELL_ROWS;
CELL_COLS = 9 ;
CELL_ROWS = 9;
var gameLayoutVariables = {
  initialMark : null,
  myGame  : null,
  winningMarkLine : null,
  turnText  : null,
  resign  : null,
  backgroundImage : null,
  backButton  : null,
  turnTextBackground : null,
  help  : null,
  clickBlocked  : null,
  playerProfilePic : null,
  opponentProfilePic : null,
  resultBoard : null
};
var gameEndHandler = function(value) {
  console.log("Game End Being Handled.");
  gameLayoutVariables.backgroundImage.inputEnabled = true;
  gameLayoutVariables.backgroundImage.input.priorityID = 2;
  gameLayoutVariables.backButton.input.priorityID = 3;
  gameLayoutVariables.resultBoard.frame = value === 1 ? 2 : value === 0 ? 1 : 0;
  gameLayoutVariables.turnTextBackground.destroy();
  gameLayoutVariables.resign.destroy();
  gameLayoutVariables.help.destroy();
  gameLayoutVariables.turnText.text = (value===1)?"YOU LOST!":(value===2 ? "YOU WON!" : "GAME DRAW!");
  shareText = (value===1 || value === 0)?"I just played a game of Tic Tac Toe on Kapow. Join Kapow now to play with me!":"I just won a game of Tic Tac Toe on Kapow. Join Kapow now to beat me!";
  var shareBackground = phaserGame.add.sprite(72, 1584, 'shareBackground');
  var shareLoad = phaserGame.add.sprite(phaserGame.world.centerX, phaserGame.world.centerY, 'loaderSpinner');
  shareLoad.anchor.setTo(0.5);
  var shareLoadTween = phaserGame.add.tween(shareLoad).to({angle: 359}, 400, null, true, 0, Infinity);
  shareLoad.kill();
  shareLoadTween.start();

  var socialShareModal = new socialShare(value === 1 ? "loss" : value === 0 ? "draw" : "won");
  var shareFbButton = socialShareModal.shareButton(294, 1614, shareLoad, 'facebook', 'fbShare');
  shareFbButton.input.priorityID = 3 ;
  var shareTwitterButton = socialShareModal.shareButton(408, 1614,  shareLoad, 'twitter', 'twitterShare');
  shareTwitterButton.input.priorityID = 3 ;
  var shareOtherButton = socialShareModal.shareButton(522, 1614,  shareLoad, 'twitter', 'twitterShare');
  shareOtherButton.input.priorityID = 3 ;


  var rematchButton = phaserGame.add.button(657, 1584, 'rematch',rematchButtonHandler, 0, 0, 1, 0);
  rematchButton.input.priorityID = 3 ;

  if(globalVariableInstance.get("gameOver") === false) {
    kapow.gameStore.get('stats',function(statsValue) {
      console.log("gameStore fetch successfull.");
      if(statsValue) {
        console.log("Value fetched from gameStore was : ",statsValue);
        let valueJSON = JSON.parse(statsValue);
        console.log(valueJSON);
        soloStats = valueJSON.soloStats;
        randomStats = valueJSON.randomStats;
        friendsStats = valueJSON.friendsStats;
        if(globalVariableInstance.get("gameType") === "solo") {
          if(value === 1) {
            soloStats.lost += 1;
          }
          else if(value === 2) {
            soloStats.won += 1;
          }
          else {
            soloStats.draw += 1;
          }
        }
        else if(globalVariableInstance.get("gameType") === "friend") {
          if(randomRoom === false){
            if(value === 1) {
              friendsStats.lost += 1;
            }
            else if(value === 2) {
              friendsStats.won += 1;
            }
            else {
              friendsStats.draw += 1;
            }
          }
          else {
            if(value === 1) {
              randomStats.lost += 1;
            }
            else if(value === 2) {
              randomStats.won += 1;
            }
            else {
              randomStats.draw += 1;
            }
          }
        }
        newStats = {"soloStats" : soloStats, "friendsStats" : friendsStats, "randomStats" : randomStats};
        kapow.gameStore.set("stats", JSON.stringify(newStats), function () {
          console.log("Storing following stats data was successful : ",newStats);
        }, function(error) {
          console.log("Storing room data Failed : ",error);
        });
      }
      else {
        console.log('stats Variables Not Set');
        newStats = {
          "soloStats" : {
            "won"   : 0,
            "lost"  : 0,
            "draw"  : 0 },
           "friendsStats" : {
             "won"   : 0,
             "lost"  : 0,
             "draw"  : 0 },
           "randomStats" : {
             "won"   : 0,
             "lost"  : 0,
             "draw"  : 0 },
         };
        kapow.gameStore.set("stats", JSON.stringify(newStats), function () {
          console.log("Storing following fresh stats data was successful : ",newStats);
        }, function(error) {
          console.log("Storing room data Failed : ",error);
        });
      }
    }, function(error) {
      console.log("gameStore fetch Failed: ",error);
    });
  }
  if(globalVariableInstance.get("gameLocked") === false)// To ensure that game doesn't close multiple times in Kapow
  {
    if(globalVariableInstance.get("gameType") === "solo") {
      kapow.endSoloGame(function() {
        if(value === 2) {
          kapow.rpc.invoke({
            	"functionName": 'soloPostScore',
                "parameters": {'points': 5, 'playerID':globalVariableInstance.get("playerData").id},
            	"invokeLazily": true
            },function (successResponse) {
              console.log("successResponse  for lazy invocation",successResponse);
            },function(rpcErrorResponse) {
              console.log("rpcErrorResponse  for lazy invocation",rpcErrorResponse);
            }
          );
        }
        globalVariableInstance.set("boardStatus", {cells : new Array(9)});
        globalVariableInstance.set("botLevel", -1) ; //TODO : Remove This. Redundant
        globalVariableInstance.set("win", 0) ;
        globalVariableInstance.set("gameOver", false);
        globalVariableInstance.set("room", null);
        globalVariableInstance.set("playerMark", 0);
        globalVariableInstance.set("gameResume", false) ;
        console.log("Game Succesfully Closed.");
      }, function(error) {
        console.log("endSoloGame Failed : ",error);
      });
    }
  }
};
var drawWinningLine = function() {
  var gameFinalLayout = globalVariableInstance.get("boardStatus").cells ;
  if (gameFinalLayout[0] !== null &&  gameFinalLayout[0] !== undefined && gameFinalLayout[0] === gameFinalLayout[1] && gameFinalLayout[0] === gameFinalLayout[2]) {
    matchPosition = phaserGame.add.sprite(222, 948, 'rectangle');matchPosition.anchor.setTo(0.5);
  }
  else if (gameFinalLayout[3] !== null && gameFinalLayout[3] !== undefined && gameFinalLayout[3] === gameFinalLayout[4] && gameFinalLayout[3] === gameFinalLayout[5]) {
    matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);
  }
  else if (gameFinalLayout[6] !== null && gameFinalLayout[6] !== undefined && gameFinalLayout[6] === gameFinalLayout[7] && gameFinalLayout[6] === gameFinalLayout[8]) {
    matchPosition = phaserGame.add.sprite(882, 948, 'rectangle');matchPosition.anchor.setTo(0.5);
  }
  else if (gameFinalLayout[0] !== null && gameFinalLayout[0] !== undefined && gameFinalLayout[0] === gameFinalLayout[3] && gameFinalLayout[0] === gameFinalLayout[6]) {
    matchPosition = phaserGame.add.sprite(552, 633, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=90;
  }
  else if (gameFinalLayout[1] !== null && gameFinalLayout[1] !== undefined && gameFinalLayout[1] === gameFinalLayout[4] && gameFinalLayout[1] === gameFinalLayout[7]) {
    matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=90;
  }
  else if (gameFinalLayout[2] !== null && gameFinalLayout[2] !== undefined && gameFinalLayout[2] === gameFinalLayout[5] && gameFinalLayout[2] === gameFinalLayout[8]) {
    matchPosition = phaserGame.add.sprite(552, 1263, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=90;
  }
  else if (gameFinalLayout[0] !== null && gameFinalLayout[0] !== undefined && gameFinalLayout[0] === gameFinalLayout[4] && gameFinalLayout[0] === gameFinalLayout[8]) { // Diagonal
    matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=-45;
  }
  else if (gameFinalLayout[2] !== null && gameFinalLayout[2] !== undefined && gameFinalLayout[2] === gameFinalLayout[4] && gameFinalLayout[2] === gameFinalLayout[6]) {
    matchPosition = phaserGame.add.sprite(552, 948, 'rectangle');matchPosition.anchor.setTo(0.5);matchPosition.angle=45;
  }
  else {
    console.log("CLient doesn't confirm result.")
  }
};
var rematchButtonHandler  = function() {
  console.log('rematchButtonHandler Clicked');
  globalVariableInstance.set("boardStatus", {cells : new Array(9)});
  globalVariableInstance.set("win", 0) ;
  globalVariableInstance.set("gameOver", false) ;
  globalVariableInstance.set("room", null);
  globalVariableInstance.set("playerMark", 0);
  globalVariableInstance.set("gameResume", false) ;
  globalVariableInstance.set("gameLocked", false) ;
  if(globalVariableInstance.get("gameType") === "solo") {
    globalVariableInstance.set("botLevel", -1) ; //TODO : Remove This. Redundant
    gameLayoutLoaded = false;
    phaserGame.state.start('select');
  }
  else if(globalVariableInstance.get("gameType") === "friend") {
    kapow.rematch(function(roomObj) {
        globalVariableInstance.set("room", roomObj);
        globalVariableInstance.set("playerMark", 1) ;
        globalVariableInstance.set("opponentMark", 2);
        gameLayoutLoaded = false;
        parseRoomAndRedirectToGame();
        console.log("Rematch Room Created");
      },
      function(error) {
        console.log("Rematch Room creation FAILED.");
      });
  }
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

var play = function() {};
play.prototype = {
  preload:  function() {
    globalVariableInstance.set("screenState", 1) ;
    if(globalVariableInstance.get("gameType") === 'friend') {
      if(globalVariableInstance.get("opponentData") !== undefined) {
        this.load.image('opponentPic',globalVariableInstance.get("opponentData").profileImage);
      }
      else {
          console.log("opponentData was not set.");
      }
    }
    console.log(phaserGame.cache.checkImageKey('opponentPic'),this.load);
    gameLayoutVariables.clickBlocked = false;
  },
  create: function() {
    globalVariableInstance.set("screenState", 1) ;

    console.log("Loading Game Layout.");
    var CELL_WIDTH, CELL_HEIGHT, CELL_WIDTH_PAD, CELL_HEIGHT_PAD, CELL_RELATIVE_TOP, CELL_RELATIVE_LEFT;
    CELL_WIDTH = CELL_HEIGHT = 264;
    CELL_COLS = CELL_ROWS = 3;
    CELL_WIDTH_PAD = CELL_HEIGHT_PAD = 54;
    CELL_RELATIVE_TOP = 501;
    CELL_RELATIVE_LEFT = 90;

    gameLayoutVariables.backgroundImage = phaserGame.add.sprite(0, 0, 'arena');

    var gameBoard = this.add.sprite(57, 477, 'board');
    gameLayoutVariables.resultBoard = phaserGame.add.sprite(315, 240, 'winBackground');
    gameLayoutVariables.resultBoard.frame = 0;
    gameLayoutVariables.turnTextBackground = this.add.sprite(315, 240, 'turnTextBackground');
    gameLayoutVariables.resign = this.add.button(390, 1584, 'resign', this.resignEvent, this, 0, 0, 1, 0);
    gameLayoutVariables.help = this.add.button(741, 1584, 'helpEnd', this.helpButtonHandler, this, 0, 0, 1, 0);

    this.playerProfilePicBackground = this.add.image(366,72,'circle');
    this.playerProfilePicBackground.scale.set(120/this.playerProfilePicBackground.width,120/this.playerProfilePicBackground.height);


    gameLayoutVariables.playerProfilePic = this.add.image(372,78,'profilePic');
    gameLayoutVariables.playerProfilePic.scale.set(108/gameLayoutVariables.playerProfilePic.width,108/gameLayoutVariables.playerProfilePic.height);

    mask = phaserGame.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(426,132,108);
    gameLayoutVariables.playerProfilePic.mask = mask;

    this.playerProfilePicMarkBackground = this.add.image(438,144,'circle');
    this.playerProfilePicMarkBackground.scale.set(48/this.playerProfilePicMarkBackground.width,48/this.playerProfilePicMarkBackground.height);

    this.playerProfilePicMark = this.add.sprite(438,144,'cell');
    console.log("playerMark at time of showing on screen",globalVariableInstance.get("playerMark"));
    this.playerProfilePicMark.frame = globalVariableInstance.get("playerMark") ;
    this.playerProfilePicMark.scale.set(48/this.playerProfilePicMark.width,48/this.playerProfilePicMark.height);


    this.opponentProfilePicBackground = this.add.image(594,72,'circle');
    this.opponentProfilePicBackground.scale.set(120/this.opponentProfilePicBackground.width,120/this.opponentProfilePicBackground.height);

    gameLayoutVariables.opponentProfilePic = this.add.image(600, 78, globalVariableInstance.get("gameType") === 'solo' ? 'botPic' : "opponentPic");
    gameLayoutVariables.opponentProfilePic.scale.set(108/gameLayoutVariables.opponentProfilePic.width);
    // console.log("Pointer");
    mask = phaserGame.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(654,132,108);
    gameLayoutVariables.opponentProfilePic.mask = mask;

    this.opponentProfilePicMarkBackground = this.add.image(594,144,'circle');
    this.opponentProfilePicMarkBackground.scale.set(48/this.opponentProfilePicMarkBackground.width,48/this.opponentProfilePicMarkBackground.height);

    this.opponentProfilePicMark = this.add.sprite(594,144,'cell');
    this.opponentProfilePicMark.frame = ( (globalVariableInstance.get("playerMark") === 2) ? 1 : 2) ;
    this.opponentProfilePicMark.scale.set(48/this.opponentProfilePicMark.width,48/this.opponentProfilePicMark.height);

    gameLayoutVariables.turnText = createText(366, 276, "");//phaserGame.add.text(366, 276, "");
    gameLayoutVariables.turnText.anchor.setTo(0.5,0);
    gameLayoutVariables.turnText.position.x = phaserGame.world.centerX;
    gameLayoutVariables.turnText.font = 'nunito-regular';
    gameLayoutVariables.turnText.fontSize = "60px";
    gameLayoutVariables.turnText.fontWeight = 800;
    gameLayoutVariables.turnText.wordWrapWidth = 355;
    gameLayoutVariables.turnText.fill = "#fefefe";
    gameLayoutVariables.turnText.align = "center";
    gameLayoutVariables.turnText.backgroundColor = "#5684fb";
    gameLayoutVariables.turnText.text = (globalVariableInstance.get("gameOver") === true) ? globalVariableInstance.get("win") === globalVariableInstance.get("playerMark") ? "YOU WIN!" : "YOU LOSE!" : globalVariableInstance.get("gameType") ===  "solo" ? globalVariableInstance.get("playerMark") === 1 ? "YOUR TURN" : "BOT'S TURN" : globalVariableInstance.get("turnOfPlayer") === globalVariableInstance.get("playerData") ? "YOUR TURN" : "WAITING";

    this.vs = createText(511, 105, "VS");
    this.vs.font = 'nunito-regular';
    this.vs.fontSize = "42px";
    this.vs.fontWeight = 800;
    this.vs.wordWrapWidth = 58;
    this.vs.fill = "#fefefe";
    this.vs.align = "center";
    this.vs.backgroundColor = "#5684fb";

    gameLayoutVariables.backButton = this.add.button(48, 96, 'back', this.backButtonHandler, this);
    gameLayoutVariables.backButton.anchor.setTo(0, 0);

    this.musicButton = this.add.button(960, 96, 'music', this.musicButtonHandler, this);
    this.musicButton.anchor.setTo(0, 0);

    var count = 0 ;
    globalVariableInstance.set("win", 0) ;
    this.cells = this.add.group();
    this.player = 1;
    this.cellFilled = 0 ;
    this.cells.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < CELL_COLS; i++) {
      for (var j = 0; j < CELL_ROWS; j++) {
        var cell = this.cells.create(i * (CELL_WIDTH+CELL_WIDTH_PAD) + CELL_RELATIVE_LEFT, j * (CELL_HEIGHT+CELL_HEIGHT_PAD) + CELL_RELATIVE_TOP, 'cell');
        if(globalVariableInstance.get("gameResume") === true){
          cell.frame = globalVariableInstance.get("boardStatus").cells[count] ;
          if(globalVariableInstance.get("boardStatus").cells[count] === 0 || globalVariableInstance.get("boardStatus").cells[count] === undefined || globalVariableInstance.get("boardStatus").cells[count] === null){
            cell.frame = 0;
            cell.inputEnabled = globalVariableInstance.get("gameOver") === true ? false : true;
            cell.events.onInputDown.add(globalVariableInstance.get("gameType") === 'solo' ? this.clickHandlerSolo: this.clickHandlerMulti, this);
          }
          else {
            cell.frame = globalVariableInstance.get("boardStatus").cells[count];
            cell.inputEnabled = false;
          }
        }
        else {
          cell.frame = 0;
          cell.inputEnabled = true;
          cell.events.onInputDown.add(globalVariableInstance.get("gameType") === 'solo' ? this.clickHandlerSolo: this.clickHandlerMulti , this);
        }
        cell.frameIndex = count++;
        this.physics.arcade.enable(cell);
      }
    }
    if(globalVariableInstance.get("gameType") === 'solo') {
      myBot = new bot(1);
      gameLayoutVariables.myGame = new Game(myBot);
      if(globalVariableInstance.get("playerMark") === 2 && globalVariableInstance.get("gameResume") === false) {
        this.cells.children[gameLayoutVariables.initialMark].frame = 1;
        this.cells.children[gameLayoutVariables.initialMark].inputEnabled = false ;
      }
      if(globalVariableInstance.get("gameOver") === false) {
        saveGameData(false);// To store the initial state of the Game. Even if the user or bot haven't made any move.
      }
      myBot.plays(gameLayoutVariables.myGame);
      gameLayoutVariables.myGame.start();
      if(globalVariableInstance.get("gameOver") === true && globalVariableInstance.get("win") === 0) {
        gameEndHandler(1);
      }
    }
    else if(globalVariableInstance.get("gameType") === 'friend') {
      if(globalVariableInstance.get("opponentData") !== undefined && globalVariableInstance.get("opponentData").affiliation === "accepted") {
        console.log("Opponent Accepted.");
      }
      else if(globalVariableInstance.get("opponentData").affiliation === undefined) {
        console.log("No Opponent Found.");
      }
      else if(globalVariableInstance.get("opponentData").affiliation === "invited") {
        console.log("Friend hasn't responded to invitation");
      }
      else if(globalVariableInstance.get("opponentData").affiliation === "rejected") {
        console.log("Friend rejected the invitation");
      }
      else if(globalVariableInstance.get("opponentData").affiliation === "left") {
        console.log("Friend left the room.");
      }
      else {
        console.log("Opponent not on Kapow. Waiting");
      }

      if(globalVariableInstance.get("gameOver") === true) {
        if(globalVariableInstance.get("turnOfPlayer") === 0) {
          gameEndHandler(0);
        }
        else if(globalVariableInstance.get("turnOfPlayer").id === globalVariableInstance.get("opponentData").id) {
          drawWinningLine();
          gameEndHandler(2);
        }
        else if(globalVariableInstance.get("turnOfPlayer").id === globalVariableInstance.get("playerData").id) {
          drawWinningLine();
          gameEndHandler(1);
        }
      }

    }
    gameLayoutLoaded = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },
  update: function() {
  },

  clickHandlerSolo: function(sprite, pointer) {
    var cell = this.cells.children;
    if(sprite.frame === 0) {
      gameLayoutVariables.backgroundImage.inputEnabled = true;
      gameLayoutVariables.backgroundImage.input.priorityID = 2;
      gameLayoutVariables.backButton.input.priorityID = 2;
      this.musicButton.input.priorityID = 2;
      gameLayoutVariables.resign.input.priorityID = 2;

      sprite.frame = globalVariableInstance.get("playerMark");
      console.log("Player's Sprite Set");
      gameLayoutVariables.turnText.text = "BOT'S TURN";
      gameLayoutVariables.opponentProfilePic.alpha = 1;
      gameLayoutVariables.playerProfilePic.alpha = 0.3;
      var that = this;
      setTimeout(function() {
        that.nextMove(sprite, pointer, cell);
      }, 1000);
    }
    else {
      console.log('Cell already occupied.');
    }

  },
  clickHandlerMulti:  function(sprite, pointer) {
    console.log(globalVariableInstance.get("turnOfPlayer"),globalVariableInstance.get("playerData"),sprite.frame);
    if (globalVariableInstance.get("turnOfPlayer") !== undefined && globalVariableInstance.get("turnOfPlayer").id === globalVariableInstance.get("playerData").id && sprite.frame === 0) {
      gameLayoutVariables.backgroundImage.inputEnabled = true;
      gameLayoutVariables.backgroundImage.input.priorityID = 2;
      gameLayoutVariables.backButton.input.priorityID = 2;
      this.musicButton.input.priorityID = 2;
      gameLayoutVariables.resign.input.priorityID = 2;
      console.log("Player's Sprite Set");
      gameLayoutVariables.turnText.text = globalVariableInstance.get("gameType") === "solo" ? "BOT'S TURN" : "WAITING";
      gameLayoutVariables.opponentProfilePic.alpha = 1;
      gameLayoutVariables.playerProfilePic.alpha = 0.3;
      globalVariableInstance.set("turnOfPlayer", undefined);
      let tempCells = globalVariableInstance.get("boardStatus").cells;
      tempCells[sprite.frameIndex] = globalVariableInstance.get("playerMark");
      globalVariableInstance.set("boardStatus",{cells : tempCells});
      sprite.frame = globalVariableInstance.get("playerMark");
      sprite.alpha = 0.3;
      var that = this;
      var sentData = {
              board : globalVariableInstance.get("boardStatus").cells,
              playerTurn : globalVariableInstance.get("playerData").id,
              opponentTurn : globalVariableInstance.get("opponentData").id,
              roomID : globalVariableInstance.get("room").roomId
          };
      console.log("Client - invokeRPC makeMove",sentData);
      kapow.invokeRPC("makeMove", sentData,
          function(obj) {
            console.log("makeMove - success : obj: \n",obj);
            sprite.frame = globalVariableInstance.get("playerMark");
            sprite.alpha = 1;
            if(obj.result === "lost") {
              gameLayoutVariables.turnText.text = " YOU WON!";
              drawWinningLine();
              gameEndHandler(2);
              console.log("You won");
            }
            else if(obj.result === "draw") {
              gameLayoutVariables.turnText.text = " GAME DRAW!";
              console.log("Draw");
              gameEndHandler(0);
            }
            else {
              gameLayoutVariables.backgroundImage.input.priorityID = 1;
              gameLayoutVariables.backgroundImage.inputEnabled = false;
              gameLayoutVariables.backButton.input.priorityID = 1;
              that.musicButton.input.priorityID = 1;
              gameLayoutVariables.resign.input.priorityID = 1;
            }
          },
          function(error) {
            sprite.frame = 0 ;
            let tempCells = globalVariableInstance.get("boardStatus").cells;
            tempCells[sprite.frameIndex] = 0 ;
            globalVariableInstance.set("boardStatus", {cells : tempCells});
            globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData"));
            gameLayoutVariables.backgroundImage.input.priorityID = 1;
            gameLayoutVariables.backgroundImage.inputEnabled = false;
            gameLayoutVariables.backButton.input.priorityID = 1;
            this.musicButton.input.priorityID = 1;
            gameLayoutVariables.resign.input.priorityID = 1;
            gameLayoutVariables.turnText.text = "YOUR TURN";
            gameLayoutVariables.opponentProfilePic.alpha = 0.3;
            gameLayoutVariables.playerProfilePic.alpha = 1;
            console.log("makeMove - failure",error);
          }
      );
    }
  },

  nextMove: function(sprite, pointer, cell) {
    var next = new gameState(gameLayoutVariables.myGame.currentState);
    console.log("Click Acknowledged");
    next.board[sprite.frameIndex]=globalVariableInstance.get("playerMark");
    sprite.frame = globalVariableInstance.get("playerMark");
    console.log("Player's move logged");
    next.nextTurn();
    gameLayoutVariables.myGame.moveTo(next);
    for(let i = 0 ; i < CELL_COLS * CELL_ROWS ;i++) {
      cell[i].frame = gameLayoutVariables.myGame.currentState.board[i];
    }
    if(globalVariableInstance.get("win") === 0 && gameLayoutVariables.myGame.gameStatus !== 3) {
      saveGameData(false);
      gameLayoutVariables.turnText.text = "YOUR TURN";
      gameLayoutVariables.opponentProfilePic.alpha = 0.3;
      gameLayoutVariables.playerProfilePic.alpha = 1;
      gameLayoutVariables.backgroundImage.input.priorityID = 1;
      gameLayoutVariables.backgroundImage.inputEnabled = false;
      gameLayoutVariables.backButton.input.priorityID = 1;
      this.musicButton.input.priorityID = 1;
      gameLayoutVariables.resign.input.priorityID = 1;
    }
    else {
      saveGameData(true);
    }
  },
  resignEvent : function() {
    this.darkOverlay = phaserGame.add.button(0, 0, 'darkOverlay', this.cancelResign, this);
    this.darkOverlay.inputEnabled = true ;
    this.darkOverlay.input.priorityID = 2 ;

    this.resignModal = phaserGame.add.sprite(72, 540, 'resignModal');
    this.resignModal.inputEnabled = true ;
    this.resignModal.input.priorityID = 3 ;

    this.cancelButton = phaserGame.add.button(291, 1191, 'cancel', this.cancelResign, this);
    this.cancelButton.inputEnabled = true ;
    this.cancelButton.input.priorityID = 4 ;

    this.yesResignButton = phaserGame.add.button(522, 1191, 'yesResign', this.quitGame, this);
    this.yesResignButton.inputEnabled = true ;
    this.yesResignButton.input.priorityID = 4 ;


  },
  cancelResign  : function() {
    this.yesResignButton.destroy();
    this.cancelButton.destroy();
    this.resignModal.destroy();
    this.darkOverlay.destroy();
  },
  quitGame  : function() {
    globalVariableInstance.set("win", globalVariableInstance.get("playerMark") === 1 ? 2 : 1) ;
    if(globalVariableInstance.get("gameType") === "solo")
    {
      saveGameData(true);
      gameLayoutVariables.backgroundImage.inputEnabled = true;
      gameLayoutVariables.backgroundImage.input.priorityID = 1 ;
      this.yesResignButton.destroy();
      this.cancelButton.destroy();
      this.resignModal.destroy();
      this.darkOverlay.destroy();
      tempCells = phaserGame.state.states.play.cells.children;
      gameLayoutVariables.turnText.text = " YOU LOSE!";
      gameEndHandler(1);
    }
    else if(globalVariableInstance.get("gameType") === "friend") {
      var that = this;
      kapow.invokeRPC("resignationRequest", {
              board : globalVariableInstance.get("boardStatus").cells,
              playerTurn : globalVariableInstance.get("playerData").id,
              opponentTurn : globalVariableInstance.get("opponentData").id,
              roomID : globalVariableInstance.get("room").roomId
          },
          function(obj) {
            console.log("resignation - success : obj: \n",obj);
            gameLayoutVariables.backgroundImage.inputEnabled = true;
            gameLayoutVariables.backgroundImage.input.priorityID = 1 ;
            that.yesResignButton.destroy();
            that.cancelButton.destroy();
            that.resignModal.destroy();
            that.darkOverlay.destroy();
            gameLayoutVariables.turnText.text = " YOU LOSE!";
            console.log("Client resigned, hence lost");
            gameEndHandler(1);
          },
          function(error) {
              console.log("resignation - Failure due to following error : ",error);
              that.yesResignButton.destroy();
              that.cancelButton.destroy();
              that.resignModal.destroy();
              that.darkOverlay.destroy();
          }
      );
    }

  },
  musicButtonHandler  : function() {
    this.musicButton = (this.musicButton.frame + 1)%2;
  },
  backButtonHandler :function() {
    console.log("WebView BACK presed.");
    kapow.unloadRoom(function(){console.log('Room Succesfully Unloaded');},function(){console.log('Room Unloading Failed');});
    globalVariableInstance.set("gameResume", false);
    globalVariableInstance.set("room", null);
    globalVariableInstance.set("playerMark", 0);
    globalVariableInstance.set("gameType", null);
    globalVariableInstance.set("botLevel", -1);
    globalVariableInstance.set("boardStatus", { cells : new Array(9)});
    globalVariableInstance.set("opponentData", undefined);
    globalVariableInstance.set("turnOfPlayer", undefined);
    globalVariableInstance.set("gameOver", false);
    globalVariableInstance.set("win", 0);
    gameLayoutLoaded = false;
    phaserGame.state.start('menu');
  }
};
