angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var $document = $element[0].contentDocument,
            $body;
        $document.open();
        $document.write('<!DOCTYPE html><html style="height:100%"><head></head><body contenteditable="true" style="height:100%; margin: 0; padding: 8px;box-sizing: border-box;"></body></html>');
        $document.close();
        $body = angular.element($element[0].contentDocument.body);

        //model --> view
        ctrl.$render = function () {
          $body[0].innerHTML = ctrl.$viewValue || '';
        }

        //view --> model
        $body.bind('blur keyup change paste', function () {
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
          });
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