import globalVariableInstance from "../objects/store/gameGlobalVariables";
import phaserGame from "../main";

var parseRoomAndRedirectToGame = function() {
    if (globalVariableInstance.get("room") === null) {
        console.log("Room is null, hence not redirecting to game");
    }
    else {
        console.log('Parsing Room.');
        var players = globalVariableInstance.get("room").players;
        if (players.length >= 1) {
            if (players.length === 2) {
                if (players[0].id === globalVariableInstance.get("playerData").id) {
                    globalVariableInstance.set("opponentData", players[1]);
                    globalVariableInstance.set("playerData", players[0]);
                }
                else {
                    globalVariableInstance.set("opponentData", players[0]);
                    globalVariableInstance.set("playerData", players[1]);
                }
                kapow.fetchHistorySince(null,25,
                    function(messagesHistory) {
                        console.log("History Fetch at CLIENT : ",messagesHistory);
                        var history = [];
                        var i = 0 ;
                        for (var i = messagesHistory.length - 1; i >= 0; i--) {
                            if (messagesHistory[i].type === "move" && messagesHistory[i].data.type === "move") {
                                history.push(messagesHistory[i]);
                            }
                            if ( messagesHistory[i].type === "outcome") {
                                globalVariableInstance.set("gameOver", true) ;
                                if(messagesHistory[i].data.type === "result") {
                                    if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === messagesHistory[i].data.ranks[globalVariableInstance.get("opponentData").id]) {
                                        globalVariableInstance.set("turnOfPlayer", 0) ;
                                    }
                                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 1) {
                                        globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("opponentData")) ;
                                    }
                                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 2) {
                                        globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData")) ;
                                    }
                                    else {
                                        console.log("Player Turn couldn't be detrminded");
                                    }
                                }
                                else if(messagesHistory[i].data.type === "resignation" || messagesHistory[i].data.type === "timeout") {
                                    console.log("Outcome  data :",messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id]);
                                    if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === messagesHistory[i].data.ranks[globalVariableInstance.get("opponentData").id]) {
                                        globalVariableInstance.set("turnOfPlayer", 0) ;
                                    }
                                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 1) {
                                        globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("opponentData")) ;
                                        console.log("Turn of player set to : ",globalVariableInstance.get("opponentData").id);
                                    }
                                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 2) {
                                        globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData")) ;
                                        console.log("Turn of player set to : ",globalVariableInstance.get("playerData").id);
                                    }
                                    else {
                                        console.log("Player Turn couldn't be determined");
                                    }
                                }
                            }
                        }
                        console.log("Move History sorted according to sequence number",history);
                        if(history.length > 0) {
                            globalVariableInstance.set("boardStatus", {cells : history[0].data.moveData.board});
                            if(history[0].senderId === globalVariableInstance.get("playerData").id) {
                                if(globalVariableInstance.get("gameOver") === false) {
                                    globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("opponentData")) ;
                                }
                            }
                            else if(history[0].senderId === globalVariableInstance.get("opponentData").id) {
                                if(globalVariableInstance.get("gameOver") === false) {
                                    globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData")) ;
                                }
                            }
                            else {
                                if(globalVariableInstance.get("gameOver") === false) {
                                    console.log("Current Turn can't be determined");
                                }
                            }
                        }
                        else if(globalVariableInstance.get("gameOver") !== true){
                            globalVariableInstance.set("turnOfPlayer", undefined) ;
                        }
                    },
                    function() {
                        console.log('fetchHistory Failed')
                    });
            }
            console.log("Redirecting to game...",globalVariableInstance.get("opponentData"));
            globalVariableInstance.set("gameType", 'friend');
            if(globalVariableInstance.get("opponentData") !== null && globalVariableInstance.get("opponentData").affiliation === "accepted") {
                phaserGame.state.start('playLoad');
            }
            else if(globalVariableInstance.get("opponentData") !== null && (globalVariableInstance.get("opponentData").affiliation === "left" || globalVariableInstance.get("playerData").affiliation === "left")) {
                globalVariableInstance.set("gameOver", true);
                phaserGame.state.start('playLoad');
            }
            else {
                console.log("Invitation not accepted by opponent");
                phaserGame.state.start('waiting');
            }
        }
        else {
            console.log("Room not having player...");
        }
    }
};
export default parseRoomAndRedirectToGame;