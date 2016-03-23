'use strict';

/**
 * version: 2.3.17
 */
angular.module('ngWig', ['ngwig-app-templates']);

angular.module('ngWig').component('ngWigEditable', {
  bindings: {
    onPaste: '=',
    name: '@',
    required: '<',
    editMode: '<',
    ngModel: '='
  },
  template: '<div tabindex="-1" ng-class="{\'nw-invisible\': $ctrl.editMode}" class="nw-editor__res" contenteditable></div>',
  require: {
    ngModelController: '^ngModel'
  },
  controller: ["$document", "$scope", "$element", function ($document, $scope, $element) {
    var _this = this;

    var $container = $element.find('div');

    this.$onInit = function () {
      //model --> view
      _this.ngModelController.$render = function () {
        return $container.html(_this.ngModelController.$viewValue || '');
      };

      $container.bind(eventsToBind.join(' '), function () {
        //view --> model
        _this.ngModelController.$setViewValue($container.html());
        $scope.$applyAsync();
      });
    };

    var eventsToBind = ['blur', 'keyup', 'change', 'focus', 'click'];

    if (this.onPaste) {
      $container.on('paste', function (event) {
        _this.onPaste({ $event: event, content: _this.ngModel }).then(function (val) {
          return $container.html(val);
        });
      });
    } else {
      eventsToBind.push('paste');
    }

    this.isEditorActive = function () {
      return $container[0] === $document[0].activeElement;
    };

    $scope.$on('execCommand', function (event, params) {
      $container[0].focus();

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
    });

    $scope.$on('nw-disabled', function (event, isDisabled) {
      return $container.attr('contenteditable', !isDisabled);
    });
  }]
});
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
angular.module('ngWig').component('ngWig', {
  bindings: {
    content: '=ngModel',
    onPaste: '&'
  },
  templateUrl: 'ng-wig/views/ng-wig.html',
  controller: ["$scope", "$element", "$attrs", "$window", "$document", "ngWigToolbar", function ($scope, $element, $attrs, $window, $document, ngWigToolbar) {
    var _this2 = this;

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
        _this2.disabled = isDisabled;
        $scope.$broadcast('nw-disabled', isDisabled);
      });
    }

    this.toggleEditMode = function () {
      _this2.editMode = !_this2.editMode;

      if ($window.getSelection().removeAllRanges) {
        $window.getSelection().removeAllRanges();
      }
    };

    this.execCommand = function (command, options) {
      if (_this2.editMode) return false;

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
  $templateCache.put("ng-wig/views/ng-wig.html", "<div class=\"ng-wig\">\n" + "  <ul class=\"nw-toolbar\">\n" + "    <li class=\"nw-toolbar__item\" ng-repeat=\"button in $ctrl.toolbarButtons\">\n" + "        <div ng-if=\"!button.isComplex\">\n" + "          <button type=\"button\"\n" + "                  class=\"nw-button {{button.styleClass}}\"\n" + "                  title=\"{{button.title}}\"\n" + "                  ng-click=\"$ctrl.execCommand(button.command)\"\n" + "                  ng-class=\"{ 'nw-button--active': isEditorActive() && button.isActive() }\"\n" + "                  ng-disabled=\"$ctrl.editMode || $ctrl.disabled\">\n" + "            {{ button.title }}\n" + "          </button>\n" + "        </div>\n" + "        <div ng-if=\"button.isComplex\">\n" + "          <ng-wig-plugin\n" + "              exec-command=\"$ctrl.execCommand\"\n" + "              plugin=\"button\"\n" + "              editMode=\"$ctrl.editMode\"\n" + "              disabled=\"$ctrl.disabled\"></ng-wig-plugin>\n" + "        </div>\n" + "    </li><!--\n" + "    --><li class=\"nw-toolbar__item\">\n" + "      <button type=\"button\"\n" + "              class=\"nw-button nw-button--source\"\n" + "              title=\"Edit HTML\"\n" + "              ng-class=\"{ 'nw-button--active': $ctrl.editMode }\"\n" + "              ng-if=\"$ctrl.isSourceModeAllowed\"\n" + "              ng-click=\"$ctrl.toggleEditMode()\"\n" + "              ng-disabled=\"$ctrl.disabled\">\n" + "        Edit HTML\n" + "      </button>\n" + "    </li>\n" + "  </ul>\n" + "\n" + "  <div class=\"nw-editor-container\">\n" + "    <div class=\"nw-editor__src-container\" ng-show=\"$ctrl.editMode\">\n" + "      <textarea ng-model=\"$ctrl.content\"\n" + "                ng-required=\"$ctrl.required\"\n" + "                ng-disabled=\"$ctrl.disabled\"\n" + "                class=\"nw-editor__src\"></textarea>\n" + "    </div>\n" + "    <div class=\"nw-editor\" ng-class=\"{ 'nw-disabled': $ctrl.disabled }\">\n" + "      <ng-wig-editable name=\"{{$ctrl.name}}\"\n" + "                       ng-required=\"$ctrl.required\"\n" + "                       edit-mode=\"$ctrl.editMode\"\n" + "                       ng-model=\"$ctrl.content\"\n" + "                       on-paste=\"$ctrl.onPaste\"\n" + "                       ng-disabled=\"$ctrl.disabled\">\n" + "      </ng-wig-editable>\n" + "    </div>\n" + "  </div>\n" + "</div>\n" + "");
}]);
//# sourceMappingURL=ng-wig.js.map
