/*
 * Setting Controller
 */

(function (window, angular) {
    angular.module('app.controller.SettingCtrl', ['app.service.SettingServ'])
        .controller('SettingCtrl', function ($scope, SettingServ, LxNotificationService) {

            $scope.config = ipc.sendSync('get-config');

            // Save configure
            $scope.save = function () {
                if (!$scope.config.his.host) {
                    LxNotificationService.error('กรุณาระบุที่อยู่ของฐานข้อมูล HOSxP, HOSxP_PCU');
                } else if (!$scope.config.his.database) {
                    LxNotificationService.error('กรุณาระบุชื่อฐานข้อมูล')
                } else if (!$scope.config.his.user) {
                    LxNotificationService.error('กรุณาระบุชื่อผู้ใช้งานฐานข้อมูล');
                } else if (!$scope.config.his.password) {
                    LxNotificationService.error('กรุณาระบุรหัสผ่านฐานข้อมูล');
                } else if (!$scope.config.cloud.url) {
                    LxNotificationService.error('กรุณาระบุที่อยู่ของ Cloud Server');
                } else if (!$scope.config.cloud.key) {
                    LxNotificationService.error('กรุณาระบุ KEY สำหรับเชื่อมต่อ Cloud Server');
                } else if (!$scope.config.cloud.hospcode) {
                    LxNotificationService.error('กรุณาระบุ รหัสสถานบริการ สำหรับเชื่อมต่อ Cloud Server');
                } else {

                  SettingServ.saveConfig($scope.config) // Save setting
                    .then(function () { // Success
                      LxNotificationService.success('บันทึกการกำหนดค่าเสร็จเรียบร้อยแล้ว');
                    }, function (err) { // Error
                      console.log(err);
                      LxNotificationService.error('เกิดข้อผิดพลาด ไม่สามารถเขียนไฟล์ได้');
                    });

                }
            }

        });

})(window, window.angular);
