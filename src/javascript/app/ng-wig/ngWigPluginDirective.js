'use strict';

function directive($compile){
  return {
    restrict: 'E',
    link: function(scope, element) {
      var template = '<' + scope.button.pluginName + ' />',
          compiled = $compile(template)(scope);

      element.replaceWith(compiled);
    }
  };
}

directive.$inject = ['$compile'];

angular.module('ngWig').directive('ngWigPlugin', directive );
