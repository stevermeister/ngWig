angular.module('ngWig')
  .directive('ngWigEditable', function ($document) {
    function init(scope, $element, attrs, ngModelController) {

      $element.attr('contenteditable', true);

      //model --> view
      ngModelController.$render = function () {
        $element.html(ngModelController.$viewValue || '');
      };

      //view --> model
      function viewToModel() {
        ngModelController.$setViewValue($element.html());
      }

      if (angular.isFunction(scope.onPaste)) {
        $element.on('paste', function(e) {
          scope.onPaste(e).then(function(val) {
            $element.html(val);
          })
        });
      }

      $element.bind('blur keyup change focus click', function() {
        viewToModel();
        scope.$applyAsync();
      });

      scope.isEditorActive = function () {
        return $element[0] === $document[0].activeElement;
      };

      scope.$on('execCommand', function (event, params) {
        $element[0].focus();

        var ieStyleTextSelection = $document[0].selection,
          command = params.command,
          options = params.options;

        if (ieStyleTextSelection) {
          var textRange = ieStyleTextSelection.createRange();
        }

        if ($document[0].queryCommandSupported && !$document[0].queryCommandSupported(command)) {
          throw 'The command "' + command + '" is not supported';
        }

        $document[0].execCommand(command, false, options);

        if (ieStyleTextSelection) {
          textRange.collapse(false);
          textRange.select();
        }

        viewToModel();
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
