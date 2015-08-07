(function (window, angular) {

  angular.module('app.controller.ExportCtrl', ['app.service.ExportServ'])
    .controller('ExportCtrl', function ($scope, ExportServ, LxProgressService) {
      $scope.doExport = function () {
        LxProgressService.circular.show('#E91E63', '#progress');
        // Check extract dir
        var homeDirecotry = ipc.sendSync('get-home-dir');
        var extractedDir = path.join(homeDirecotry, 'extracted');
        // Check or create extract directory
        fs.access(extractedDir, fs.W_OK, function (err) {
          if (err) {
            fse.ensureDirSync(extractedDir);
          }
        });
        // Default hospcode
        $scope.hospcode = '00000';
        $scope.hn = [];

        var start = moment($scope.startDate).format('YYYY-MM-DD');
        var end = moment($scope.endDate).format('YYYY-MM-DD');

        // Create file
        var headers = [];
        headers.service = [
          'HOSPCODE', 'HN', 'SEQ', 'DATE_SERV', 'TIME_SERV', 'BPS', 'BPD', 'WEIGHT', 'HEIGHT', 'CC', 'D_UPDATED'
        ].join('|') + '\n';

       var files = [];
       files.service = path.join(configData.exportPath, 'service.txt');
       files.person = path.join(configData.exportPath, 'person.txt');
       // Create header
       fs.writeFileSync(files.service, headers.service);
       fs.writeFileSync(files.person, headers.person);

        var promise = ExportServ.getHospcode()
          .then(function (hospcode) {
            $scope.hospcode = hospcode;
            return ExportServ.getService(start, end);
          })
          .then(function (rows) {
            var allHn = _.uniq(rows, 'hn');
            angular.forEach(allHn, function (v) {
              $scope.hn.push(v.hn);
            });
            // Create service file

            if (rows.length) {
              var total = rows.length;
              _.forEach(rows[0], function (v) {
                var obj = {};
                obj.hospcode = v.hospcode;
                obj.total = v.total;
                obj.kpi_year = v.kpi_year;
                obj.kpi_id = v.kpi_id;
                obj.province = v.province;

                var str = [
                  obj.kpi_id, obj.province, obj.hospcode, obj.total,
                  obj.kpi_year].join('|') + '\n';
                  fs.appendFileSync(files.service, str);
             });
         } else {
             console.log(colors.red(' - target [0]'));
         }

            return ExportServ.getPerson($scope.hn);
          })
          .then(function (person) {
            LxProgressService.circular.hide();
          }, function (err) {
            console.log(err);
            LxProgressService.circular.hide();
          });

      }
    });

})(window, window.angular);
