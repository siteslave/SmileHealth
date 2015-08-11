(function (window, angular) {

  angular.module('app.controller.ExportCtrl', ['app.service.ExportServ'])
    .controller('ExportCtrl', function ($scope, ExportServ, LxProgressService, LxNotificationService) {

      // Check extract dir
      var homeDir = ipc.sendSync('get-home-dir');
      console.log(homeDir);
      var exportDir = path.join(homeDir, 'export');
      // Check or create extract directory
      fs.access(exportDir, fs.W_OK, function (err) {
        if (err) {
          fse.ensureDirSync(exportDir);
        }
      });

      // disabled button
      $scope.isSuccess = true;

      $scope.doExport = function () {
        $scope.isSuccess = false;
        LxProgressService.linear.show('#E91E63', '#progress');
        // Default hospcode
        $scope.hospcode = '00000';
        $scope.hn = [];
        $scope.seq = [];
        $scope.files = [];

        var start = moment($scope.startDate).format('YYYY-MM-DD');
        var end = moment($scope.endDate).format('YYYY-MM-DD');

        // Create file
        var headers = [];
        headers.service = [
          'HOSPCODE', 'HN', 'SEQ', 'DATE_SERV', 'TIME_SERV', 'BPS',
          'BPD', 'WEIGHT', 'HEIGHT', 'CC', 'D_UPDATED'
        ].join('|') + '\n';

        headers.person = [
          'HOSPCODE', 'CID', 'HN', 'FNAME', 'LNAME', 'BIRTH', 'SEX',
          'TYPEAREA', 'D_UPDATED'
        ].join('|') + '\n';

        headers.drug = [
          'HOSPCODE', 'HN', 'SEQ', 'ICODE', 'QTY', 'PRICE',
          'DRUG_NAME', 'UNIT', 'STDCODE', 'USAGE', 'D_UPDATED'
        ].join('|') + '\n';

        headers.lab = [
          'HOSPCODE', 'HN', 'SEQ', 'LNAME', 'LRESULT', 'LUNIT', 'D_UPDATED'
        ].join('|') + '\n';

        headers.diag = [
          'HOSPCODE', 'HN', 'SEQ', 'DIAG_CODE', 'DIAG_TYPE', 'D_UPDATED'
        ].join('|') + '\n';

       var files = [];
       files.service = path.join(exportDir, 'service.txt');
       files.person = path.join(exportDir, 'person.txt');
       files.drug = path.join(exportDir, 'drug.txt');
       files.lab = path.join(exportDir, 'lab.txt');
       files.diag = path.join(exportDir, 'diag.txt');
       // Create header
       fs.writeFileSync(files.service, headers.service);
       fs.writeFileSync(files.person, headers.person);
       fs.writeFileSync(files.drug, headers.drug);
       fs.writeFileSync(files.lab, headers.lab);
       fs.writeFileSync(files.diag, headers.diag);

        var promise = ExportServ.getHospcode()
          .then(function (hospcode) {
            $scope.hospcode = hospcode;
            return ExportServ.getService(start, end);
          })
          .then(function (rows) {

            // Create service file
            $scope.files.push({name: 'SERVICE', total: rows.length, current: 0});
            var idx = _.findIndex($scope.files, {name: 'SERVICE'});

            if (rows.length) {
              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.DATE_SERV = moment(v.DATE_SERV).format('YYYYMMDD');
                obj.TIME_SERV = v.TIME_SERV;
                obj.BPS = v.BPS;
                obj.BPD = v.BPD;
                obj.WEIGHT = v.WEIGHT;
                obj.HEIGHT = v.HEIGHT;
                obj.CC = v.CC;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.DATE_SERV,
                  obj.TIME_SERV, obj.BPS, obj.BPD, obj.WEIGHT,
                  obj.HEIGHT, obj.CC, obj.UPDATED
                ].join('|') + '\n';
                  fs.appendFileSync(files.service, str);
                  $scope.files[idx].current++;
             });
           }

             var allHn = _.uniq(rows, 'HN');
             angular.forEach(allHn, function (v) {
               $scope.hn.push(v.HN);
             });

             var allSEQ = _.uniq(rows, 'SEQ');
             angular.forEach(allSEQ, function (v) {
               $scope.seq.push(v.SEQ);
             });

             return ExportServ.getPerson($scope.hn);
          })
          .then(function (rows) {
            if (rows.length) {
              $scope.files.push({name: 'PERSON', total: rows.length, current: 0});
              var idx = _.findIndex($scope.files, {name: 'PERSON'});

              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.CID = v.CID;
                obj.HN = v.HN;
                obj.FNAME = v.FNAME;
                obj.LNAME = v.LNAME;
                obj.BIRTH = moment(v.BIRTH).format('YYYYMMDD');
                obj.SEX = v.SEX;
                obj.TYPEAREA = v.TYPEAREA;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.CID, obj.HN, obj.FNAME,
                  obj.LNAME, obj.BIRTH, obj.SEX, obj.TYPEAREA,
                  obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.person, str);
                $scope.files[idx].current++;
             });

             return ExportServ.getDrug($scope.seq);
           }
          })
          .then(function (rows) {
            if (rows.length) {
              $scope.files.push({name: 'DRUG', total: rows.length, current: 0});
              var idx = _.findIndex($scope.files, {name: 'DRUG'});

              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.ICODE = v.ICODE;
                obj.QTY = v.QTY;
                obj.PRICE = v.PRICE;
                obj.DRUG_NAME = v.DRUG_NAME;
                obj.UNIT = v.UNIT;
                obj.STDCODE = v.STDCODE;
                obj.USAGE = v.USAGE;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.ICODE,
                  obj.QTY, obj.PRICE, obj.DRUG_NAME, obj.UNIT,
                  obj.STDCODE, obj.USAGE, obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.drug, str);
                $scope.files[idx].current++;

             });

             return ExportServ.getLab($scope.seq);
           }
          })
          .then(function (rows) {
            if (rows.length) {
              $scope.files.push({name: 'LAB', total: rows.length, current: 0});
              var idx = _.findIndex($scope.files, {name: 'LAB'});

              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.LNAME = v.LNAME;
                obj.LRESULT = v.LRESULT;
                obj.LUNIT = v.LUNIT;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.LNAME,
                  obj.LRESULT, obj.LUNIT, obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.lab, str);
                $scope.files[idx].current++;
             });

             return ExportServ.getDiag($scope.seq);
           }
          })
          .then(function (rows) {
            console.log(rows);
            if (rows.length) {
              $scope.files.push({name: 'DIAG', total: rows.length, current: 0});
              var idx = _.findIndex($scope.files, {name: 'DIAG'});

              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.DIAG_CODE = v.DIAG_CODE;
                obj.DIAG_TYPE = v.DIAG_TYPE;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.DIAG_CODE, obj.DIAG_TYPE, obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.diag, str);
                $scope.files[idx].current++;
             });
           }
          })

          .then(function (person) {
            LxProgressService.linear.hide();
            LxNotificationService.success('ส่งออกข้อมูลเสร็จเรียบร้อยแล้ว');
            $scope.isSuccess = true;
          }, function (err) {
            console.log(err);
            $scope.isSuccess = true;
            LxNotificationService.error('เกิดข้อผิดพลาด กรุณาดู Log');
            LxProgressService.linear.hide();
          });

      }
    });

})(window, window.angular);
