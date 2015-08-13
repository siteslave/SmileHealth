(function (window, angular) {

  angular.module('app.controller.EmrCtrl', [])
  .controller('EmrCtrl', function ($scope, $stateParams) {
    console.log($stateParams);

    $scope.fullname = 'สถิตย์  เรียนพิศ';
    $scope.birth = '23 สิงหาคม 2523';
    $scope.age = 20;
    $scope.sex = 'ชาย';
    $scope.cc = 'มาตามนัด (ตรวจเบาหวาน/ความดัน)';
    $scope.weight = 60;
    $scope.height = 165;
    $scope.bp = '120/70';

    $scope.hospcode = '10707';
    $scope.hospname= 'โรงพยาบาลมหาสารคาม';
    $scope.address = '44 หมู่ 24 ต.นาสีนวน อ.กันทรวิชัย จ.มหาสารคาม';
  });

})(window, window.angular);
