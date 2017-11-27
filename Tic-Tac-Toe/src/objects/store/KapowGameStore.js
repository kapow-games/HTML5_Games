'use strict';

export default class KapowGameStore { // TODO : Rename to KapowGameStore ?
    get(key, successCallback, failureCallback) {
        var that = this;
        kapow.gameStore.get(key, function (val) {
            console.log("Fetching gameStore " + key + " data successful", val);
            successCallback && successCallback(val, that);
        }, function (error) {
            console.log("Fetching gameStore " + key + " data failed : ", error);
            failureCallback && failureCallback();
        });
    }

    set(key, param, successCallback, failureCallback) {
        kapow.gameStore.set(key, JSON.stringify(param), function () {
            console.log("Storing gameStore " + key + " data was successful :", param);
            successCallback && successCallback();
        }, function (error) {
            console.log("Storing gameStore " + key + " data Failed : ", error);
            failureCallback && failureCallback();
        });
    }
}