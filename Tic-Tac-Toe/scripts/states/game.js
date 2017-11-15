class Game {
    constructor(bot) {
        this.bot = bot ;
        this.currentState = new gameState(); // TODO : @mayank , if doing new means its a class and not variables. Initialize as new GameState()
        this.currentState.board = new Array(9);
        for(let i = 0 ; i < CELL_COLS*CELL_ROWS ; i++) {
            this.currentState.board[i] = globalVariableInstance.get("boardStatus").cells[i]!==undefined ? globalVariableInstance.get("boardStatus").cells[i] :0;
        }
        this.currentState.turn = 1 ;//playerMark === 1 ? 2 : 1 ;
        if(globalVariableInstance.get("playerMark") === 2 && globalVariableInstance.get("gameResume") === false) {
            var randomCell = Math.floor(Math.random() * CELL_ROWS*CELL_COLS);
            this.currentState.board[randomCell] = 1 ;
            gameLayoutVariables.initialMark = randomCell ;
        }
        this.gameStatus = -1 ;// To indicate game begining
    }
    moveTo(_state) {
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
    }
    start() {
        if(this.gameStatus === -1) {
          this.moveTo(this.currentState);
          this.gameStatus = 0;
        }
    }
    score(_state) {
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
    }
}