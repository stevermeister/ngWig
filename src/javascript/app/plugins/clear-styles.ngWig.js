angular.module('ngWig')
  .config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
    ngWigToolbarProvider.addCustomButton('clear-styles', 'nw-clear-styles-button');
  }])
  .component('nwClearStylesButton', {
    bindings: {
      editMode: '=',
      disabled: '=',
      content: '='
    },
    template: '<button ng-click="$ctrl.clearStyles($event)" ng-disabled="$ctrl.editMode || $ctrl.disabled" class="nw-button clear-styles" title="Clear Styles">Clear Styles</button>',
    controller: function() {
      this.clearStyles = function(e){
        // create a virutal element to manipulate the content of the editor
        let div = document.createElement('div')
        div.innerHTML = this.content;
        this.content = div.textContent;
      }
    }
  });

