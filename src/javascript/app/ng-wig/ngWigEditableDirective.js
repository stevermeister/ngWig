angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var $document = $element[0].contentDocument,
            $body;
        $document.open();
        $document.write('<!DOCTYPE html><html><head>'+ (scope.cssPath ? ('<link href="'+ scope.cssPath +'" rel="stylesheet" type="text/css">') : '') + '</head><body contenteditable="true"></body></html>');
        $document.close();

        $body = angular.element($element[0].contentDocument.body);

        //model --> view
        ctrl.$render = function () {
          $body[0].innerHTML = ctrl.$viewValue || '';
        };

        //view --> model
        $body.bind('blur keyup change paste', function () {
          resizeEditor();
          scope.$apply(function blurkeyup() {
            ctrl.$setViewValue($body.html());
          });
        });

        scope.$on('execCommand', function (event, params) {
          var sel = $document.selection,
              command = params.command,
              options = params.options;
          if (sel) {
            var textRange = sel.createRange();
            $document.execCommand(command, false, options);
            textRange.collapse(false);
            textRange.select();
          }
          else {
            $document.execCommand(command, false, options);
          }
          $document.body.focus();
          //sync
          scope.$evalAsync(function () {
            ctrl.$setViewValue($body.html());
            resizeEditor();
          });
        });

        function resizeEditor() {
          if (!scope.autoexpand) {
            var height = scope.originalHeight;
          } else {
            height = angular.element($document.documentElement).outerHeight();
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
