angular.module('ngWig')
  .directive('ngWig', function ($window, $document, ngWigToolbar) {

    return {
      scope: {
        content: '=ngWig',
        onPaste: '='
      },
      restrict: 'A',
      replace: true,
      templateUrl: 'ng-wig/views/ng-wig.html',
      link: function (scope, element, attrs) {
        scope.formElementName = attrs.name;
        element.removeAttr('name');
        scope.isRequired = !!attrs.required;
        scope.editMode = false;
        scope.toolbarButtons = ngWigToolbar.getToolbarButtons(attrs.buttons && string2array(attrs.buttons));

        function string2array(keysString){
          return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
        }

        scope.toggleEditMode = function () {
          scope.editMode = !scope.editMode;

          if ($window.getSelection().removeAllRanges) {
            $window.getSelection().removeAllRanges();
          }
        };

        scope.execCommand = function (command, options) {
          if(scope.editMode ) return false;

          if (command === 'createlink') {
            options = prompt('Please enter the URL', 'http://');
            if(!options) {
              return;
            }
          }
          scope.$broadcast('execCommand', {command: command, options: options});
        };
      }
    }
  }
);

