'use strict';

/**
 * version: 2.3.14
 */
angular.module('ngWig', ['ngwig-app-templates']);

angular.module('ngWig').component('ngWig', {
  bindings: {
    content: '=ngModel',
    onPaste: '&'
  },
  templateUrl: 'ng-wig/views/ng-wig.html',
  controller: ["$scope", "$element", "$attrs", "$window", "$document", "ngWigToolbar", function ($scope, $element, $attrs, $window, $document, ngWigToolbar) {
    var _this = this;

    //TODO: clean-up this attrs solution
    this.name = $attrs.name;
    $element.removeAttr('name');
    this.required = !!$attrs.required;
    this.isSourceModeAllowed = Object.keys($attrs).indexOf('sourceModeAllowed') !== -1 ? true : false;
    this.editMode = false;
    this.toolbarButtons = ngWigToolbar.getToolbarButtons($attrs.buttons && string2array($attrs.buttons));
    if ($attrs.ngDisabled != null || $attrs.disabled != null) {
      $scope.$watch(function () {
        return !!$attrs.disabled;
      }, function (isDisabled) {
        _this.disabled = isDisabled;
        $scope.$broadcast('nw-disabled', isDisabled);
      });
    }

    this.toggleEditMode = function () {
      _this.editMode = !_this.editMode;

      if ($window.getSelection().removeAllRanges) {
        $window.getSelection().removeAllRanges();
      }
    };

    this.execCommand = function (command, options) {
      if (_this.editMode) return false;

      if (command === 'createlink') {
        options = $window.prompt('Please enter the URL', 'http://');
        if (!options) {
          return;
        }
      }
      $scope.$broadcast('execCommand', { command: command, options: options });
    };

    //TODO: check the function
    function string2array(keysString) {
      return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
    }
  }]
});

angular.module('ngWig').directive('ngWigEditable', ["$document", function ($document) {
  function init(scope, $element, attrs, ngModelController) {

    $element.attr('contenteditable', true);

    //model --> view
    ngModelController.$render = function () {
      $element.html(ngModelController.$viewValue || '');
    };

    //view --> model
    function viewToModel() {
      ngModelController.$setViewValue($element.html());
    }

    var eventsToBind = ['blur', 'keyup', 'change', 'focus', 'click'];

    if (angular.isFunction(scope.onPaste)) {
      $element.on('paste', function (e) {
        scope.onPaste(e, $element.html()).then(function (val) {
          $element.html(val);
        });
      });
    } else {
      eventsToBind.push('paste');
    }

    $element.bind(eventsToBind.join(' '), function () {
      viewToModel();
      scope.$applyAsync();
    });

    scope.isEditorActive = function () {
      return $element[0] === $document[0].activeElement;
    };

    scope.$on('execCommand', function (event, params) {
      $element[0].focus();

      var ieStyleTextSelection = $document[0].selection,
          command = params.command,
          options = params.options;

      if (ieStyleTextSelection) {
        var textRange = ieStyleTextSelection.createRange();
      }

      if ($document[0].queryCommandSupported && !$document[0].queryCommandSupported(command)) {
        throw 'The command "' + command + '" is not supported';
      }

      $document[0].execCommand(command, false, options);

      if (ieStyleTextSelection) {
        textRange.collapse(false);
        textRange.select();
      }

      viewToModel();
    });

    scope.$on('nw-disabled', function (event, isDisabled) {
      $element.attr('contenteditable', !isDisabled);
    });
  }

  return {
    restrict: 'A',
    require: 'ngModel',
    replace: true,
    link: init
  };
}]);

