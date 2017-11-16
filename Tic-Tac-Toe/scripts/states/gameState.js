class GameState {
    constructor(oldGameState) {
        this.turn = 0 ; // 0 : No One's Move // 1 : Player 1(x)'s Move // 2 : Player 2(o)'s Move'
        this.oMovesCount = 0 ;
        this.boardResult ; // 0 : Board Result Draw // 1 : Board Result Player 1(x) wins // 2 : Board Result Player 2(o) wins // undefined : game state not decided
        this.board = [] ; //board[i] = 0 : Empty //board[i] = 1 : 'X' //board[i] = 2 : 'O'
        if(typeof(oldGameState) !== "undefined") {
            var len = oldGameState.board.length ;
            this.board = new Array(len) ;
            for( var i = 0 ; i < len ; i++ ) {
              this.board[i] = oldGameState.board[i] ;
            }
            this.turn = oldGameState.turn ;
            this.oMovesCount = oldGameState.oMovesCount ;
            this.boardResult = oldGameState.boardResult ;
        }
    }
    nextTurn() {
        this.turn = ( this.turn === 1 )? 2 : 1 ;
    }
    emptyCells() {
        var indices = [] ;
        var len = this.board.length;
        for(let i = 0 ; i < len ; i++) {
            if(this.board[i]===0) {
                indices.push(i) ;
            }
        }
        return indices ;
    }
    isTerminal() {
        let cell = this.board;
        for (let i = 0, j = CELL_ROWS; i < CELL_COLS; i++) {
            if(cell[i] !== 0 && cell[i] === cell[i+j] && cell[i+j] === cell[i+(2*j)]) {
                gameLayoutVariables.winningMarkLine = i;
                this.boardResult = cell[i] ;
                return true ;
            }
        }
        //Checking Columns
        for (let i = 0, j = 1; i < CELL_ROWS*CELL_COLS; i+=CELL_COLS) {
            if(cell[i] !== 0 && cell[i] === cell[i+j] && cell[i+j] === cell[i+(2*j)]) {
                gameLayoutVariables.winningMarkLine = (i/CELL_COLS)+3;
                this.boardResult = cell[i] ;
                return true;
            }
        }
        //Checking Leading Diagonals '\'
        if(cell[0] !== 0 && cell[0] === cell[4] && cell[4] === cell[8]) {
            gameLayoutVariables.winningMarkLine = 6;
            this.boardResult = cell[4] ;
            return true;
        }
        //Checing other Diagonal '/'
        if(cell[2] !== 0 && cell[2] === cell[4] && cell[4] === cell[6]) {
            gameLayoutVariables.winningMarkLine = 7;
            this.boardResult = cell[4] ;
            return true;
        }
        if(this.emptyCells().length === 0) {
            this.boardResult = 0 ;
            return true;
        }
        else {
            return false ;
        }
    }
}
