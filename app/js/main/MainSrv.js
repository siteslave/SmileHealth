/*
* Main Service
*/
(function (window, angular) {

    angular.module('app.service.Main', [])
        .factory('MainSrv', function ($q, Config) {
          // Get database connection
          var db = Config.getConnection();
          // Service function
          return {
            /*
            * Get service list
            *
            * @params   {Date}  serviceDate
            * @return   {Array}
            */
            getServiceList: function (serviceDate) {
                var q = $q.defer();

                db('ovst as o')
                  .select('o.vstdate', 'p.cid', 'o.hn', 'o.vsttime', 'o.vn', 'p.pname', 'p.fname', 'p.lname',
                  't.name as pttype_name', 'o.pttypeno', 'd.name as doctor_name', 'i.name as pdx_name',
                  's.name as spclty_name', 'st.name as ost_name', 'v.income', 'v.main_pdx')
                  .leftJoin('vn_stat as v', 'v.vn', 'o.vn')
                  .leftJoin('patient as p', 'p.hn', 'o.hn')
                  .leftJoin('pttype as t', 't.pttype', 'o.pttype')
                  .leftJoin('doctor as d', 'd.code', 'o.doctor')
                  .leftJoin('icd101 as i', 'i.code', 'v.main_pdx')
                  .leftJoin('spclty as s', 's.spclty', 'o.spclty')
                  .leftJoin('ovstost as st', 'st.ovstost', 'o.ovstost')
                  .where('o.vstdate', serviceDate)
                  .where('o.pt_subtype', 1)
                  .orderBy('o.vn')
                  .then(function (rows) {
                    q.resolve(rows);
                  })
                  .catch(function (err) {
                    q.reject(err);
                  });

                return q.promise;
            }
          }
        });

})(window, window.angular);
