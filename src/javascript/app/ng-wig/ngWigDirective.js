angular.module('ngWig').directive('ngWig', function () {

      return {
        scope: {
          content: '=ngWig',
          debug: '&',
          cssPath: '@'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'ng-wig/views/ng-wig.html',
        link: function (scope, element, attrs) {

          scope.originalHeight = element.outerHeight();
          scope.editMode = false;
          scope.autoexpand = !('autoexpand' in attrs) || attrs['autoexpand'] !== 'off';
          scope.cssPath = scope.cssPath ? scope.cssPath : 'css/ng-wig.css';

          scope.toggleEditMode = function() {
            scope.editMode = !scope.editMode;
          };

          scope.execCommand = function (command, options) {
            if(command ==='createlink'){
              options = prompt('Please enter the URL', 'http://');
            }
            scope.$emit('execCommand', {command: command, options: options});
          };

          scope.resizeEditor = function(height) {
            var children = element.children();
            for (var i in children) {
              var child = children.eq(i);
              if (child.hasClass('nw-editor')) {
                child.outerHeight(height);
                break;
              }
            }

          }
        }
      }
    }
);

