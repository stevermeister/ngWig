'use strict';

function directive($document) {
  function init(scope, element, attrs, ngModelController) {
    element.attr('contenteditable', true);

    //model --> view
    ngModelController.$render = function () {
      element.html(ngModelController.$viewValue || '');
    };

    //view --> model
    function viewToModel() {
      ngModelController.$setViewValue(element.html());
    }

    var eventsToBind = [
      'blur',
      'keyup',
      'change',
      'focus',
      'click'
    ];

    if (angular.isFunction(scope.onPaste)) {
      element.on('paste', function(e) {
        scope.onPaste(e, element.html()).then(function(val) {
          element.html(val);
        });
      });
    }else{
      eventsToBind.push('paste');
    }

    element.bind(eventsToBind.join(' '), function() {
      viewToModel();
      scope.$applyAsync();
    });

    scope.isEditorActive = function () {
      return element[0] === $document[0].activeElement;
    };

    scope.$on('execCommand', function (event, params) {
      element[0].focus();

      var ieStyleTextSelection = $document[0].selection,
          command = params.command,
          options = params.options;

      if ($document[0].queryCommandSupported && !$document[0].queryCommandSupported(command)) {
        throw 'The command "' + command + '" is not supported';
      }

      $document[0].execCommand(command, false, options);

      if (ieStyleTextSelection && textRange) {
        var textRange = ieStyleTextSelection.createRange();
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
  };
}

directive.$inject = ['$document'];

angular.module('ngWig')
  .directive('ngWigEditable', directive);
