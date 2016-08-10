angular.module('ngWig')
  .component('ngWig', {
    bindings: {
      content: '=ngModel',
      options: '<?',
      onPaste: '&',
      buttons: '@',
      beforeExecCommand: '&',
      afterExecCommand: '&' ,
      placeholder: '@?'
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
      this.placeholder = $attrs.placeholder;
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

        if (command === 'createlink' || command === 'insertImage') {
          options = $window.prompt('Please enter the URL', 'http://');
          if (!options) {
            return;
          }
        }
        this.beforeExecCommand({command: command, options: options});
        this.execute(command, options);
        this.afterExecCommand({command: command, options: options});
      };

      this.$onInit = () => {
        let placeholder = Boolean(this.placeholder);
        this.ngModelController.$render = () =>  !placeholder ? $container.html(this.ngModelController.$viewValue || '<p></p>') : $container.empty();

        $container.bind('blur keyup change focus click', () => {
          //view --> model
          if (placeholder && !$container.html().length || placeholder && $container.html() === "<br>") $container.empty();
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

      this.execute = (command, options) => {
        let selection = $document[0].getSelection().toString();

        $container[0].focus();

        if ($document[0].queryCommandSupported && !$document[0].queryCommandSupported(command)) {
          throw 'The command "' + command + '" is not supported';
        }

        // use insertHtml for `createlink` command to account for IE/Edge purposes, in case there is no selection
        if(command === 'createlink' && selection === ''){
          $document[0].execCommand('insertHtml', false, '<a href="' + options + '">' + options + '</a>');
        }
        else{
          $document[0].execCommand(command, false, options);
        }
      };

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
