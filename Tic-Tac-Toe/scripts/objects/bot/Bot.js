"use strict";

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
    getMiniMaxValue(gameObj, state) { // TODO: @mayank: Rename to getMiniMaxValue
        if (state.isTerminal()) {
            return gameObj.score(state);
        }
        let stateScore = state.turn === 1 ? -1000 : 1000;

        let availablePositions = state.emptyCells();
        let availableNextStates = availablePositions.map(function (pos) {
            let action = new BotBehaviour(pos);
            return action.applyTo(state); // TODO : nextState var is redundant
        });
        // console.log(availableNextStates);
        availableNextStates.forEach(function (nextState) {
            var nextScore = getMiniMaxValue(gameObj, nextState);
            if (state.turn === 1 && nextScore > stateScore) { // TODO :  can do (state.turn === 1 && nextScore > stateScore) {}
                stateScore = nextScore;
            }
            else if (nextScore < stateScore) {
                stateScore = nextScore;
            }
        });
        return stateScore;
    }

    botMove(turn) {// TODO : rename turn to something else @sukhmeet medium refered to medium difficulty level.
        // But since the easy bot move and hard bot move idea was dropped, removing the redundant function and renaming to botMove
        this.sortPossibleBotMoves(turn);
        let chosenAction;
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
        let next = chosenAction.applyTo(this.gameDetail.currentState);
        this.gameDetail.moveTo(next);
    }

    plays(gameDetail) { // TODO : @mayank : plays ? what does the function do ?
        this.gameDetail = gameDetail;
    }

    notifyTurn(turn) { // TODO : @mayank: it plays the nextMove , can be renamed accordingly
        this.botMove(turn);
    }

    sortPossibleBotMoves(turn) {
        let available = this.gameDetail.currentState.emptyCells(); // TODO : redundant var
        let availableActions = available.map(function (pos) {
            let action = new BotBehaviour(pos);
            let next = action.applyTo(this.gameDetail.currentState);
            action.miniMaxValue = getMiniMaxValue(next);
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

