/*
 * Export data module
 */

(function (window, angular) {

  angular.module('app.service.ExportServ', [])
    .factory('ExportServ', function ($q, Config) {

      var db = Config.getConnection();

        return {
          getHospcode: function () {
            var q = $q.defer();
            /*
            select hospitalcode as hospcode from opdconfig limit 1
            */
            db('opdconfig')
              .select('hospitalcode')
              .then(function (rows) {
                q.resolve(rows[0].hospitalcode);
              })
              .catch(function (err) {
                q.reject(err);
              });

            return q.promise;
          },
          getPerson: function (hn) {
            var q = $q.defer();

            /*
            select p.cid, p.patient_hn as hn, p.fname, p.lname, p.birthdate, p.sex, p.house_regist_type_id as typearea
            from person as p
            where p.patient_hn in ('0004537', '0004914', '0004883', '0004298', '0004673')
            */
            db('person as p')
              .select(
                'p.cid as CID', 'p.patient_hn as HN', 'p.fname as FNAME', 'p.lname as LNAME', 'p.birthdate as BIRTH',
                'p.sex as SEX', 'p.house_regist_type_id as TYPEAREA'
              )
              .whereIn('p.patient_hn', hn)
              .then(function (rows) {
                q.resolve(rows);
              })
              .catch(function (err) {
                q.reject(err);
              });

            return q.promise;
          },
          // Export service
          getService: function (start, end) {
            var q = $q.defer();
            db('ovst as o')
              .select(
                'o.vn as SEQ', 'o.hn as HN', 'o.vstdate as DATE_SERV', 'o.vsttime as TIME_SERV', 's.bps as BPS',
                's.bpd as BPD', 's.bw as WEIGHT', 's.height as HEIGHT', 's.cc as CC'
              )
              .leftJoin('opdscreen as s', 's.vn', 'o.vn')
              .innerJoin('patient as p', 'p.hn', 'o.hn')
              .innerJoin('ovstdiag as od', 'od.vn', 'o.vn')
              .whereNotNull('o.vn')
              .where(function () {
                this.whereBetween('od.icd10', ['E100', 'E149'])
                .orWhere(function () {
                  this.whereBetween('od.icd10', ['I10', 'I159'])
                })
              })
              .whereBetween('o.vstdate', [start, end])
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
