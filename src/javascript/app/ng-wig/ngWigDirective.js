angular.module('ngWig')
    .directive('ngWig', function () {

    return {
      scope: {
        content: '=ngWig'
      },
      restrict: 'A',
      replace: true,
      templateUrl: 'ng-wig/views/ng-wig.html',
      link: function (scope, element, attrs) {

        scope.editMode = false;
        scope.autoexpand = !('autoexpand' in attrs) || attrs['autoexpand'] !== 'off';

        scope.toggleEditMode = function () {
          scope.editMode = !scope.editMode;
        };

        scope.execCommand = function (command, options) {
          if (command === 'createlink') {
            options = prompt('Please enter the URL', 'http://');
          }

          if(options) {
            scope.$emit('execCommand', {command: command, options: options});
          }
        };

        scope.styles = [
          {name: 'Normal text', value: 'p'},
          {name: 'Header 1', value: 'h1'},
          {name: 'Header 2', value: 'h2'},
          {name: 'Header 3', value: 'h3'}
        ];

        scope.style = scope.styles[0];

        scope.$on("colorpicker-selected", function ($event, color) {
          scope.execCommand('foreColor', color.value);
        });
      }
    }
});

