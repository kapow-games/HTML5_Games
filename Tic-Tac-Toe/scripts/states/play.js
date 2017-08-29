'use strict';
var play = function() {};
var win = 0 ;
var CELL_COLS, CELL_ROWS;
var limit ;
play.prototype = {
  create: function() {
    var CELL_WIDTH, CELL_HEIGHT;
    CELL_WIDTH = CELL_HEIGHT = 107;
    CELL_COLS = CELL_ROWS = 3;
    limit  = (CELL_ROWS*CELL_COLS) -1 ;
    var bg = this.add.sprite(0, 0, 'arena');
    bg.anchor.set(0.5);
    bg.scale.setTo(3,3);

    win = 0 ;
    this.cells = this.game.add.group();
    this.player = 1;
    this.cellFilled = 0 ;
    this.cells.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < CELL_COLS; i++) {
      for (var j = 0; j < CELL_ROWS; j++) {
        var cell = this.cells.create(i * CELL_WIDTH, j * CELL_HEIGHT, 'cell');
        cell.frame = 0;
        cell.inputEnabled = true;
        cell.events.onInputDown.add(this.addPlayerMarker, this);
        this.game.physics.arcade.enable(cell);
      }
    }

    console.log(this.cells);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  update: function() {

  },
  clickListener: function() {
    this.game.state.start('gameover');
  },
  // Try to implement a list of cells which are not filled and take randoms cell nos.
  //Will rediuce no. of calls.
  //TODO on Wed
  addPlayerMarker: function(sprite, pointer) {
    let cell = this.cells.children;
    if(sprite.frame === 0) {
      sprite.frame = this.player;
      this.player = this.player === 1 ? 2 : 1;
      this.checkMaze(cell);
      this.cellFilled++;
      let cellNo = Math.floor(Math.random() * (limit+1)) ;
      console.log(limit,cellNo,cell);
      if(this.cellFilled < CELL_ROWS*CELL_COLS ) {
        while(cell[cellNo].frame !== 0) {
          cellNo = Math.floor(Math.random() * (limit+1)) ;
          console.log(limit,cellNo,cell);
        }
        this.cellFilled++;
        cell[cellNo].frame = this.player;
      }
      else {
        game.state.start('gameover');
      }
      this.checkMaze();
      this.player = this.player === 1 ? 2 : 1;
    }
    //Checking Rows
    console.log(this.cells.children[0]);
  },
  checkMaze : function() {
    let cell = this.cells.children;
    for (let i = 0, j = CELL_ROWS; i < CELL_COLS; i++) {
      if(cell[i].frame !== 0 && cell[i].frame === cell[i+j].frame && cell[i+j].frame === cell[i+(2*j)].frame) {
        win = cell[i].frame ;
      }
    }
    //Checking Columns
    for (let i = 0, j = 1; i < CELL_ROWS*CELL_COLS; i+=CELL_COLS) {
      if(cell[i].frame !== 0 && cell[i].frame === cell[i+j].frame && cell[i+j].frame === cell[i+(2*j)].frame) {
        win = cell[i].frame ;
      }
    }
    //Checking Leading Diagonals '\'
    if(cell[0].frame !== 0 && cell[0].frame === cell[4].frame && cell[4].frame === cell[8].frame) {
      win = cell[4].frame ;
    }
    //Checing other Diagonal '/'
    if(cell[2].frame !== 0 && cell[2].frame === cell[4].frame && cell[4].frame === cell[6].frame) {
      win = cell[4].frame ;
    }
    if(win!==0) {
      game.state.start('gameover');
    }
  }
};
