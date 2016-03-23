angular.module('ngWig')
  .component('ngWig', {
    bindings: {
      content: '=ngModel',
      onPaste: '&'
    },
    templateUrl: 'ng-wig/views/ng-wig.html',
    controller: function($scope, $element, $q, $attrs, $window, $document, ngWigToolbar) {

      //TODO: clean-up this attrs solution
      this.name = $attrs.name;
      $element.removeAttr('name');
      this.required = !!$attrs.required;
      this.isSourceModeAllowed = Object.keys($attrs).indexOf('sourceModeAllowed') !== -1 ? true : false;
      this.editMode = false;
      this.toolbarButtons = ngWigToolbar.getToolbarButtons($attrs.buttons && string2array($attrs.buttons));
      if ($attrs.ngDisabled != null || $attrs.disabled != null) {
        $scope.$watch(function() {
          return !!$attrs.disabled;
        }, (isDisabled) => {
          this.disabled = isDisabled;
          $scope.$broadcast('nw-disabled', isDisabled);
        });
      }
      
      this.onPastePromise = (event) => {

        let pasteContent = (event.originalEvent || event).clipboardData.getData('text/plain');

        if(!this.onPaste){
          return $q.resolve(pasteContent);
        }
        
        return $q.resolve(this.onPaste({$event: event, pasteContent: pasteContent}));
      };

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
        $scope.$broadcast('execCommand', {command: command, options: options});
      };

      //TODO: check the function
      function string2array(keysString) {
        return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
      }
    }
  });


