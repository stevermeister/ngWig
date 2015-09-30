angular.module('ngWig')
    .config(['ngWigToolbarProvider', function (ngWigToolbarProvider) {
       ngWigToolbarProvider.addCustomButton('forecolor', 'nw-forecolor-button');
    }])
    .directive('nwForecolorButton', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<button colorpicker ng-model="fontcolor" ng-disabled="editMode" colorpicker-position="right" class="nw-button" title="Font Color"><i class="fa fa-font"></i></button>',
            link: function (scope) {
                scope.$on("colorpicker-selected", function ($event, color) {
                    scope.execCommand('foreColor', color.value);
                });
            }
        };
    });

