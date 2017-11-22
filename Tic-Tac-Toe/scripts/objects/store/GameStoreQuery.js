'use strict';

export default class GameStoreQuery { // TODO : @mayank file name and class name should ideally be same. You can name it as gameQueryStore or gameStore or queryStore
    get(key, successCallback, failureCallback) { // TODO : @mayank spelling mistake in failiureCallback
        var that = this;
        kapow.gameStore.get(key, function (val) {
            console.log("Fetching gameStore " + key + " data successful", val);
            if (successCallback !== undefined) {
                successCallback(val, that);
            }
        }, function (error) {
            console.log("Fetching gameStore " + key + " data failed : ", error);
            if (failureCallback !== undefined) {
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