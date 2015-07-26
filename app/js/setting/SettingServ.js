(function (window, angular) {

  var fse = require('fs-extra');
  var configFile = ipc.sendSync('get-config-file');

	angular.module('app.service.SettingServ', [])
    .factory('SettingServ', function ($q) {
        return {
            saveConfig: function (config) {
            	var q = $q.defer();
                fse.writeJson(configFile, config, function (err) {
                	if (err) q.reject(err);
                	else q.resolve();
                });

              return q.promise; 
            }
        }
    });

})(window, window.angular);