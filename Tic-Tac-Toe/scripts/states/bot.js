class bot{
    constructor(difficultyLevel) {
        this.botLevel = difficultyLevel ; //0 : easy //1 : Medium //2: Hard // TODO @mayank: Take argument as botLevel , is there any logic of changing botLevel to difficultyLevel
        this.gameDetail = {} ;
    }
    //TODO : handle Game.score
    miniMaxValue(state) {
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
    }
    easyBotMove(turn) {
        var available = gameDetail.currentState.emptyCells();
        var randomCell = available[Math.floor(Math.random() * available.length)];
        // cell[randomCell].frame = turn;
        var action = new botBehaviour(randomCell);
        var next = action.applyTo(gameDetail.currentState);
        //Reflect in UI
        gameDetail.moveTo(next);
    }
    mediumBotMove(turn) {
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
    }
    hardBotMove(turn) {
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
    }
    plays(_gameDetail) {
        gameDetail = _gameDetail ;
    }
    notifyTurn(turn){
        switch(botLevel) {
            case 0 : easyBotMove(turn); break;
            case 1 : mediumBotMove(turn); break;
            case 2 : hardBotMove(turn); break;
        }
    }
}

