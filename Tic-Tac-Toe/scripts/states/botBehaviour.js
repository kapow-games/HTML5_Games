class botBehaviour {
    constructor(pos) {
        this.movePosition = pos;
        this.miniMaxValue = 0 ;
    }

    applyTo(currentGameState) {
        var nextGameState = new gameState(currentGameState);  // TODO : @mayank , if doing new means its a class and not variables. Initialize as new GameState()
        nextGameState.board[this.movePosition] = (currentGameState.turn === 1 ? globalVariableInstance.get("playerMark") : ((globalVariableInstance.get("playerMark") === 1) ? 2 : 1));
        if(currentGameState.turn == 2) {
            nextGameState.oMovesCount++;
        }
        nextGameState.nextTurn();
        return nextGameState;
    }
    ASCENDING(firstAction, secondAction) {
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
    DESCENDING(firstAction, secondAction) {
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
}