angular.module('ngWig').component('ngWigPlugin', {
  bindings: {
    plugin: '<',
    execCommand: '=',
    editMode: '=',
    disabled: '='
  },
  controller: ["$scope", "$element", "$compile", function ($scope, $element, $compile) {
    $element.replaceWith($compile('<' + this.plugin.pluginName + ' ' + 'plugin=' + '"$ctrl.plugin"' + 'exec-command=' + '"$ctrl.execCommand"' + 'edit-mode=' + '"$ctrl.editMode"' + 'disabled=' + '"$ctrl.disabled"' + '/>')($scope));
  }]
});
angular.module('ngWig').provider('ngWigToolbar', function () {

  var buttonLibrary = {
    list1: { title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul' },
    list2: { title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol' },
    bold: { title: 'Bold', command: 'bold', styleClass: 'bold' },
    italic: { title: 'Italic', command: 'italic', styleClass: 'italic' },
    link: { title: 'Link', command: 'createlink', styleClass: 'link' }
  };

  var defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];

  var isButtonActive = function isButtonActive() {
    return this.command && document.queryCommandState(this.command);
  };

  this.setButtons = function (buttons) {
    if (!angular.isArray(buttons)) {
      throw 'Argument "buttons" should be an array';
    }

    defaultButtonsList = buttons;
  };

  this.addStandardButton = function (name, title, command, styleClass) {
    if (!name || !title || !command) {
      throw 'Arguments "name", "title" and "command" are required';
    }

    styleClass = styleClass || '';
    buttonLibrary[name] = { title: title, command: command, styleClass: styleClass };
    defaultButtonsList.push(name);
  };

  this.addCustomButton = function (name, pluginName) {
    if (!name || !pluginName) {
      throw 'Arguments "name" and "pluginName" are required';
    }

    buttonLibrary[name] = { pluginName: pluginName, isComplex: true };
    defaultButtonsList.push(name);
  };

  this.$get = function () {
    return {
      getToolbarButtons: function getToolbarButtons(list) {
        var toolbarButtons = [];
        (list || defaultButtonsList).forEach(function (buttonKey) {
          if (!buttonLibrary[buttonKey]) {
            throw 'There is no "' + buttonKey + '" in your library. Possible variants: ' + Object.keys(buttonLibrary);
          }

          var button = angular.copy(buttonLibrary[buttonKey]);

          if (!angular.isFunction(button.isActive)) {
            button.isActive = isButtonActive;
          }

          toolbarButtons.push(button);
        });
        return toolbarButtons;
      }
    };
  };
});
angular.module('ngWig').config(['ngWigToolbarProvider', function (ngWigToolbarProvider) {
  ngWigToolbarProvider.addCustomButton('formats', 'nw-formats-button');
}]).component('nwFormatsButton', {
  bindings: {
    execCommand: '=',
    editMode: '=',
    disabled: '='
  },
  template: '<select class="nw-select" \n                           ng-model="$ctrl.format" \n                           ng-change="$ctrl.execCommand(\'formatblock\', $ctrl.format.value)" \n                           ng-options="format.name for format in $ctrl.formats" \n                           ng-disabled="$ctrl.editMode || $ctrl.disabled"></select>',
  controller: function controller() {

    this.formats = [{ name: 'Normal text', value: 'p' }, { name: 'Header 1', value: 'h1' }, { name: 'Header 2', value: 'h2' }, { name: 'Header 3', value: 'h3' }];

    this.format = this.formats[0];
  }
});

angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html", "<div class=\"ng-wig\">\n" + "  <ul class=\"nw-toolbar\">\n" + "    <li class=\"nw-toolbar__item\" ng-repeat=\"button in $ctrl.toolbarButtons\">\n" + "        <div ng-if=\"!button.isComplex\">\n" + "          <button type=\"button\"\n" + "                  class=\"nw-button {{button.styleClass}}\"\n" + "                  title=\"{{button.title}}\"\n" + "                  ng-click=\"$ctrl.execCommand(button.command)\"\n" + "                  ng-class=\"{ 'nw-button--active': isEditorActive() && button.isActive() }\"\n" + "                  ng-disabled=\"$ctrl.editMode || $ctrl.disabled\">\n" + "            {{ button.title }}\n" + "          </button>\n" + "        </div>\n" + "        <div ng-if=\"button.isComplex\">\n" + "          <ng-wig-plugin\n" + "              execCommand=\"$ctrl.execCommand\"\n" + "              plugin=\"button\"\n" + "              editMode=\"$ctrl.editMode\"\n" + "              disabled=\"$ctrl.disabled\"></ng-wig-plugin>\n" + "        </div>\n" + "    </li><!--\n" + "    --><li class=\"nw-toolbar__item\">\n" + "      <button type=\"button\" class=\"nw-button nw-button--source\" title=\"Edit HTML\" ng-class=\"{ 'nw-button--active': $ctrl.editMode }\" ng-show=\"$ctrl.isSourceModeAllowed\" ng-click=\"$ctrl.toggleEditMode()\" ng-disabled=\"$ctrl.disabled\">\n" + "        Edit HTML\n" + "      </button>\n" + "    </li>\n" + "  </ul>\n" + "\n" + "  <div class=\"nw-editor-container\">\n" + "    <div class=\"nw-editor__src-container\" ng-show=\"$ctrl.editMode\">\n" + "      <textarea ng-required=\"$ctrl.required\" ng-disabled=\"$ctrl.disabled\" class=\"nw-editor__src\" ng-model=\"$ctrl.content\"></textarea>\n" + "    </div>\n" + "    <div class=\"nw-editor\" ng-class=\"{ 'nw-disabled': $ctrl.disabled }\">\n" + "      <div name=\"{{$ctrl.name}}\" ng-required=\"$ctrl.required\" tabindex=\"-1\" ng-class=\"{'nw-invisible': $ctrl.editMode}\" class=\"nw-editor__res\" ng-model=\"$ctrl.content\" ng-wig-editable on-paste=\"$ctrl.onPaste\"></div>\n" + "    </div>\n" + "  </div>\n" + "</div>\n" + "");
}]);
//# sourceMappingURL=ng-wig.js.map
