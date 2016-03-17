angular.module('ngWig')
  .component('ngWigEditable', {
    bindings: {
      onPaste: '=',
      name: '@',
      required: '<',
      editMode: '<',
      ngModel: '='
    },
    template: `<div tabindex="-1" ng-class="{'nw-invisible': $ctrl.editMode}" class="nw-editor__res" contenteditable></div>`,
    require: {
      ngModelController: '^ngModel'
    },
    controller: function($document, $scope, $element) {

      var $container = $element.find('div');

      this.$onInit = () => {
        //model --> view
        this.ngModelController.$render = () => $container.html(this.ngModelController.$viewValue || '');

        $container.bind(eventsToBind.join(' '), () => {
          //view --> model
          this.ngModelController.$setViewValue($container.html());
          $scope.$applyAsync();
        });
      };

      var eventsToBind = [
        'blur',
        'keyup',
        'change',
        'focus',
        'click'
      ];

      if (angular.isFunction(this.onPaste)) {
        $container.on('paste', (e) => {
          this.onPaste(e, $container.html()).then((val) => $container.html(val));
        });
      } else {
        eventsToBind.push('paste');
      }

      this.isEditorActive = () => $container[0] === $document[0].activeElement;

      $scope.$on('execCommand', (event, params) => {
        $container[0].focus();

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


      });

      $scope.$on('nw-disabled', (event, isDisabled) => $container.attr('contenteditable', !isDisabled));
    }
  });