angular.module('ngWig').directive('ngWig', function () {

      return {
        scope: {
          content: '=ngWig',
          debug: '&'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'javascript/app/ng-wig/view/ng-wig.html',
        link: function (scope) {
          scope.editMode = false;

          scope.execCommand = function (command, options) {
            scope.$emit('execCommand', {command: command, options: options});
          }
        }
      }
    }
);

