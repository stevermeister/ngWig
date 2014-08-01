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
    "<div class=\"ng-wig\">\n" +
    "  <div class=\"l-block\">\n" +
    "    <div class=\"l-list l-list--inline\">\n" +
    "      <div class=\"l-list__item\">\n" +
    "        <div class=\"nw-toolbar\">\n" +
    "          <ul class=\"l-list l-list--inline l-list--collapsed\">\n" +
    "            <li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action editor-icon-paragraph\" title=\"Paragraph\" ng-click=\"execCommand('formatblock', '<p>')\"></button>\n" +
    "            </li><!--\n" +
    "            --><li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action nw-toolbar__action--last editor-icon-header\" title=\"Header\" ng-click=\"execCommand('formatblock', '<h1>')\"></button>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"l-list__item\">\n" +
    "        <div class=\"nw-toolbar\">\n" +
    "          <ul class=\"l-list l-list--inline l-list--collapsed\">\n" +
    "            <li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action editor-icon-bold\" title=\"Bold\" ng-click=\"execCommand('bold')\"></button>\n" +
    "            </li><!--\n" +
    "            --><li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action nw-toolbar__action--last editor-icon-italic\" title=\"Italic\" ng-click=\"execCommand('italic')\"></button>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"l-list__item\">\n" +
    "        <div class=\"nw-toolbar\">\n" +
    "          <ul class=\"l-list l-list--inline l-list--collapsed\">\n" +
    "            <li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action editor-icon-ul\" title=\"Insert Unordered List\" ng-click=\"execCommand('insertunorderedlist')\"></button>\n" +
    "            </li><!--\n" +
    "            --><li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action nw-toolbar__action--active editor-icon-ol\" title=\"Insert Ordered List\" ng-click=\"execCommand('insertorderedlist')\"></button>\n" +
    "            </li><!--\n" +
    "            --><li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action editor-icon-link\"></button>\n" +
    "            </li><!--\n" +
    "            --><li class=\"l-list__item\">\n" +
    "              <button type=\"button\" class=\"nw-toolbar__action nw-toolbar__action--last editor-icon-unlink\"></button>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"nw-editor\">\n" +
    "    <textarea class=\"nw-editor__src\" ng-show=\"editMode\" ng-model=\"content\"></textarea>\n" +
    "    <iframe class=\"nw-editor__res\" frameBorder=\"0\" ng-hide=\"editMode\" ng-model=\"content\" ng-wig-editable></iframe>\n" +
    "  </div>\n" +
    "</div>");
}]);
