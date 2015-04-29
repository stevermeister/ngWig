angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var document = $element[0].ownerDocument;

        $element.attr('contenteditable', true);

        //model --> view
        ctrl.$render = function () {
          $element.html(ctrl.$viewValue || '');
        };

        //view --> model
        function viewToModel() {
          resizeEditor();
          ctrl.$setViewValue($element.html());
        }

        $element.bind('blur keyup change paste', viewToModel);

        scope.$on('execCommand', function (event, params) {
          $element[0].focus();

            var ieStyleTextSelection = document.selection,
              command = params.command,
              options = params.options;

          if (ieStyleTextSelection) {
            var textRange = ieStyleTextSelection.createRange();
          }

          document.execCommand(command, false, options);

          if (ieStyleTextSelection) {
            textRange.collapse(false);
            textRange.select();
          }

          viewToModel();
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
