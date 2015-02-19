/*jslint node: true, indent: 2, nomen:true */
'use strict';

function keyboardService($document) {
  var UP    = 'up',
    RIGHT = 'right',
    DOWN  = 'down',
    LEFT  = 'left',
    keyboardMap = {
      37: LEFT,
      38: UP,
      39: RIGHT,
      40: DOWN
    };

  this.init = function () {
    var self = this;
    this.keyEventHandlers = [];
    $document.bind('keydown', function (evt) {
      var key = keyboardMap[evt.which];

      if (key) {
        // An interesting key was pressed
        evt.preventDefault();
        self._handleKeyEvent(key, evt);
      }
    });
  };

  this.on = function (cb) {
    this.keyEventHandlers.push(cb);
  };

  this._handleKeyEvent = function (key, evt) {
    var callbacks = this.keyEventHandlers, x, cb;
    if (!callbacks) {
      return;
    }

    evt.preventDefault();

    if (callbacks) {
      for (x = 0; x < callbacks.length; x = x + 1) {
        cb = callbacks[x];
        cb(key, evt);
      }
    }
  };

}

module.exports = function (keyboard) {
  keyboard.service('KeyboardService', keyboardService);
  keyboardService.$inject = ['$document'];
};
