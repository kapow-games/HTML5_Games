"use strict";

import PhaserGame from '../PhaserGame';
import handleGameEnd from '../util/gameEnd';

let GameManager = {
    createGame() {
        this.game = new PhaserGame(1080, 1920, 'tic-tac-toe');
    },
    startGame() {
        this.game.state.start('Boot');
    },
    endGame(value) {
        handleGameEnd(value);
    },
    startState(state) {
        this.game.state.start(state);
    },
    reflectMove(message) {
        this.game.state.states.Play.receiveMove(message);
    },
    toggleMusic(value) {
        this.game.state.states.Preload.sound.mute = value;
    },
    loadResultUI(value) {
        this.game.state.states.Play.loadResultScreen(value);
    }
};

export default GameManager;
