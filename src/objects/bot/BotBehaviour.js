'use strict';

import GameState from "./GameState";
import gameInfo from "../store/GameInfoStore";
import GAME_CONST from "../../gameParam/gameConst";

export default class BotBehaviour { // TODO : why is bot and bot behavior different ?
    constructor(pos) {
        this.movePosition = pos;
        this.miniMaxValue = 0;
    }

    play(state) {// TODO : plural ?
        let nextGameState = new GameState(state);
        nextGameState.board[this.movePosition] = (state.turnOfPlayer ? gameInfo.get("playerMark") : ((gameInfo.get("playerMark") === GAME_CONST.X) ? 2 : 1));
        if (!state.turnOfPlayer) {
            nextGameState.movesCount++;
        }
        nextGameState.nextTurn();
        return nextGameState;
    }
}
