'use strict';

export default class GameStoreQuery { // TODO : Rename to KapowGameStore ?
    get(key, successCallback, failureCallback) {
        var that = this;
        kapow.gameStore.get(key, function (val) {
            console.log("Fetching gameStore " + key + " data successful", val);
            if (successCallback !== undefined) { // TODO : can be written as  - successCallback && successCallback(val, that);
                successCallback(val, that);
            }
        }, function (error) {
            console.log("Fetching gameStore " + key + " data failed : ", error);
            if (failureCallback !== undefined) { // TODO : same
                failureCallback();
            }
        });
    }

    set(key, param, successCallback, failureCallback) {
        kapow.gameStore.set(key, JSON.stringify(param), function () {
            console.log("Storing gameStore " + key + " data was successful :", param);
            if (successCallback !== undefined) {
                successCallback();
            }
        }, function (error) {
            console.log("Storing gameStore " + key + " data Failed : ", error);
            if (failureCallback !== undefined) {
                failureCallback();
            }
        });
    }
}