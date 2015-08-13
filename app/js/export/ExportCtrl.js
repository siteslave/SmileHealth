(function (window, angular) {

  angular.module('app.controller.ExportCtrl', ['app.service.ExportServ'])
    .controller('ExportCtrl', function ($scope, ExportServ, LxProgressService, LxNotificationService) {

      // Check extract dir
      var homeDir = ipc.sendSync('get-home-dir');
      //console.log(homeDir);
      var exportDir = path.join(homeDir, 'export');
      var zipDir = path.join(homeDir, 'zip');

      $scope.waitingFiles = [];
      // remove old file
      fse.removeSync(exportDir);
      // Check or create extract directory
      fse.ensureDirSync(exportDir);
      fse.ensureDirSync(zipDir);

      // disabled button
      $scope.isSuccess = true;

      $scope.getWaitingFiles = function () {
        fs.readdir(zipDir, function (err, files) {
          if (err) return;
          _.forEach(files, function (file) {
            var obj = {};
            obj.name = file;
            obj.path = path.join(zipDir, file);
            $scope.waitingFiles.push(obj);
          });
        });
      };

      // Get waiting files
      $scope.getWaitingFiles();

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
          'DRUG_NAME', 'UNIT', 'STDCODE', 'USAGE_NAME', 'D_UPDATED'
        ].join('|') + '\n';

        headers.lab = [
          'HOSPCODE', 'HN', 'SEQ', 'LCODE', 'LNAME', 'LRESULT', 'LUNIT', 'D_UPDATED'
        ].join('|') + '\n';

        headers.diag = [
          'HOSPCODE', 'HN', 'SEQ', 'DIAG_CODE', 'DIAG_TYPE', 'D_UPDATED'
        ].join('|') + '\n';

        headers.proced = [
          'HOSPCODE', 'HN', 'SEQ', 'PROCED', 'PRICE', 'D_UPDATED'
        ].join('|') + '\n';

        headers.charge = [
          'HOSPCODE', 'HN', 'SEQ', 'CHARGE_CODE', 'CHARGE_NAME', 'QTY', 'PRICE', 'D_UPDATED'
        ].join('|') + '\n';

       var files = [];
       files.service = path.join(exportDir, 'service.txt');
       files.person = path.join(exportDir, 'person.txt');
       files.drug = path.join(exportDir, 'drug.txt');
       files.lab = path.join(exportDir, 'lab.txt');
       files.diag = path.join(exportDir, 'diag.txt');
       files.proced = path.join(exportDir, 'proced.txt');
       files.charge = path.join(exportDir, 'charge.txt');

       $scope.files.push({name: 'SERVICE', total: 0, current: 0, success: false});
       $scope.files.push({name: 'PERSON', total: 0, current: 0, success: false});
       $scope.files.push({name: 'DRUG', total: 0, current: 0, success: false});
       $scope.files.push({name: 'LAB', total: 0, current: 0, success: false});
       $scope.files.push({name: 'DIAG', total: 0, current: 0, success: false});
       $scope.files.push({name: 'PROCED', total: 0, current: 0, success: false});
       $scope.files.push({name: 'CHARGE', total: 0, current: 0, success: false});
       // Create header
       fs.writeFileSync(files.service, headers.service);
       fs.writeFileSync(files.person, headers.person);
       fs.writeFileSync(files.drug, headers.drug);
       fs.writeFileSync(files.lab, headers.lab);
       fs.writeFileSync(files.diag, headers.diag);
       fs.writeFileSync(files.proced, headers.proced);
       fs.writeFileSync(files.charge, headers.charge);

        var promise = ExportServ.getHospcode()
          .then(function (hospcode) {
            $scope.hospcode = hospcode;
            return ExportServ.getService(start, end);
          })
          .then(function (rows) {

            // Create service file
            var idx = _.findIndex($scope.files, {name: 'SERVICE'});
            $scope.files[idx].total = _.size(rows);
            if (_.size(rows)) {
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

             $scope.files[idx].success = true;
             return ExportServ.getPerson($scope.hn);
          })
          .then(function (rows) {
            var idx = _.findIndex($scope.files, {name: 'PERSON'});

            if (_.size(rows)) {
              $scope.files[idx].total = _.size(rows);
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
           }
           $scope.files[idx].success = true;
           return ExportServ.getDrug($scope.seq);
          })
          .then(function (rows) {
            var idx = _.findIndex($scope.files, {name: 'DRUG'});
            if (_.size(rows)) {
              $scope.files[idx].total = _.size(rows);
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
           }
           $scope.files[idx].success = true;
           return ExportServ.getLab($scope.seq);
          })
          .then(function (rows) {
            var idx = _.findIndex($scope.files, {name: 'LAB'});

            if (_.size(rows)) {
              $scope.files[idx].total = _.size(rows);

              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.LCODE = v.LCODE;
                obj.LNAME = v.LNAME;
                obj.LRESULT = v.LRESULT;
                obj.LUNIT = v.LUNIT;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.LCODE, obj.LNAME,
                  obj.LRESULT, obj.LUNIT, obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.lab, str);
                $scope.files[idx].current++;
             });
           }

           $scope.files[idx].success = true;
           return ExportServ.getDiag($scope.seq);
          })
          .then(function (rows) {
            var idx = _.findIndex($scope.files, {name: 'DIAG'});
            if (_.size(rows)) {
              $scope.files[idx].total = _.size(rows);
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
           $scope.files[idx].success = true;
           return ExportServ.getProced($scope.seq);
          })
          .then(function (rows) {
            var idx = _.findIndex($scope.files, {name: 'PROCED'});
            if (_.size(rows)) {
              $scope.files[idx].total = _.size(rows);
              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.PROCED = v.PROCED;
                obj.PRICE = v.PRICE;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.PROCED, obj.PRICE, obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.proced, str);
                $scope.files[idx].current++;
             });
           }
           $scope.files[idx].success = true;
           return ExportServ.getCharge($scope.seq);
          })
          .then(function (rows) {
            var idx = _.findIndex($scope.files, {name: 'CHARGE'});
            if (_.size(rows)) {
              $scope.files[idx].total = _.size(rows);
              _.forEach(rows, function (v) {
                var obj = {};
                obj.HOSPCODE = $scope.hospcode;
                obj.HN = v.HN;
                obj.SEQ = v.SEQ;
                obj.CHARGE_CODE = v.CHARGE_CODE;
                obj.CHARGE_NAME = v.CHARGE_NAME;
                obj.QTY = v.QTY;
                obj.PRICE = v.PRICE;
                obj.UPDATED = moment().format('YYYYMMDDHHmmss')

                var str = [
                  obj.HOSPCODE, obj.HN, obj.SEQ, obj.CHARGE_CODE, obj.CHARGE_NAME,
                  obj.QTY, obj.PRICE, obj.UPDATED
                ].join('|') + '\n';

                fs.appendFileSync(files.charge, str);
                $scope.files[idx].current++;
             });
           }
           $scope.files[idx].success = true;
           return;
          })
          .then(function () {

            var strZipFile = 'KHOS-' + $scope.hospcode + '-' + moment().format('YYYYMMDDHHmmss') + '.zip';
            var zipFile = path.join(zipDir, strZipFile);

            //return ExportServ.createZip(files, zipFile);

            LxProgressService.linear.hide();
            $scope.isSuccess = true;

            var JSZip = require('jszip');
            var zip = new JSZip();

            zip.file('person.txt', fs.readFileSync(files.person));
            zip.file('service.txt', fs.readFileSync(files.service));
            zip.file('diag.txt', fs.readFileSync(files.diag));
            zip.file('drug.txt', fs.readFileSync(files.drug));
            zip.file('proced.txt', fs.readFileSync(files.proced));
            zip.file('charge.txt', fs.readFileSync(files.charge));
            zip.file('lab.txt', fs.readFileSync(files.lab));

            var buffer = zip.generate({type: "nodebuffer"});
            fs.writeFile(zipFile, buffer, function (err) {
              if (err) {
                console.log(err);
              } else {
                $scope.waitingFiles.push({name: strZipFile, path: zipFile});
                LxNotificationService.success('ส่งออกข้อมูลเสร็จเรียบร้อยแล้ว');
              }
            });

          }, function (err) {
            console.log(err);
            $scope.isSuccess = true;
            LxNotificationService.error('เกิดข้อผิดพลาด กรุณาดู Log');
            LxProgressService.linear.hide();
          });

      };// end doExport()

      // Remove zip file
      $scope.removeZipFile = function (file, idx) {
        LxNotificationService.confirm('ยืนยันการลบ', 'คุณต้องการลบไฟล์นี้ ใช่หรือไม่?',
        {ok: 'ใช่, ฉันต้องการลบ', cancel: 'ไม่ใช่'},
        function (res) {
          if (res) {
            fse.removeSync(file);
            $scope.waitingFiles.splice(idx, 1);
          }
        });
      };

      // Upload file
      $scope.upload = function (file, idx) {
        // Requirement
        var request = require('request');
        // Get configure
        var config = ipc.sendSync('get-config');
        // Show progress bar
        LxProgressService.linear.show('#E91E63', '#progress');

        LxNotificationService.confirm('ยืนยันการอัปโหลด', 'คุณต้องการอัปโหลดไฟล์นี้ ใช่หรือไม่?', {
          ok: 'ใช่, ฉันต้องการอัปโหลด',
          cancel: 'ไม่ใช่'
        }, function (res) {
          if (res) {
            // Get hospital code
            ExportServ.getHospcode()
            .then(function (hospcode) {
              var _hospcode = hospcode;
              // Form data
              var formData = {
                hospcode: _hospcode,
                key: config.cloud.key,
                files: fs.createReadStream(file)
              };
              // Do upload file
              request.post({
                url: config.cloud.url + '/upload',
                formData: formData
              }, function (err) {
                if (err) { // Error
                  console.log(err);
                  LxNotificationService.error('ไม่สามารถอัปโหลดไฟล์ได้');
                  LxProgressService.linear.hide();
                } else { // Success
                  LxNotificationService.success('อัปโหลดไฟล์เสร็จเรียบร้อยแล้ว');
                  LxProgressService.linear.hide();
                  fse.removeSync(file);
                  $scope.waitingFiles.splice(idx, 1);
                }
              });

            });
          }
        });

      };
    });

})(window, window.angular);
