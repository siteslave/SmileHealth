(function (window, angular) {
  angular.module('app.service.LabServ', [])
  .factory('LabServ', function ($q, Config) {

    var db = Config.getConnection();

    return {
      getList: function (orderDate) {
        var q = $q.defer();

        var sql = 'select lh.lab_order_number, lh.vn, lh.hn, p.pname, p.fname, ' +
          'p.lname, lh.order_date, lh.order_time, lh.confirm_report, lh.form_name, ' +
          'ls.lab_perform_status_name ' +
          'from lab_head as lh ' +
          'inner join patient as p on p.hn=lh.hn ' +
          'left join lab_perform_status as ls on ls.lab_perform_status_id=lh.lab_perform_status_id '+
          'where lh.order_date=? ' +
          'order by lh.lab_order_number asc';

        db.raw(sql, [orderDate])
        .then(function (rows) {
          q.resolve(rows[0]);
        })
        .catch(function (err) {
          q.reject(err);
        });

        return q.promise;
      }
    }
  });
})(window, window.angular);
