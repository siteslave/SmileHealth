var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

var fse = require('fs-extra'),
  fs = require('fs'),
  path = require('path'),
  ipc = require('ipc');

var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1030,
    height: 600,
    center: true,
    fullscreen: false
  });

  ipc.on('get-home-dir', function (event) {
    var homeDirecotry = app.getPath('home'),
      appHome = path.join(homeDirecotry, '.khos');
    // Return configure path
    event.returnValue = appHome;
  });
  /*
  * Get configuration file path
  */
  ipc.on('get-config-file', function (event) {
    //console.log(app.getPath('home'));
    var homeDirecotry = app.getPath('home'),
      appDir = path.join(homeDirecotry, '.khos'),
      configFile = path.join(appDir, 'config.json');
    // Return configure path
    event.returnValue = configFile;
  });
  /*
  * Get configuration data
  */
  ipc.on('get-config', function (event) {
    var homeDirecotry = app.getPath('home'),
      appDir = path.join(homeDirecotry, '.khos'),
      configFile = path.join(appDir, 'config.json');
    //Create app directory
    fse.mkdirsSync(appDir);
    // Check configfile exists
    fs.access(configFile, fs.R_OK && fs.W_OK, function (err) {
      if (err) {
          // Setup default configure data
          var defaultConfig = {
            his: {
              host: 'localhost',
              port: 3306,
              database: 'hosxp_pcu',
              user: 'sa',
              password: 'sa'
            },
            cloud: {
              url: 'http://localhost:8080',
              key: '1234567890'
            }
          };
          // Write config file with default configure
          fse.writeJsonSync(configFile, defaultConfig);
          event.returnValue = defaultConfig;
      } else {
        // Return configure data
        event.returnValue = fse.readJsonSync(configFile);
      }
    });
  });
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
