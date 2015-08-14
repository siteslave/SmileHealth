(function (window, angular) {

  angular.module('app.service.EmrServ', [])
  .factory('EmrServ', function ($q, $http, Config) {
    var db = Config.getConnection();

    return {
      getInfo: function (hn) {
        var q = $q.defer();
        // Query
        /*
        select p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate, p.house_regist_type_id,
h.address, v.village_moo, v.village_name, t.house_regist_type_name
from person as p
left join house as h on h.house_id=p.house_id
left join village as v on v.village_id=h.village_id
left join house_regist_type as t on t.house_regist_type_id=p.house_regist_type_id
where p.patient_hn="0000016"
        */
        db('person as p')
        .select('p.cid', 'p.pname', 'p.fname', 'p.lname',
          'p.sex', 'p.birthdate', 'p.house_regist_type_id',
          'h.address', 'v.village_moo', 'v.village_name', 't.house_regist_type_name')
        .leftJoin('house as h', 'h.house_id', 'p.house_id')
        .leftJoin('village as v', 'v.village_id', 'h.village_id')
        .leftJoin('house_regist_type as t', 't.house_regist_type_id', 'p.house_regist_type_id')
        .where('p.patient_hn', hn)
        .limit(1)
        .then(function (rows) {
          q.resolve(rows[0]);
        })
        .catch(function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      getServiceList: function (cid) {
        var q = $q.defer();

        var config = Config.getConfig();
        var url = config.cloud.url + '/service_list';
        var key = config.cloud.key;
        var hospcode = config.cloud.hospcode;

        var options = {
          url: url,
          method: 'POST',
          data: {
            hospcode: hospcode,
            key: key,
            cid: cid
          }
        };

        $http(options)
        .success(function (data) {
          q.resolve(data);
        })
        .error(function (data, status) {
          q.reject('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Cloud server');
        });

        return q.promise;
      },

      getServiceDetail: function (service_hospcode, hn, date_serv, seq) {
        var q = $q.defer();

        var config = Config.getConfig();
        var url = config.cloud.url + '/service_detail';
        var key = config.cloud.key;
        var hospcode = config.cloud.hospcode;

        var options = {
          url: url,
          method: 'POST',
          data: {
            hospcode: hospcode,
            key: key,
            service_hospcode: service_hospcode,
            hn: hn,
            date_serv: date_serv,
            seq: seq
          }
        };

        $http(options)
        .success(function (data) {
          q.resolve(data);
        })
        .error(function (data, status) {
          q.reject('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Cloud server');
        });

        return q.promise;
      }

    };

  });

})(window, window.angular);
