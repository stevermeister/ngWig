angular.module('ngWig')
  .directive('ngWig', function (ngWigToolbar) {

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
        scope.toolbarButtons = ngWigToolbar.getToolbarButtons(attrs.buttons && string2array(attrs.buttons));

        function string2array(keysString){
          return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
        }

        scope.toggleEditMode = function () {
          scope.editMode = !scope.editMode;

          if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
          }

          scope.updateButtonsState();
        };

        scope.execCommand = function (command, options) {
          if (command === 'createlink') {
            options = prompt('Please enter the URL', 'http://');
            if(!options) {
              return;
            }
          }
          scope.$broadcast('execCommand', {command: command, options: options});
        };

        scope.updateButtonsState = function () {
          scope.toolbarButtons.forEach(function(button) {
            button.isActive = false;
            if(button.command && document.queryCommandState(button.command)) {
              button.isActive = true;
            }
          });
        };
      }
    }
  }
);

