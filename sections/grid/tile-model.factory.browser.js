/*jslint node: true, indent: 2, nomen:true */
'use strict';

function tileModel(GenerateUniqueId) {
  var Tile = function (pos, val) {
    this.x      = pos.x;
    this.y      = pos.y;
    this.value  = val || 2;

    this.id = GenerateUniqueId.next();
    this.merged = null;
  };

  Tile.prototype.savePosition = function () {
    this.originalX = this.x;
    this.originalY = this.y;
  };

  Tile.prototype.reset = function () {
    this.merged = null;
  };

  Tile.prototype.setMergedBy = function (arr) {
    var self = this;
    arr.forEach(function (tile) {
      tile.merged = true;
      tile.updatePosition(self.getPosition());
    });
  };

  Tile.prototype.updateValue = function (newVal) {
    this.value = newVal;
  };

  Tile.prototype.updatePosition = function (newPosition) {
    this.x = newPosition.x;
    this.y = newPosition.y;
  };

  Tile.prototype.getPosition = function () {
    return {
      x: this.x,
      y: this.y
    };
  };

  return Tile;
}

module.exports = function (grid) {
  grid.factory('TileModel', tileModel);
  tileModel.$inject = ['GenerateUniqueId'];
};
