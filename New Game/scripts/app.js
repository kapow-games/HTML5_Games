var game = new Phaser.Game(800,600,Phaser.CANVAS,"game");
game.state.add('Boot',boot);
game.state.add('Preload',preload);
game.state.add('Game',game);
game.state.start('Boot');
