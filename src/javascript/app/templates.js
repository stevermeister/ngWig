angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ng-wig\">\n" +
    "  <ul class=\"nw-toolbar\">\n" +
    "    <li class=\"nw-toolbar__item\" ng-repeat=\"button in $ctrl.toolbarButtons\">\n" +
    "        <div ng-if=\"!button.isComplex\">\n" +
    "          <button type=\"button\"\n" +
    "                  class=\"nw-button {{button.styleClass}}\"\n" +
    "                  title=\"{{button.title}}\"\n" +
    "                  ng-click=\"$ctrl.execCommand(button.command)\"\n" +
    "                  ng-class=\"{ 'nw-button--active': !$ctrl.disabled && $ctrl.isEditorActive() && button.isActive() }\"\n" +
    "                  ng-disabled=\"$ctrl.editMode || $ctrl.disabled\">\n" +
    "            {{ button.title }}\n" +
    "          </button>\n" +
    "        </div>\n" +
    "        <div ng-if=\"button.isComplex\">\n" +
    "          <ng-wig-plugin\n" +
    "              exec-command=\"$ctrl.execCommand\"\n" +
    "              plugin=\"button\"\n" +
    "              edit-mode=\"$ctrl.editMode\"\n" +
    "              disabled=\"$ctrl.disabled\"\n" +
    "              options=\"$ctrl.options\"\n" +
    "              content=\"$ctrl.content\"></ng-wig-plugin>\n" +
    "        </div>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\"\n" +
    "              class=\"nw-button nw-button--source\"\n" +
    "              title=\"Edit HTML\"\n" +
    "              ng-class=\"{ 'nw-button--active': $ctrl.editMode }\"\n" +
    "              ng-if=\"$ctrl.isSourceModeAllowed\"\n" +
    "              ng-click=\"$ctrl.toggleEditMode()\"\n" +
    "              ng-disabled=\"$ctrl.disabled\">\n" +
    "        Edit HTML\n" +
    "      </button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"nw-editor-container\">\n" +
    "    <div class=\"nw-editor__src-container\" ng-show=\"$ctrl.editMode\">\n" +
    "      <textarea ng-model=\"$ctrl.content\"\n" +
    "                ng-disabled=\"$ctrl.disabled\"\n" +
    "                class=\"nw-editor__src\"></textarea>\n" +
    "    </div>\n" +
    "    <div class=\"nw-editor\" ng-class=\"{ 'nw-disabled': $ctrl.disabled }\">\n" +
    "      <div id=\"ng-wig-editable\"\n" +
    "           class=\"nw-editor__res\"\n" +
    "           ng-class=\"{'nw-invisible': $ctrl.editMode}\"\n" +
    "           ng-disabled=\"$ctrl.disabled\"\n" +
    "           contenteditable\n" +
    "           placeholder=\"{{$ctrl.placeholder}}\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
