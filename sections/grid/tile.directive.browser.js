/*jslint node: true, indent: 2, nomen:true */
'use strict';

function tileDirective() {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: '/html/grid/views/tile.html'
  };
}

module.exports = function (grid) {
  grid.directive('tile', tileDirective);
};
