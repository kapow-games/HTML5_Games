class BotBehaviour {  // TODO : why is bot and bot behavior different ?
    constructor(pos) {
        this.movePosition = pos;
        this.miniMaxValue = 0 ;
    }

    applyTo(currentGameState) { // TODO : rename function to play and args to state
        var nextGameState = new gameState(currentGameState);  // TODO : @mayank , if doing new means its a class and not variables. Initialize as new GameState()
        nextGameState.board[this.movePosition] = (currentGameState.turn === 1 ? globalVariableInstance.get("playerMark") : ((globalVariableInstance.get("playerMark") === 1) ? 2 : 1));
        if(currentGameState.turn == 2) {
            nextGameState.oMovesCount++;
        }
        nextGameState.nextTurn();
        return nextGameState;
    }
    ascending(firstAction, secondAction) { //
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
    descending(firstAction, secondAction) { // TODO : is it just reverse of ascending ? can reuse the same function
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
