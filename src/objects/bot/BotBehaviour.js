'use strict';

import GameState from "./GameState";
import gameInfo from "../store/GameInfo";
import GAME_CONST from "../../const/GAME_CONST";

export default class BotBehaviour { // TODO : why is bot and bot behavior different ?
    constructor(pos) {
        this.movePosition = pos;
        this.miniMaxValue = 0;
    }

    play(state) {
        let nextGameState = new GameState(state);
        nextGameState.board[this.movePosition] = (state.turnOfPlayer ? gameInfo.get("playerMark") : ((gameInfo.get("playerMark") === GAME_CONST.TURN.X) ? 2 : 1));
        if (!state.turnOfPlayer) {
            nextGameState.movesCount++;
        }
        nextGameState.nextTurn();
        return nextGameState;
    }
}
