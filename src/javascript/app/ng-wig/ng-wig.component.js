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

        if ($document[0].queryCommandSupported && !$document[0].queryCommandSupported(command)) {
          throw 'The command "' + command + '" is not supported';
        }

        if (command === 'createlink' || command === 'insertImage') {
          options = $window.prompt('Please enter the URL', 'http://');
          if (!options) {
            return;
          }
        }

        this.beforeExecCommand({command: command, options: options});

        // use insertHtml for `createlink` command to account for IE/Edge purposes, in case there is no selection
        let selection = $document[0].getSelection().toString();
        if(command === 'createlink' && selection === ''){
          $document[0].execCommand('insertHtml', false, '<a href="' + options + '" target="_blank">' + options + '</a>');
        }
        else{
          $document[0].execCommand(command, false, options);
        }

        this.afterExecCommand({command: command, options: options});

        // added temporarily to pass the tests. For some reason $container[0] is undefined during testing.
        if($container.length){
          $container[0].focus();
        }
      };

      this.$onInit = () => {
        this.toolbarButtons = ngWigToolbar.getToolbarButtons(this.buttons && string2array(this.buttons));

        let placeholder = Boolean(this.placeholder);

        this.ngModelController.$render = () => this.ngModelController.$viewValue
          ? $container.html(this.ngModelController.$viewValue)
          : placeholder ? $container.empty()
          : $container.html('<p></p>');

        $container.bind('blur keyup change focus click', () => {
          //view --> model
          if (placeholder && (!$container.html().length || $container.html() === "<br>")) $container.empty();
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
