(function (window, angular) {
  angular.module('app.controller.LabCtrl', ['app.service.LabServ'])
  .controller('LabCtrl', function ($scope, LabServ, LxNotificationService, LxDialogService) {
    $scope.orderDate = new Date();
    $scope.orders = [];

    $scope.getList = function () {
      var _orderDate = moment($scope.orderDate).format('YYYY-MM-DD');

      LabServ.getList(_orderDate)
      .then(function (rows) {
        $scope.orders = rows;
      }, function (err) {
        console.log(err);
        LxNotificationService.error('เกิดข้อผิดพลาด');
      })
    }; // $scope.getList();

    $scope.showSearchLab = function () {
      LxDialogService.open('mdlSearchLab');
    };

    $scope.getList();
  })
})(window, window.angular);
