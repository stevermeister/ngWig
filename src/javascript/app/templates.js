angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ng-wig\">\n" +
    "  <ul class=\"nw-toolbar\">\n" +
    "    <li class=\"nw-toolbar__item\">\n" +
    "      <select class=\"form-control\" ng-model=\"style\" ng-change=\"execCommand('formatblock', style.value)\" ng-options=\"style.name for style in styles\">\n" +
    "        <option ng-selected=\"true\" disabled value=\"\">--- Choose a style ---</option>\n" +
    "      </select>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--unordered-list\" title=\"Unordered List\" ng-click=\"execCommand('insertunorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--ordered-list\" title=\"Ordered List\" ng-click=\"execCommand('insertorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--bold\" title=\"Bold\" ng-click=\"execCommand('bold')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--italic\" title=\"Italic\" ng-click=\"execCommand('italic')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--link\" title=\"link\" ng-click=\"execCommand('createlink')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--source\" ng-class=\"{ 'nw-button--active': editMode }\" ng-click=\"toggleEditMode()\"></button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"nw-editor-container\">\n" +
    "    <div class=\"nw-editor\">\n" +
    "      <textarea class=\"nw-editor__src\" ng-show=\"editMode\" ng-model=\"content\"></textarea>\n" +
    "      <div ng-class=\"{'nw-invisible': editMode, 'nw-autoexpand': autoexpand}\" class=\"nw-editor__res\" ng-model=\"content\" ng-wig-editable></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
