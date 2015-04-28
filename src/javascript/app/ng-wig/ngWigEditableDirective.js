angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var document = $element[0].ownerDocument;

        $element.attr('contenteditable', true);

        //model --> view
        ctrl.$render = function () {
          $element.html(ctrl.$viewValue || '');
        };

        //view --> model
        $element.bind('blur keyup change paste', function () {
          resizeEditor();
          scope.$apply(function blurkeyup() {
            ctrl.$setViewValue($element.html());
          });
        });

        scope.$on('execCommand', function (event, params) {
          $element[0].focus();

            var sel = document.selection,
              command = params.command,
              options = params.options;

          if (sel) {
            var textRange = sel.createRange();
          }

          document.execCommand(command, false, options);

          if (sel) {
            textRange.collapse(false);
            textRange.select();
          }

          //sync
          scope.$evalAsync(function () {
            ctrl.$setViewValue($element.html());
            resizeEditor();
          });
        });

        function resizeEditor() {
          if (!scope.autoexpand) {
            var height = scope.originalHeight;
          } else {
            height = $element.outerHeight();
          }
          scope.resizeEditor(height);
        }

        scope.$watch('autoexpand', resizeEditor);
        scope.$watch('editMode', function(oldMode, newMode) {
          if (newMode) {
            resizeEditor();
          }
        });
      }

      return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        link: init
      }
    }
);
