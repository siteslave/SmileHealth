/**
 * Configuration module
 */
(function (window, angular) {

  angular.module('app.config.Config', [])
    .factory('Config', function () {

      var config = ipc.sendSync('get-config');

      return {
        getConnection: function () {
          return require('knex')({
                client: 'mysql',
                connection: {
                  host: config.his.host,
                  port: config.his.port,
                  database: config.his.database,
                  user: config.his.user,
                  password: config.his.password
                },
                pool: {
                  min: 10,
                  max: 100
                }
            });
        }
      }
    });

})(window, window.angular);
