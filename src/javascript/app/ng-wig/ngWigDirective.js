angular.module('ngWig').directive('ngWig', function () {

      return {
        scope: {
          content: '=ngWig',
          debug: '&'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'ng-wig/views/ng-wig.html',
        link: function (scope, element, attrs) {

          scope.originalHeight = element.outerHeight();
          scope.editMode = false;
          scope.autoexpand = 'autoexpand' in attrs;

          scope.toggleEditMode = function() {
            scope.editMode ^= 1;
          };

          scope.execCommand = function (command, options) {
            if(command ==='createlink'){
              options = prompt('Please enter the URL', 'http://');
            }
            scope.$emit('execCommand', {command: command, options: options});
          };

          scope.resizeEditor = function(height) {
            element.find('.nw-editor').outerHeight(height, true);
          }
        }
      }
    }
);

