angular.module('ngWig')
  .component('ngWig', {
    bindings: {
      content: '=ngModel',
      options: '<?',
      onPaste: '&',
      buttons: '@',
      beforeExecCommand: '&',
      afterExecCommand: '&'
    },
    require: {
      ngModelController: 'ngModel'
    },
    templateUrl: 'ng-wig/views/ng-wig.html',
    controller: function($scope, $element, $q, $attrs, $window, $document, ngWigToolbar) {

      var $container = angular.element($element[0].querySelector('#ng-wig-editable'));

      //TODO: clean-up this attrs solution
      this.required = 'required' in $attrs;
      this.isSourceModeAllowed = 'sourceModeAllowed' in $attrs;
      this.editMode = false;
      this.toolbarButtons = ngWigToolbar.getToolbarButtons(this.buttons && string2array(this.buttons));
      $attrs.$observe('disabled', (isDisabled) => {
        this.disabled = isDisabled;
        $container.attr('contenteditable', !isDisabled);
      });
      this.isEditorActive = () => $container[0] === $document[0].activeElement;
      this.toggleEditMode = () => {
        this.editMode = !this.editMode;
        if ($window.getSelection().removeAllRanges) {
          $window.getSelection().removeAllRanges();
        }
      };

      this.execCommand = (command, options) => {
        if (this.editMode) return false;

        if (command === 'createlink') {
          options = $window.prompt('Please enter the URL', 'http://');
          if (!options) {
            return;
          }
        }
        this.beforeExecCommand({command: command, options: options});
        $scope.$broadcast('execCommand', {command: command, options: options});
        this.afterExecCommand({command: command, options: options});
      };

      this.$onInit = () => {
        //model --> view
        this.ngModelController.$render = () => $container.html(this.ngModelController.$viewValue || '');

        $container.bind('blur keyup change focus click', () => {
          //view --> model
          this.ngModelController.$setViewValue($container.html());
          $scope.$applyAsync();
        });
      };

      $container.on('paste', (event) => {
        if(!$attrs.onPaste){
          return;
        }

        let pasteContent;
        if (window.clipboardData && window.clipboardData.getData) { // IE
          pasteContent = window.clipboardData.getData('Text');
        }
        else{
          pasteContent = (event.originalEvent || event).clipboardData.getData('text/plain');
        }
        event.preventDefault();
        $q.when(this.onPaste({$event: event, pasteContent: pasteContent})).then((pasteText) => {
          pasteHtmlAtCaret(pasteText);
        });
      });

      $scope.$on('execCommand', (event, params) => {
        event.stopPropagation && event.stopPropagation();
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

    }
  });


//TODO: check the function
function string2array(keysString) {
  return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
}


//TODO: put contenteditable helper into service
function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(), node, lastNode;
      while ( (node = el.firstChild) ) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}