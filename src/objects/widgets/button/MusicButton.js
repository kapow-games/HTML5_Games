"use strict";
import KapowGameStore from "../../store/KapowGameStore";
import GameManager from "../../../controller/GameManager";

export default class MusicButton extends Phaser.Button {
    constructor(arg) {
        let musicToggle = function () {
            console.log("clickRegistered");
            let gameStoreContainer = new KapowGameStore();
            let param = {
                volume: (this.frame + 1)%2
            };
            gameStoreContainer.set("music", param, function() {
                this.frame = (1 + this.frame) % 2;
                GameManager.toggleMusic(this.frame === 0);
            }.bind(this));
        };
        super(arg.game, arg.posX, arg.posY, arg.label, musicToggle, null);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        let gameStoreContainer = new KapowGameStore();
        gameStoreContainer.get("music", function (args, self) {
            console.log("gameStore fetch - Success.");
            console.log("Value fetched from gameStore was : ", args);
            let valueJSON = JSON.parse(args);
            this.frame = valueJSON.volume;
            GameManager.toggleMusic(this.frame === 0);
        }.bind(this));
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }
};