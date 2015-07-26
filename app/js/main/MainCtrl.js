angular.module('app.controller.Main', ['app.service.Main'])
  .controller('MainCtrl', function ($scope, MainSrv, LxNotificationService, LxProgressService) {

    $scope.clinics = [
      {name: 'คลินิคโรคเรื้อรัง'},
      {name: 'คลินิคส่งเสริมสุขภาพ'},
      {name: 'คลินิคแพทย์แผนไทย'}
    ];

    $scope.items = [];

    $scope.selectedClinic = { name: 'คลินิคส่งเสริมสุขภาพ'};
    $scope.startDate = new Date();
    $scope.endDate = new Date();

    $scope.getList = function () {
      LxProgressService.circular.show('#E91E63', '#progress');
      var serviceDate = moment($scope.serviceDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
      MainSrv.getServiceList(serviceDate)
        .then(function (rows) {
          $scope.items = rows;
          LxProgressService.circular.hide();
        }, function (err) {
          LxNotificationService.error('เกิดข้อผิดพลาดในการติดต่อฐานข้อมูล');
          LxProgressService.circular.hide();
          console.log(err);
        });
    }

  });
