'use strict';
import GameState from "./GameState";
import gameInfo from "../store/GameGlobalVariables";
import gameConst from "../../gameParam/gameConst";

export default class BotBehaviour { // TODO : why is bot and bot behavior different ?
    constructor(pos) {
        this.movePosition = pos;
        this.miniMaxValue = 0;
    }

    plays(state) {// TODO : rename function to play and args to state
        let nextGameState = new GameState(state);
        nextGameState.board[this.movePosition] = (state.turnOfPlayer ? gameInfo.get("playerMark") : ((gameInfo.get("playerMark") === gameConst.X) ? 2 : 1));
        if (!state.turnOfPlayer) {
            nextGameState.movesCount++;
        }
        nextGameState.nextTurn();
        return nextGameState;
    }
}
