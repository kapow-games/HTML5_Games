'use strict';
import GameState from "./GameState";
import globalVariableInstance from "../store/gameGlobalVariables";

export default class BotBehaviour { // TODO : why is bot and bot behavior different ?
    constructor(pos) {
        this.movePosition = pos;
        this.miniMaxValue = 0 ;
    }
    applyTo(state) {// TODO : rename function to play and args to state
        let nextGameState = new GameState(state);
        nextGameState.board[this.movePosition] = (state.turn === 1 ? globalVariableInstance.get("playerMark") : ((globalVariableInstance.get("playerMark") === 1) ? 2 : 1));
        if(state.turn === 2) {
            nextGameState.oMovesCount++;
        }
        nextGameState.nextTurn();
        return nextGameState;
    }
    ascending(firstAction, secondAction) {
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
