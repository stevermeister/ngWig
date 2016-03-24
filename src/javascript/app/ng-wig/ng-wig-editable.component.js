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
    controller: function($timeout, $document, $scope, $element) {

      var $container = $element.find('div');

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
        let pasteContent = (event.originalEvent || event).clipboardData.getData('text/plain');
        event.preventDefault();
        this.onPaste(event, pasteContent).then((pasteText) => {
          pasteHtmlAtCaret(pasteText);
        });
      });

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