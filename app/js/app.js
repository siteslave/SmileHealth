// Main application module.

// Remote function
var ipc = require('ipc');

// Libraries dependencies
global.$ = global.jQuery = require('jquery');
require('jquery.transit');
require('velocity-animate');
require('angular');
require('angular-ui-router');
global.moment = require('moment');
require('../vendor/lumx/dist/lumx.js');

// Main angular application
angular.module('khos', [
  'lumx', 'ui.router',
  'app.config.Config',
  'app.filter',
  'app.controller.SettingCtrl',
  'app.controller.Main',
  'app.controller.ExportCtrl'
])
.config(function ($stateProvider, $urlRouterProvider) {
  // Default routing
  $urlRouterProvider.otherwise('/main');
  // Setup routings
  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: './pages/main.html',
      controller: 'MainCtrl'
    })
    .state('setting', {
      url: '/setting',
      templateUrl: './pages/setting.html',
      controller: 'SettingCtrl'
    })
    .state('exports', {
    url: '/exports',
    templateUrl: './pages/exports.html',
    controller: 'ExportCtrl'
    });
});
