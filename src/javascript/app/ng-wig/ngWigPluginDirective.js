angular.module('ngWig')
    .directive('ngWigPlugin', function ($compile) {
        return {
            restrict: 'E',
            link: function(scope, element) {
                var template = '<' + scope.button.pluginName + ' />',
                    compiled = $compile(template)(scope);

                element.replaceWith(compiled);
            }
        }
    });
