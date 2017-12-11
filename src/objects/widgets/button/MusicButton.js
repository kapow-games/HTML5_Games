"use strict";

import kapowGameStore from "../../store/KapowGameStore";
import GameManager from "../../../controller/GameManager";

export default class MusicButton extends Phaser.Button {
    constructor(arg) {
        let musicToggle = function () {
            console.log("Music Toggled to volume:",(this.frame+1)%2);
            GameManager.playTapSound();
            let param = {
                volume: (this.frame + 1) % 2
            };
            kapowGameStore.set("music", param, function () {
                this.frame = (1 + this.frame) % 2;
                GameManager.toggleMusic(this.frame === 0);
            }.bind(this));
        };
        super(arg.game, arg.posX, arg.posY, arg.label, musicToggle, null);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        kapowGameStore.get("music", function (args, self) {
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