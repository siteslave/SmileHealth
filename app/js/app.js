// Main application module.

// Remote function
var ipc = require('ipc');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');

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
  'app.controller.ExportCtrl',
  'app.controller.EmrCtrl'
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
    .state('emr', {
      url: '/emr/:cid/:hn',
      templateUrl: './pages/emr.html',
      controller: 'EmrCtrl'
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
