angular.module('ngWig')
    .config(['ngWigToolbarProvider', function (ngWigToolbarProvider) {
       ngWigToolbarProvider.addCustomButton('forecolor', 'nw-forecolor-button');
    }])
    .directive('nwForecolorButton', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<li class="nw-toolbar__item"><button colorpicker ng-model="fontcolor" colorpicker-position="right" class="nw-button" title="Font Color"><i class="fa fa-font"></i></button></li>',
            link: function (scope) {
                scope.$on("colorpicker-selected", function ($event, color) {
                    scope.execCommand('foreColor', color.value);
                });
            }
        };
    });

