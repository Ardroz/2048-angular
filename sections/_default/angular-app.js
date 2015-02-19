/*jslint node: true, indent: 2, nomen:true, stupid:true */
'use strict';
var di, angular, app, game, grid, keyboard, uiModules, injector;

di = require('di');
angular = require('angular');
require('angular-animate');
require('angular-cookies');
require('angular-resource');
require('angular-route');
require('bootstrap');

app = angular.module('2048', [
  'Game',
  'Grid',
  'Keyboard',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute'
]);

game = angular.module('Game', ['Grid', 'ngCookies']);
grid = angular.module('Grid', []);
keyboard = angular.module('Keyboard', []);

function appConfig($routeProvider, GridServiceProvider) {
  $routeProvider.otherwise({ redirectTo : '/' });
  GridServiceProvider.setSize(4);
}

app.config(appConfig);
appConfig.$inject = ['$routeProvider', 'GridServiceProvider'];

uiModules = {
  angular   : [ 'value', angular ],
  app       : [ 'value', app ],
  game      : [ 'value', game ],
  keyboard  : [ 'value', keyboard ],
  grid      : [ 'value', grid ]
};
uiModules.uiModules = [ 'value', uiModules ];

injector = new di.Injector([uiModules]);

/* modules browserify */
