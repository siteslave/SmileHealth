/*
 * Export data module
 */

(function (window, angular) {

	angular.module('app.service.ExportServ', [])
		.factory('ExportServ', function ($q, Config) {
				return {
					person: function (db, hn) {
						var q = $q.defer();

						db('person')
							.select()
							.then(function (rows) {
								q.resolve(rows);
							})
							.catch(function (err) {
								q.reject(err);
							});

						return q.promise;
					},
					// Export service
					service: function (db, start, end) {
						var q = $q.defer();

						db('ovst as o')
							.select()
							.whereBetween('o.vstdate', [start, end])
							.then(function (rows) {
								q.resolve(rows);
							})
							.catch(function (err) {
								q.reject(err);
							});

						return q.promse;
					}
				}
		});

})(window, window.angular);