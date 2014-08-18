angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ng-wig\">\n" +
    "  <div class=\"l-block nw-header\">\n" +
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
