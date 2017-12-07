'use strict';

class KapowGameStore {
    get(key, successCallback, failureCallback) {
        kapow.gameStore.get(key, function (val) {
            console.log("Fetching gameStore " + key + " data successful", val);
            successCallback && successCallback(val, this); // TODO : Remove self
        }.bind(this), function (error) {
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

let kapowGameStore = new KapowGameStore();
export default kapowGameStore;