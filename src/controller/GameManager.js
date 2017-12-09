"use strict";

import PhaserGame from '../PhaserGame';
import getStats from '../util/gameEnd';
import gameInfo from "../objects/store/GameInfo";

let GameManager = {
    createGame() {
        this.game = new PhaserGame(1080, 1920, 'tic-tac-toe');
    },
    startGame() {
        this.game.state.start('Boot');
    },
    endGame(value) {
        this._handleGameEnd(value);
    },
    startState(state) {
        this.game.state.start(state);
    },
    reflectMove(message) {
        this.game.state.states.Play.receiveMove(message);
    },
    toggleMusic(value) {
        this.game.state.states.Preload.sound.mute = value;
        this.game.state.states.Preload.winSound.mute = value;
        this.game.state.states.Preload.tapSound.mute = value;
        this.game.state.states.Preload.winSound.mute = value;
        this.game.state.states.Preload.sound.volume = 0.2;
    },
    loadResultUI(value) {
        this.game.state.states.Play.loadResultScreen(value);
    },
    playTapSound() {
        this.game.state.states.Preload.tapSound.play();
    },
    playWinSound() {
        this.game.state.states.Preload.winSound.play();
    },
    stopWinSound() {
        this.game.state.states.Preload.winSound.stop();
    },
    ////////////// END OF PUBLIC METHODS /////////
    _handleGameEnd(value){
        this.loadResultUI(value);
        if (gameInfo.get("gameOver") === false) {
            getStats(value);
        }
        if (!gameInfo.get("gameLocked") && gameInfo.get("gameType") === "solo") {
            // To ensure that game doesn't close multiple times in Kapow
            kapowEndSoloGame(value);
        }
    }
};

export default GameManager;
