"use strict";

import KapowClientController from "./KapowClientController";

window.game = {
    onLoad: function (room) {
        console.log("Room returned by kapow onLoad - " + JSON.stringify(room));
        KapowClientController.handleOnLoad(room);
    },
    onGameEnd: function (outcome) {
        console.log("CLIENT : Game Ended", outcome);
        KapowClientController.handleGameEnd(outcome);
    },
    onPlayerJoined: function (playerObj) {
        console.log("CLIENT onPlayerJoined - " + JSON.stringify(playerObj));
    },
    onInviteRejected: function (playerObj) {
        console.log("Client onInviteRejected - " + JSON.stringify(playerObj));
        KapowClientController.handleAffliliationChange();
    },
    onPlayerLeft: function (playerObj) {
        console.log("Client onPlayerLeft - " + JSON.stringify(playerObj));
    },
    onTurnChange: function (player) {
        console.log("Player Turn Changed to : " + JSON.stringify(player));
        KapowClientController.handleOnTurnChange(player);
    },
    onPause: function () {
        console.log('On Pause Triggered.');
        KapowClientController.handleOnPause();
    },
    onResume: function () {
        KapowClientController.handleGameResume();
    },
    onMessageReceived: function (message) {
        console.log('CLIENT : Message Received - ', message);
        KapowClientController.handleMessage(message);
    },
    onBackButtonPressed: function () {
        KapowClientController.handleBackButton();
        return true;
    },
    onRoomLockStatusChange: function (roomObj) {
        console.log("Room Lock status changed for room :", roomObj);
    }
};