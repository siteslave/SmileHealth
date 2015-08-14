(function (window, angular) {

  angular.module('app.controller.EmrCtrl', ['app.service.EmrServ'])
  .controller('EmrCtrl', function ($scope, $stateParams, EmrServ, $filter,
    LxProgressService, LxNotificationService) {
    //console.log($stateParams);

    $scope.services = [];
    $scope.isShowService = false;

    $scope.getInfo = function () {
      LxProgressService.circular.show('#E91E63', '#progress');
      EmrServ.getInfo($stateParams.hn)
      .then(function (person) {
        $scope.fullname = person.pname + person.fname + ' ' + person.lname;
        $scope.birth = $filter('toThaiDate')(person.birthdate);
        $scope.age = $filter('countAge')(person.birthdate);
        $scope.sex = person.sex == '1' ? 'ชาย' : 'หญิง';
        $scope.address = person.address + ' หมู่ ' + person.village_moo + ' ' + person.village_name;
        $scope.typearea = person.house_regist_type_id + ' - ' + person.house_regist_type_name;

        return EmrServ.getServiceList($stateParams.cid);
      })
      .then(function (data) {
        if (data.ok) {
          $scope.services = data.rows;
          LxProgressService.circular.hide();
        } else {
          if (angular.isObject(data.msg)) {
            LxNotificationService.error('เกิดข้อผิดพลาด กรุณาดู Log');
            LxProgressService.circular.hide();
          } else {
            LxNotificationService.error(data.msg);
            LxProgressService.circular.hide();
          }
        }
      }, function (err) {
        console.log(err);
        LxNotificationService.error('เกิดข้อผิดพลาด กรุณาดู Log');
        LxProgressService.circular.hide();
      });
    }; //Get info

    $scope.getServiceDetail = function (service_hospcode, hn, date_serv, seq) {
      var strDateServ = moment(date_serv).format('YYYY-MM-DD');

      EmrServ.getServiceDetail(service_hospcode, hn, strDateServ, seq)
      .then(function (data) {
        if (data.ok) {
          var items = data.rows.detail;
          $scope.cc = items.cc;
          $scope.weight = items.weight;
          $scope.height = items.height;
          $scope.bp = items.bps + '/' + items.bpd;
          $scope.hospcode = items.hospcode;
          $scope.hospname= items.hospname;

          $scope.diags = data.rows.diag;
          $scope.proced = data.rows.proced;
          $scope.drug = data.rows.drug;
          $scope.lab = data.rows.lab;
          $scope.charge = data.rows.charge;

          LxProgressService.circular.hide();
          $scope.isShowService = true;
        } else {
          if (angular.isObject(data.msg)) {
            LxNotificationService.error('เกิดข้อผิดพลาด กรุณาดู Log');
            LxProgressService.circular.hide();
          } else {
            LxNotificationService.error(data.msg);
            LxProgressService.circular.hide();
          }
        }

      })
    }

    $scope.getInfo();

  });

})(window, window.angular);
