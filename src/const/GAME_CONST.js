"use strict";

const GAME_CONST = {
    AFFILIATION: {
        ACCEPTED: "accepted",
        INVITED: "invited",
        REJECTED: "rejected",
        LEFT: "left",
        UNKNOWN: "unknown"
    },
    TURN: {
        NONE: 0,
        X: 1,
        O: 2
    },
    GRID: {
        CELL_WIDTH: 264,
        CELL_HEIGHT: 264,
        CELL_COLS: 3,
        CELL_ROWS: 3,
        CELL_HEIGHT_PAD: 54,
        CELL_WIDTH_PAD: 54,
        CELL_RELATIVE_TOP: 501,
        CELL_RELATIVE_LEFT: 90,
        CELL_COUNT: 9
    },
    GAME_RESULT: {
        NOT_STARTED: -1,
        IN_PROGRESS: 0,
        FINISHED: 3
    },
    OUTCOME :{
        RESIGNATION : "resignation",
        TIMEOUT : "timeout"
    }
};


export default GAME_CONST;