import BotBehaviour from "./BotBehaviour"; // TODO : @mayank use strict

export default class Bot {
    constructor(botLevel) {
        this.botLevel = botLevel;
        /*
            0 : Easy
            1 : Medium
            2: Hard
        */
        this.gameDetail = {};
    }

    //TODO : handle Game.score
    miniMaxValue(gameObj, state) { // TODO: @mayank: Rename to getMiniMaxValue
        if (state.isTerminal()) {
            return gameObj.score(state);
        }
        var stateScore = state.turn === 1 ? -1000 : 1000;

        var availablePositions = state.emptyCells();
        var availableNextStates = availablePositions.map(function (pos) {
            var action = new BotBehaviour(pos);
            var nextState = action.applyTo(state); // TODO : nextState var is redundant
            return nextState;
        });
        // console.log(availableNextStates);
        availableNextStates.forEach(function (nextState) {
            var nextScore = miniMaxValue(gameObj, nextState);
            if (state.turn === 1) { // TODO :  can do (state.turn === 1 && nextScore > stateScore) {}
                if (nextScore > stateScore) {
                    stateScore = nextScore;
                }
            }
            else {
                if (nextScore < stateScore) {
                    stateScore = nextScore;
                }
            }
        });
        return stateScore;
    }

    easyBotMove(turn) {
        var available = this.gameDetail.currentState.emptyCells();
        var randomCell = available[Math.floor(Math.random() * available.length)];
        var action = new botBehaviour(randomCell);
        var next = action.applyTo(this.gameDetail.currentState);
        //Reflect in UI
        this.gameDetail.moveTo(next);
    }// TODO : can be made private

    mediumBotMove(turn) {// TODO : rename turn to something else
        this.sortPossibleBotMoves(turn);
        var chosenAction;
        if (Math.random() * 100 <= 80) {
            chosenAction = availableActions[0];
        }
        else {
            if (availableActions.length >= 2) {
                chosenAction = availableActions[1];
            }
            else {
                chosenAction = availableActions[0];
            }
        }
        var next = chosenAction.applyTo(this.gameDetail.currentState);
        this.gameDetail.moveTo(next);
    }

    hardBotMove(turn) {
        this.sortPossibleBotMoves();
        var chosenAction = availableActions[0];
        var next = chosenAction.applyTo(this.gameDetail.currentState);
        this.gameDetail.moveTo(next);
    }

    plays(gameDetail) { // TODO : @mayank : plays ? what does the function do ?
        this.gameDetail = gameDetail;
    }

    notifyTurn(turn) { // TODO : @mayank: it plays the nextMove , can be renamed accordingly
        switch (botLevel) {
            case 0 :
                easyBotMove(turn); // TODO : use this.easyBotMove
                break;
            case 1 :
                mediumBotMove(turn);
                break;
            case 2 :
                hardBotMove(turn);
                break;
            default:
                console.log("Unexpected Value in Bot.notifyTurn :", turn);
        }
    }

    sortPossibleBotMoves(turn) {
        var available = this.gameDetail.currentState.emptyCells(); // TODO : redundant var
        var availableActions = available.map(function (pos) {
            var action = new BotBehaviour(pos);
            var next = action.applyTo(this.gameDetail.currentState);
            action.miniMaxValue = miniMaxValue(next);
            return action;
        });
        if (turn === 2) {// TODO : @mayank :
            availableActions.sort(botBehaviour.ascending);
        }
        else {
            availableActions.sort(botBehaviour.descending);
        }
    }
}

