"use strict";

import BotBehaviour from "./BotBehaviour";
import GAME_CONST from "../../const/GAME_CONST";

export default class Bot {
    constructor() {
        this.gameDetail = {};
    }

    getMiniMaxValue(ticTacToeGame, state) { //TODO : might not be needed at every step
        if (state.isTerminal()) {
            return ticTacToeGame.getScore(state);
        }
        let stateScore = state.turnOfPlayer ? -1000 : 1000;
        let availableNextStates = state.emptyCells().map(function (pos) {
            let action = new BotBehaviour(pos);
            return action.play(state);
        });

        availableNextStates.forEach(function (nextState) {
            let nextScore = this.getMiniMaxValue(ticTacToeGame, nextState);
            if (state.turnOfPlayer === true && nextScore > stateScore) {
                stateScore = nextScore;
            }
            else if (state.turnOfPlayer === false && nextScore < stateScore) {
                stateScore = nextScore;
            }
        }.bind(this));
        return stateScore;
    }

    doBotMove(turnOfPlayer) {
        let availableActions = this.sortPossibleBotMoves(turnOfPlayer);
        let chosenAction;
        if (Math.random() <= GAME_CONST.DIFFICULTY) { // TODO : extract const
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
        // chosenAction = availableActions[0];// Hard Bot Move
        let next = chosenAction.play(this.gameDetail.currentState);
        this.gameDetail.moveTo(next);
    }

    storeGameDetail(gameDetail) {
        //The 'Bot' should be aware of the 'Game' object. This function stores that.
        this.gameDetail = gameDetail;
    }

    playMove(turnOfPlayer) { // TODO : redundant fn ?
        this.doBotMove(turnOfPlayer);
    }

    sortPossibleBotMoves(turnOfPlayer) {
        let availableActions = this.gameDetail.currentState.emptyCells().map(function (pos) {
            let action = new BotBehaviour(pos);
            let next = action.play(this.gameDetail.currentState);
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

    _descending(firstAction, secondAction) {
        return this._ascending(secondAction, firstAction);
    }
}

