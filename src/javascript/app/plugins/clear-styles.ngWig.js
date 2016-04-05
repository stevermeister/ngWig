angular.module('ngWig')
  .config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
    ngWigToolbarProvider.addCustomButton('clear-styles', 'nw-clear-styles-button');
  }])
  .component('nwClearStylesButton', {
    template: '<button ng-click="clearStyles()" ng-disabled="editMode" class="nw-button clear-styles" title="Clear Styles" ng-disabled="isDisabled">Clear Styles</button>',
    controller: function($scope) {
      $scope.clearStyles = function(){
          var container = angular.element(document.querySelector('#ng-wig-editable'));
          if(container){
              container.text(container[0].textContent);
              container[0].focus();
          }
      }
    }
  });

