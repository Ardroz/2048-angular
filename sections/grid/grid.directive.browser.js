/*jslint node: true, indent: 2, nomen:true */
'use strict';

function gridDirective() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: '/html/grid/views/grid.html'
  };
}

module.exports = function (grid) {
  grid.directive('grid', gridDirective);
};
