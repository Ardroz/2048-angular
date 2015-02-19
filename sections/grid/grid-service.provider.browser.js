/*jslint node: true, indent: 2, nomen:true */
'use strict';

function gridService() {
  this.size = 4; // Default size
  this.startingTileNumber = 2; // default starting tiles

  this.setSize = function (sz) {
    this.size = sz || 0;
  };

  this.setStartingTiles = function (num) {
    this.startingTileNumber = num;
  };

  var service = this;

  this.$get = function (TileModel) {
    this.grid   = [];
    this.tiles  = [];

    // Private things
    var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
    };

    this.getSize = function () {
      return service.size;
    };

    // Build game board
    this.buildEmptyGameBoard = function () {
      var self = this, x;
      // Initialize our grid
      for (x = 0; x < service.size * service.size; x = x + 1) {
        this.grid[x] = null;
      }

      this.forEach(function (x, y) {
        self.setCellAt({x: x, y: y}, null);
      });
    };

    /*
     * Prepare for traversal
     */
    this.prepareTiles = function () {
      /*jslint unparam:true*/
      this.forEach(function (x, y, tile) {
        if (tile) {
          tile.savePosition();
          tile.reset();
        }
      });
      /*jslint unparam:false*/
    };

    /*
     * Due to the fact we calculate the next positions
     * in order, we need to specify the order in which
     * we calculate the next positions
     */
    this.traversalDirections = function (key) {
      var vector = vectors[key],
        positions = {x: [], y: []},
        x;

      for (x = 0; x < this.size; x = x + 1) {
        positions.x.push(x);
        positions.y.push(x);
      }

      if (vector.x > 0) {
        positions.x = positions.x.reverse();
      }
      if (vector.y > 0) {
        positions.y = positions.y.reverse();
      }

      return positions;
    };


    /*
     * Calculate the next position for a tile
     */
    this.calculateNextPosition = function (cell, key) {
      var vector = vectors[key],
        previous;

      do {
        previous = cell;
        cell = {
          x: previous.x + vector.x,
          y: previous.y + vector.y
        };
      } while (this.withinGrid(cell) && this.cellAvailable(cell));

      return {
        newPosition: previous,
        next: this.getCellAt(cell)
      };
    };


    /*
     * Is the position within the grid?
     */
    this.withinGrid = function (cell) {
      return cell.x >= 0 && cell.x < this.size &&
              cell.y >= 0 && cell.y < this.size;
    };

    /*
     * Is a cell available at a given position
     */
    this.cellAvailable = function (cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      }

      return null;
    };

    /*
     * Build the initial starting position
     * with randomly placed tiles
     */
    this.buildStartingPosition = function () {
      var x;
      for (x = 0; x < this.startingTileNumber; x = x + 1) {
        this.randomlyInsertNewTile();
      }
    };

    /*
     * Check to see if there are any matches available
     */
    this.tileMatchesAvailable = function () {
      var totalSize = service.size * service.size,
        i,
        pos,
        tile,
        vectorName,
        vector,
        cell,
        other;

      for (i = 0; i < totalSize; i = i + 1) {
        pos = this._positionToCoordinates(i);
        tile = this.tiles[i];

        if (tile) {
          // Check all vectors
          for (vectorName in vectors) {
            vector = vectors[vectorName];
            cell = { x: pos.x + vector.x, y: pos.y + vector.y };
            other = this.getCellAt(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
      return false;
    };

    /*
     * Get a cell at a position
     */
    this.getCellAt = function (pos) {
      if (this.withinGrid(pos)) {
        var x = this._coordinatesToPosition(pos);
        return this.tiles[x];
      }

      return null;
    };

    /*
     * Set a cell at position
     */
    this.setCellAt = function (pos, tile) {
      if (this.withinGrid(pos)) {
        var xPos = this._coordinatesToPosition(pos);
        this.tiles[xPos] = tile;
      }
    };

    this.moveTile = function (tile, newPosition) {
      var oldPos = {
        x: tile.x,
        y: tile.y
      };

      this.setCellAt(oldPos, null);
      this.setCellAt(newPosition, tile);

      tile.updatePosition(newPosition);
    };

    /*
     * Run a callback for every cell
     * either on the grid or tiles
     */
    this.forEach = function (cb) {
      var totalSize = service.size * service.size, i, pos;
      for (i = 0; i < totalSize; i = i + 1) {
        pos = this._positionToCoordinates(i);
        cb(pos.x, pos.y, this.tiles[i]);
      }
    };

    /*
     * Helper to convert x to x,y
     */
    this._positionToCoordinates = function (i) {
      var x = i % service.size,
        y = (i - x) / service.size;
      return {
        x: x,
        y: y
      };
    };

    /*
     * Helper to convert coordinates to position
     */
    this._coordinatesToPosition = function (pos) {
      return (pos.y * service.size) + pos.x;
    };

    /*
     * Insert a new tile
     */
    this.insertTile = function (tile) {
      var pos = this._coordinatesToPosition(tile);
      this.tiles[pos] = tile;
    };

    this.newTile = function (pos, value) {
      return new TileModel(pos, value);
    };

    /*
     * Remove a tile
     */
    this.removeTile = function (pos) {
      pos = this._coordinatesToPosition(pos);
      delete this.tiles[pos];
    };

    /*
     * Same position
     */
    this.samePositions = function (a, b) {
      return a.x === b.x && a.y === b.y;
    };

    /*
     * Get all the available tiles
     */
    this.availableCells = function () {
      var cells = [],
        self = this;

      this.forEach(function (x, y) {
        var foundTile = self.getCellAt({x: x, y: y});
        if (!foundTile) {
          cells.push({x: x, y: y});
        }
      });

      return cells;
    };

    /*
     * Randomly insert a new tile
     */
    this.randomlyInsertNewTile = function () {
      var cell = this.randomAvailableCell(),
        tile = this.newTile(cell, 2);
      this.insertTile(tile);
    };

    /*
     * Get a randomly available cell from all the
     * currently available cells
     */
    this.randomAvailableCell = function () {
      var cells = this.availableCells();
      if (cells.length > 0) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    /*
     * Check to see there are still cells available
     */
    this.anyCellsAvailable = function () {
      return this.availableCells().length > 0;
    };

    return this;
  };
}

module.exports = function (grid) {
  grid.provider('GridService', gridService);
};
