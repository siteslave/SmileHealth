// Application filters
(function (window, angular) {
  
  angular.module('app.filter', [])
    // Convert system date to thai date
    .filter('toThaiDate', function () {
      return function (date) {
        var year = moment(date).get('year') + 543;
        return moment(date).format('DD/MM/') + year;
      }
    })
    // Substring 
    .filter('toShortString', function () {
      return function (str, lng) {
        var strLenght = !lng ? 60 : lng;
        return str.length > strLenght ? str.substring(0, strLenght) + '...' : str;
      }
    });

})(window, window.angular);
