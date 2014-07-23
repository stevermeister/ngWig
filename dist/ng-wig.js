angular.module('ngWig', ['ngwig-app-templates']);




angular.module('ngWig').directive('ngWig', function () {

      return {
        scope: {
          content: '=ngWig',
          debug: '&'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'ng-wig/views/ng-wig.html',
        link: function (scope) {
          scope.editMode = false;

          scope.execCommand = function (command, options) {
            scope.$emit('execCommand', {command: command, options: options});
          }
        }
      }
    }
);


angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var $document = $element[0].contentDocument,
            $body;
        $document.open();
        $document.write('<!DOCTYPE html><html><head></head><body contenteditable="true"></body></html>');
        $document.close();
        $body = angular.element($element[0].contentDocument.body);

        //model --> view
        ctrl.$render = function () {
          $body[0].innerHTML = ctrl.$viewValue || '';
        }

        //view --> model
        $body.bind('blur keyup change paste', function () {
          scope.$apply(function blurkeyup() {
            ctrl.$setViewValue($body.html());
          });
        });

        scope.$on('execCommand', function (event, params) {
          var sel = $document.selection,
              command = params.command,
              options = params.options;
          if (sel) {
            var textRange = sel.createRange();
            $document.execCommand(command, false, options);
            textRange.collapse(false);
            textRange.select();
          }
          else {
            $document.execCommand(command, false, options);
          }
          $document.body.focus();
          //sync
          scope.$evalAsync(function () {
            ctrl.$setViewValue($body.html());
          });
        });

      }
      return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        link: init
      }
    }
);
angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ngwig\">\n" +
    "  <div class=\"ngwig-header\">\n" +
    "    <div class=\"ngwig-control bold\" title=\"Bold\" ng-click=\"execCommand('bold')\"></div>\n" +
    "    <div class=\"ngwig-control italic\" title=\"Italic\" ng-click=\"execCommand('italic')\"></div>\n" +
    "    <div class=\"ngwig-control underline\" title=\"Underline\" ng-click=\"execCommand('underline')\"></div>\n" +
    "    <div class=\"ngwig-divider\"></div>\n" +
    "    <div class=\"ngwig-control paragraph\" title=\"Paragraph\" ng-click=\"execCommand('formatblock', '<p>')\"></div>\n" +
    "    <div class=\"ngwig-control h1\" title=\"H1\" ng-click=\"execCommand('formatblock', '<h1>')\"></div>\n" +
    "    <div class=\"ngwig-control h2\" title=\"H2\" ng-click=\"execCommand('formatblock', '<h2>')\"></div>\n" +
    "    <div class=\"ngwig-control h3\" title=\"H3\" ng-click=\"execCommand('formatblock', '<h3>')\"></div>\n" +
    "    <div class=\"ngwig-divider\"></div>\n" +
    "    <div class=\"ngwig-control orderedlist\" title=\"Insert Ordered List\" ng-click=\"execCommand('insertorderedlist')\"></div>\n" +
    "    <div class=\"ngwig-control unorderedlist\" title=\"Insert Unordered List\" ng-click=\"execCommand('insertunorderedlist')\"></div>\n" +
    "    <div class=\"ngwig-divider\"></div>\n" +
    "    <div class=\"ngwig-control leftalign\" title=\"Left Align\" ng-click=\"execCommand('justifyleft')\"></div>\n" +
    "    <div class=\"ngwig-control centeralign\" title=\"Center Align\" ng-click=\"execCommand('justifycenter')\"></div>\n" +
    "    <div class=\"ngwig-control rightalign\" title=\"Right Align\" ng-click=\"execCommand('justifyright')\"></div>\n" +
    "    <div class=\"ngwig-control blockalign\" title=\"Block Justify\" ng-click=\"execCommand('justifyfull')\"></div>\n" +
    "    <div ng-show=\"debug\" class=\"ngwig-control blockalign\" title=\"Block Justify\" ng-click=\"editMode = !editMode\"></div>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <textarea class=\"ngwig-editor\" ng-show=\"editMode\" ng-model=\"content\"></textarea>\n" +
    "    <iframe class=\"ngwig-editor\" ng-hide=\"editMode\" ng-model=\"content\" ng-wig-editable></iframe>\n" +
    "  </div>\n" +
    "</div>");
}]);
