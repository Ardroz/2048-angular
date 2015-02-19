/*jslint node: true, indent: 2, nomen:true */
'use strict';

function appConfig($routeProvider) {
  $routeProvider
    .when('/', {
      controller : 'GameController as ctrl',
      templateUrl : '/html/main/main.html'
    });
}

module.exports = function (app) {
  app.config(appConfig);
  appConfig.$inject = ['$routeProvider'];
};
