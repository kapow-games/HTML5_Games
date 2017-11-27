"use strict";

import BotBehaviour from "./BotBehaviour";

export default class Bot {
    constructor() {
        this.gameDetail = {};
    }

    //TODO : handle Game.score
    getMiniMaxValue(ticTacToeGame, state) {
        if (state.isTerminal()) {
            return ticTacToeGame.score(state);
        }
        var stateScore = state.turnOfPlayer ? -1000 : 1000; // TODO : let or var :P

        let availablePositions = state.emptyCells();
        let availableNextStates = availablePositions.map(function (pos) {
            let action = new BotBehaviour(pos);
            return action.plays(state);
        });
        // console.log(availableNextStates);
        availableNextStates.forEach(function (nextState) {
            let nextScore = this.getMiniMaxValue(ticTacToeGame, nextState);
            if (state.turnOfPlayer === true && nextScore > stateScore) { // TODO :  can do (state.turn === 1 && nextScore > stateScore) {}
                stateScore = nextScore;
            }
            else if (state.turnOfPlayer === false && nextScore < stateScore) {
                stateScore = nextScore;
            }
        }.bind(this));
        return stateScore;
    }

    botMove(turnOfPlayer) { // TODO : rename to doBotMove
        let availableActions = this.sortPossibleBotMoves(turnOfPlayer);
        let chosenAction;
        // if (Math.random() * 100 <= 80) {
        //     chosenAction = availableActions[0];
        // }
        // else {
        // if (availableActions.length >= 2) {
        //     chosenAction = availableActions[1];
        // }
        // else {
        //     chosenAction = availableActions[0];
        // }
        // }
        chosenAction = availableActions[0];
        let next = chosenAction.plays(this.gameDetail.currentState);
        this.gameDetail.moveTo(next);
    }

    gameAssigned(gameDetail) { // TODO : @mayank : plays ? what does the function do ?
        //Renamed to gameAssigned.
        //The 'Bot' should be aware of the 'Game' object. This function stores that.
        this.gameDetail = gameDetail;
    }

    notifyTurn(turnOfPlayer) { // TODO : @mayank: it plays the botMove , can be renamed accordingly
        this.botMove(turnOfPlayer);
    }

    sortPossibleBotMoves(turnOfPlayer) {
        let available = this.gameDetail.currentState.emptyCells();
        let availableActions = available.map(function (pos) {
            let action = new BotBehaviour(pos);
            let next = action.plays(this.gameDetail.currentState);
            action.miniMaxValue = this.getMiniMaxValue(this.gameDetail, next);
            return action;
        }.bind(this));
        if (turnOfPlayer === false) {
            availableActions.sort(this._ascending);
        }
        else {
            availableActions.sort(this._descending);
        }
        return availableActions;
    }

    _ascending(firstAction, secondAction) {
        if (firstAction.miniMaxValue < secondAction.miniMaxValue) {
            return -1;
        }
        else if (firstAction.miniMaxValue > secondAction.miniMaxValue) {
            return 1;
        }
        return 0;
    }

    _descending(firstAction, secondAction) { // TODO : repeat of _ascending ?
        if (firstAction.miniMaxValue > secondAction.miniMaxValue) {
            return -1;
        }
        else if (firstAction.miniMaxValue < secondAction.miniMaxValue) {
            return 1;
        }
        return 0;
    }
}

