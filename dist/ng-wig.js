'use strict';

/**
 * version: 3.0.5
 */
angular.module('ngWig', ['ngwig-app-templates']);
angular.ngWig = {
    version: '3.0.1'
};

angular.module('ngWig').component('ngWigPlugin', {
    bindings: {
        plugin: '<',
        execCommand: '=',
        editMode: '=',
        disabled: '=',
        options: '<',
        content: '='
    },
    controller: ["$scope", "$element", "$compile", function ($scope, $element, $compile) {
        $element.replaceWith($compile('<' + this.plugin.pluginName + ' ' + 'plugin=' + '"$ctrl.plugin"' + 'exec-command=' + '"$ctrl.execCommand"' + 'edit-mode=' + '"$ctrl.editMode"' + 'disabled=' + '"$ctrl.disabled"' + 'options=' + '"$ctrl.options"' + 'content=' + '"$ctrl.content"' + '/>')($scope));
    }]
});
describe('component: ngWigPlugin', function () {
    var component = void 0;
    var scope = void 0;
    var plugin = {
        name: 'myPlugin',
        pluginName: 'my-plugin'
    };
    var execCommand = 'fakeCmd()';
    var editMode = false;
    var disabled = false;
    var options = ['Option 1', 'Option 2'];
    var content = 'Fake text';
    var element = angular.element('<div></div>');
    var compile = void 0;

    beforeEach(module('ngWig'));

    beforeEach(inject(function (_$componentController_, _$rootScope_, _$compile_) {
        scope = _$rootScope_.$new();
        compile = _$compile_;

        spyOn(element, 'replaceWith');

        component = _$componentController_('ngWigPlugin', { $scope: scope, $element: element }, { plugin: plugin, execCommand: execCommand, editMode: editMode, disabled: disabled, options: options, content: content });
    }));

    it('should expose plugin', function () {
        expect(component.plugin).toEqual(plugin);
    });

    it('should expose execCommand', function () {
        expect(component.execCommand).toEqual(execCommand);
    });

    it('should expose editMode', function () {
        expect(component.editMode).toEqual(editMode);
    });

    it('should expose disabled', function () {
        expect(component.disabled).toEqual(disabled);
    });

    it('should expose options', function () {
        expect(component.options).toEqual(options);
    });

    it('should expose content', function () {
        expect(component.content).toEqual(content);
    });

    it('should replace with the plugin template', function () {
        var pluginElement = compile('<' + component.plugin.pluginName + ' ' + 'plugin=' + '"$ctrl.plugin"' + 'exec-command=' + '"$ctrl.execCommand"' + 'edit-mode=' + '"$ctrl.editMode"' + 'disabled=' + '"$ctrl.disabled"' + 'options=' + '"$ctrl.options"' + 'content=' + '"$ctrl.content"' + '/>')(scope);

        expect(element.replaceWith).toHaveBeenCalledWith(pluginElement);
    });
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
describe('provider: ngWigToolbar', function () {
    var toolbarProvider = void 0;

    beforeEach(function () {
        module('ngWig', function (_ngWigToolbarProvider_) {
            toolbarProvider = _ngWigToolbarProvider_;
        });

        inject();
    });

    describe('setButtons function', function () {
        it('should exist', function () {
            expect(toolbarProvider.setButtons).toBeDefined();
        });

        it('should throw an error if buttons are not provided', function () {
            expect(function () {
                toolbarProvider.setButtons();
            }).toThrow('Argument "buttons" should be an array');
        });

        it('should not throw an error if buttons are provided', function () {
            expect(function () {
                toolbarProvider.setButtons(['button1', 'button2']);
            }).not.toThrow();
        });
    });

    describe('addStandardButton function', function () {
        it('should exist', function () {
            expect(toolbarProvider.addStandardButton).toBeDefined();
        });

        it('should throw an error if name/title/command is not provided', function () {
            var errorMsg = 'Arguments "name", "title" and "command" are required';

            expect(function () {
                return toolbarProvider.addStandardButton();
            }).toThrow(errorMsg);
            expect(function () {
                return toolbarProvider.addStandardButton('button1');
            }).toThrow(errorMsg);
            expect(function () {
                return toolbarProvider.addStandardButton('button1', 'My button');
            }).toThrow(errorMsg);
        });

        it('should not throw an error if name, title and command are provided', function () {
            expect(function () {
                toolbarProvider.addStandardButton('button1', 'My button', 'fakeCmd()');
            }).not.toThrow();
        });
    });

    describe('addCustomButton function', function () {
        it('should exist', function () {
            expect(toolbarProvider.addCustomButton).toBeDefined();
        });

        it('should throw an error if name/plugin is not provided', function () {
            var errorMsg = 'Arguments "name" and "pluginName" are required';

            expect(function () {
                toolbarProvider.addCustomButton();
            }).toThrow(errorMsg);
            expect(function () {
                toolbarProvider.addCustomButton('button1');
            }).toThrow(errorMsg);
        });

        it('should not throw an error if name and pluginName are provided', function () {
            expect(function () {
                toolbarProvider.addCustomButton('button1', 'my-button');
            }).not.toThrow();
        });
    });

    describe('$get function', function () {
        it('should exist', function () {
            expect(toolbarProvider.$get).toBeDefined();
        });

        describe('getToolbarButtons function', function () {
            it('should exist', inject(function () {
                expect(toolbarProvider.$get().getToolbarButtons).toBeDefined();
            }));

            it('should throw an error if provided buttons have not been added first', function () {
                expect(function () {
                    toolbarProvider.$get().getToolbarButtons(['button1']);
                }).toThrow('There is no "button1" in your library. Possible variants: list1,list2,bold,italic,link,clear-styles,forecolor,formats');
            });

            it('should return 8 buttons by default', function () {
                expect(toolbarProvider.$get().getToolbarButtons().length).toEqual(8);
            });

            it('should return 1 button', function () {
                toolbarProvider.addCustomButton('button1', 'my-button');

                expect(toolbarProvider.$get().getToolbarButtons(['button1']).length).toEqual(1);
            });

            it('should add isActive function to a button', function () {
                toolbarProvider.addCustomButton('button1', 'my-button');

                expect(toolbarProvider.$get().getToolbarButtons(['button1'])[0].isActive).toBeDefined();
            });
        });
    });
});

angular.module('ngWig').component('ngWig', {
    bindings: {
        content: '=ngModel',
        options: '<?',
        onPaste: '&',
        buttons: '@',
        beforeExecCommand: '&',
        afterExecCommand: '&',
        placeholder: '<?'
    },
    require: {
        ngModelController: 'ngModel'
    },
    templateUrl: 'ng-wig/views/ng-wig.html',
    controller: ["$scope", "$element", "$q", "$attrs", "$window", "$document", "ngWigToolbar", function ($scope, $element, $q, $attrs, $window, $document, ngWigToolbar) {
        var _this = this;

        var $container = angular.element($element[0].querySelector('#ng-wig-editable'));

        //TODO: clean-up this attrs solution
        this.required = 'required' in $attrs;
        this.isSourceModeAllowed = 'sourceModeAllowed' in $attrs;
        this.editMode = false;
        this.toolbarButtons = ngWigToolbar.getToolbarButtons(this.buttons && string2array(this.buttons));
        this.placeholder = $attrs.placeholder;
        $attrs.$observe('disabled', function (isDisabled) {
            _this.disabled = isDisabled;
            $container.attr('contenteditable', !isDisabled);
        });
        this.isEditorActive = function () {
            return $container[0] === $document[0].activeElement;
        };
        this.toggleEditMode = function () {
            _this.editMode = !_this.editMode;
            if ($window.getSelection().removeAllRanges) {
                $window.getSelection().removeAllRanges();
            }
        };

        this.execCommand = function (command, options) {
            if (_this.editMode) return false;

            if (command === 'createlink' || command === 'insertImage') {
                options = $window.prompt('Please enter the URL', 'http://');
                if (!options) {
                    return;
                }
            }
            _this.beforeExecCommand({ command: command, options: options });
            $scope.$broadcast('execCommand', { command: command, options: options });
            _this.afterExecCommand({ command: command, options: options });
        };

        this.$onInit = function () {
            var placeholder = Boolean(_this.placeholder);
            _this.ngModelController.$render = function () {
                return !placeholder ? $container.html(_this.ngModelController.$viewValue || '<p></p>') : $container.empty();
            };

            $container.bind('blur keyup change focus click', function () {
                //view --> model
                if (placeholder && !$container.html().length || placeholder && $container.html() === "<br>") $container.empty();
                _this.ngModelController.$setViewValue($container.html());
                $scope.$applyAsync();
            });
        };

        $container.on('paste', function (event) {
            if (!$attrs.onPaste) {
                return;
            }

            var pasteContent = void 0;
            if (window.clipboardData && window.clipboardData.getData) {
                // IE
                pasteContent = window.clipboardData.getData('Text');
            } else {
                pasteContent = (event.originalEvent || event).clipboardData.getData('text/plain');
            }
            event.preventDefault();
            $q.when(_this.onPaste({ $event: event, pasteContent: pasteContent })).then(function (pasteText) {
                pasteHtmlAtCaret(pasteText);
            });
        });

        $scope.$on('execCommand', function (event, params) {
            var selection = $document[0].getSelection().toString();
            var command = params.command;
            var options = params.options;

            event.stopPropagation && event.stopPropagation();

            $container[0].focus();

            if ($document[0].queryCommandSupported && !$document[0].queryCommandSupported(command)) {
                throw 'The command "' + command + '" is not supported';
            }

            // use insertHtml for `createlink` command to account for IE/Edge purposes, in case there is no selection
            if (command === 'createlink' && selection === '') {
                $document[0].execCommand('insertHtml', false, '<a href="' + options + '">' + options + '</a>');
            } else {
                $document[0].execCommand(command, false, options);
            }
        });
    }]
});

//TODO: check the function
function string2array(keysString) {
    return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
}

//TODO: put contenteditable helper into service
function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(),
                node,
                lastNode;
            while (node = el.firstChild) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

describe('component: ngWig', function () {
    var component = void 0;
    var $componentController = void 0;
    var controller = void 0;
    var scope = void 0;
    var content = 'Fake text';
    var options = ['Option 1', 'Option 2'];
    var buttons = 'button1,button2';
    var beforeExecCommand = void 0;
    var afterExecCommand = void 0;
    var element = angular.element('<div></div>');
    var attrs = { $observe: function $observe() {}, placeholder: '' };
    var pasteSpy = void 0;
    var beforeExecSpy = void 0;
    var afterExecSpy = void 0;
    var mocks = {
        list1: { title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul' },
        list2: { title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol' },
        bold: { title: 'Bold', command: 'bold', styleClass: 'bold' },
        italic: { title: 'Italic', command: 'italic', styleClass: 'italic' },
        link: { title: 'Link', command: 'createlink', styleClass: 'link' }
    };
    var mockWindow = void 0;
    var compile = void 0;

    beforeEach(module('ngWig'));

    beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _$window_, _$compile_, _ngWigToolbar_) {
        mockWindow = _$window_;
        compile = _$compile_;
        $componentController = _$componentController_;
        scope = _$rootScope_.$new();

        pasteSpy = jasmine.createSpy('pasteSpy');
        beforeExecSpy = jasmine.createSpy('beforeExecSpy');
        afterExecSpy = jasmine.createSpy('afterExecSpy');

        spyOn(_ngWigToolbar_, 'getToolbarButtons').and.returnValue(mocks);
        spyOn(mockWindow.getSelection(), 'removeAllRanges');

        component = $componentController('ngWig', { $scope: scope, $element: element, $attrs: attrs }, { content: content, options: options, buttons: buttons, onPaste: pasteSpy, beforeExecCommand: beforeExecSpy, afterExecCommand: afterExecSpy });
    }));

    function getCompiledElement(template) {
        var element = angular.element(template || '<ng-wig ng-model="text1"><ng-wig>');
        var compiledElement = compile(element)(scope);

        scope.$digest();

        controller = element.controller('ngWig');

        return compiledElement;
    }

    it('should expose content', function () {
        expect(component.content).toEqual(content);
    });

    it('should expose options', function () {
        expect(component.options).toEqual(options);
    });

    it('should expose buttons', function () {
        expect(component.buttons).toEqual(buttons);
    });

    it('should call onPaste', function () {
        component.onPaste();

        expect(pasteSpy).toHaveBeenCalled();
    });

    it('should call beforeExecCommand', function () {
        component.beforeExecCommand();

        expect(beforeExecSpy).toHaveBeenCalled();
    });

    it('should call afterExecCommand', function () {
        component.afterExecCommand();

        expect(afterExecSpy).toHaveBeenCalled();
    });

    it('should set required', function () {
        expect(component.required).toEqual(false);
    });

    it('should set isSourceModeAllowed', function () {
        expect(component.isSourceModeAllowed).toEqual(false);
    });

    it('should set editMode', function () {
        expect(component.editMode).toEqual(false);
    });

    it('should set toolbarButtons', function () {
        expect(component.toolbarButtons).toBe(mocks);
    });

    describe('isEditorActive function', function () {
        it('should exist', function () {
            expect(component.isEditorActive).not.toBe(null);
        });

        it('should return false', function () {
            expect(component.isEditorActive()).toEqual(false);
        });
    });

    describe('toggleEditMode function', function () {
        it('should exist', function () {
            expect(component.toggleEditMode).not.toBe(null);
        });

        it('should toggle the edit mode of the editor', function () {
            component.toggleEditMode();

            expect(component.editMode).toEqual(true);
        });

        it('should remove all ranges from the selection', function () {
            component.toggleEditMode();

            expect(mockWindow.getSelection().removeAllRanges).toHaveBeenCalled();
        });
    });

    describe('execCommand function', function () {
        beforeEach(function () {
            spyOn(scope, '$broadcast');
        });

        it('should exist', function () {
            expect(component.execCommand).not.toBe(null);
        });

        it('should return if the editor is in edit mode', function () {
            component.editMode = true;

            expect(component.execCommand('fakeCmd')).toEqual(false);
        });

        it('should broadcast the command', function () {
            component.execCommand('fakeCmd', {});

            expect(beforeExecSpy).toHaveBeenCalledWith({
                command: 'fakeCmd',
                options: {}
            });
            expect(scope.$broadcast).toHaveBeenCalledWith('execCommand', {
                command: 'fakeCmd',
                options: {}
            });
            expect(afterExecSpy).toHaveBeenCalledWith({
                command: 'fakeCmd',
                options: {}
            });
        });

        it('should show a prompt when the command name is createlink', function () {
            spyOn(mockWindow, 'prompt').and.returnValue('http://fakeLink');
            component.execCommand('createlink');

            expect(mockWindow.prompt).toHaveBeenCalledWith('Please enter the URL', 'http://');
        });

        it('should show a prompt when the command name is insertImage', function () {
            spyOn(mockWindow, 'prompt').and.returnValue('http://fakeImage');
            component.execCommand('insertImage');

            expect(mockWindow.prompt).toHaveBeenCalledWith('Please enter the URL', 'http://');
        });

        it('should not show a prompt when the command is not createlink or insertImage', function () {
            spyOn(mockWindow, 'prompt');
            component.execCommand('fakeCmd');

            expect(mockWindow.prompt).not.toHaveBeenCalled();
        });

        it('should return if the prompt is cancelled', function () {
            spyOn(mockWindow, 'prompt').and.returnValue(undefined);
            component.execCommand('createlink');

            expect(beforeExecSpy).not.toHaveBeenCalled();
            expect(scope.$broadcast).not.toHaveBeenCalled();
            expect(afterExecSpy).not.toHaveBeenCalled();
        });
    });

    it('should fail if ngModel is not provided', function () {
        expect(function () {
            getCompiledElement('<ng-wig><ng-wig>');
        }).toThrow();
    });

    it('should set disabled property', function () {
        element = getCompiledElement('<ng-wig disabled="true" ng-model="text1"></ng-wig>');
        ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));

        expect(controller.disabled).toEqual('true');
        expect(ngWigElement.attr('contenteditable')).toEqual('false');
    });

    describe('$onInit function', function () {
        var ngWigElement = void 0;

        it('should exist', function () {
            expect(component.$onInit).not.toBe(null);
        });

        describe('$render function', function () {
            beforeEach(function () {
                element = getCompiledElement();
                ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));

                spyOn(controller.ngModelController, '$setViewValue');
            });

            it('should render a paragraph element if ngModel value does not exist', function () {
                expect(ngWigElement.html()).toEqual('<p></p>');
            });

            it('should update the model value on blur event', function () {
                ngWigElement.triggerHandler('blur');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on keyup event', function () {
                ngWigElement.triggerHandler('keyup');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on change event', function () {
                ngWigElement.triggerHandler('change');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on focus event', function () {
                ngWigElement.triggerHandler('focus');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on click event', function () {
                ngWigElement.triggerHandler('click');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });
        });
    });
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

        this.formats = [{ name: 'Normal text', value: '<p>' }, { name: 'Header 1', value: '<h1>' }, { name: 'Header 2', value: '<h2>' }, { name: 'Header 3', value: '<h3>' }];

        this.format = this.formats[0];
    }
});

angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("ng-wig/views/ng-wig.html", "<div class=\"ng-wig\">\n" + "  <ul class=\"nw-toolbar\">\n" + "    <li class=\"nw-toolbar__item\" ng-repeat=\"button in $ctrl.toolbarButtons\">\n" + "        <div ng-if=\"!button.isComplex\">\n" + "          <button type=\"button\"\n" + "                  class=\"nw-button {{button.styleClass}}\"\n" + "                  title=\"{{button.title}}\"\n" + "                  ng-click=\"$ctrl.execCommand(button.command)\"\n" + "                  ng-class=\"{ 'nw-button--active': !$ctrl.disabled && $ctrl.isEditorActive() && button.isActive() }\"\n" + "                  ng-disabled=\"$ctrl.editMode || $ctrl.disabled\">\n" + "            {{ button.title }}\n" + "          </button>\n" + "        </div>\n" + "        <div ng-if=\"button.isComplex\">\n" + "          <ng-wig-plugin\n" + "              exec-command=\"$ctrl.execCommand\"\n" + "              plugin=\"button\"\n" + "              edit-mode=\"$ctrl.editMode\"\n" + "              disabled=\"$ctrl.disabled\"\n" + "              options=\"$ctrl.options\"\n" + "              content=\"$ctrl.content\"></ng-wig-plugin>\n" + "        </div>\n" + "    </li><!--\n" + "    --><li class=\"nw-toolbar__item\">\n" + "      <button type=\"button\"\n" + "              class=\"nw-button nw-button--source\"\n" + "              title=\"Edit HTML\"\n" + "              ng-class=\"{ 'nw-button--active': $ctrl.editMode }\"\n" + "              ng-if=\"$ctrl.isSourceModeAllowed\"\n" + "              ng-click=\"$ctrl.toggleEditMode()\"\n" + "              ng-disabled=\"$ctrl.disabled\">\n" + "        Edit HTML\n" + "      </button>\n" + "    </li>\n" + "  </ul>\n" + "\n" + "  <div class=\"nw-editor-container\">\n" + "    <div class=\"nw-editor__src-container\" ng-show=\"$ctrl.editMode\">\n" + "      <textarea ng-model=\"$ctrl.content\"\n" + "                ng-disabled=\"$ctrl.disabled\"\n" + "                class=\"nw-editor__src\"></textarea>\n" + "    </div>\n" + "    <div class=\"nw-editor\" ng-class=\"{ 'nw-disabled': $ctrl.disabled }\">\n" + "      <div id=\"ng-wig-editable\"\n" + "           tabindex=\"-1\"\n" + "           class=\"nw-editor__res\"\n" + "           ng-class=\"{'nw-invisible': $ctrl.editMode}\"\n" + "           ng-disabled=\"$ctrl.disabled\"\n" + "           contenteditable\n" + "           placeholder=\"{{$ctrl.placeholder}}\">\n" + "      </div>\n" + "    </div>\n" + "  </div>\n" + "</div>\n" + "");
}]);
//# sourceMappingURL=ng-wig.js.map
