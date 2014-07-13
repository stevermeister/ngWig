angular.module('myapp', ['ngWig']).
   controller('demoController', ['$scope', '$log', function($scope, $log) {
      $scope.text1 = '<p><i>This is really simple WYSIWYG for AngularJS!</i></p>';
      $scope.text2 = '<p><i>This is really simple WYSIWYG for AngularJS!</i></p>';
      $scope.debug = false;
    }]);