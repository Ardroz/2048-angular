/*jslint node: true, indent: 2, nomen:true */
'use strict';

function gameController(GameManager, KeyboardService) {
  this.game = GameManager;

  this.newGame = function () {
    KeyboardService.init();
    this.game.newGame();
    this.startGame();
  };

  this.startGame = function () {
    var self = this;
    KeyboardService.on(function (key) {
      self.game.move(key);
    });
  };

  this.newGame();
}

module.exports = function (app) {
  app.controller('GameController', gameController);
  gameController.$inject = ['GameManager', 'KeyboardService'];
};
