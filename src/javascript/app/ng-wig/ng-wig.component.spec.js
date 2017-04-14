describe('component: ngWig', () => {
    let component;
    let $componentController;
    let controller;
    let scope;
    let content = 'Fake text';
    let options = ['Option 1', 'Option 2'];
    let buttons = 'button1,button2';
    let beforeExecCommand;
    let afterExecCommand;
    let element = angular.element('<div></div>');
    let attrs = { $observe: () => {} , placeholder: ''};
    let pasteSpy;
    let beforeExecSpy;
    let afterExecSpy;
    let mocks = {
        list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul'},
        list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol'},
        bold: {title: 'Bold', command: 'bold', styleClass: 'bold'},
        italic: {title: 'Italic', command: 'italic', styleClass: 'italic'},
        link: {title: 'Link', command: 'createlink', styleClass: 'link'}
    };
    let mockWindow;
    let compile;
    let currentDocument;
    let $timeout;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _$timeout_, _$window_, _$compile_, _$document_, _ngWigToolbar_) => {
        mockWindow = _$window_;
        compile = _$compile_;
        currentDocument = _$document_;
        $componentController = _$componentController_;
        scope = _$rootScope_.$new();
        $timeout = _$timeout_;

        pasteSpy = jasmine.createSpy('pasteSpy');
        beforeExecSpy = jasmine.createSpy('beforeExecSpy');
        afterExecSpy = jasmine.createSpy('afterExecSpy');

        spyOn(_ngWigToolbar_, 'getToolbarButtons').and.returnValue(mocks);
        spyOn(mockWindow.getSelection(), 'removeAllRanges');
        spyOn(currentDocument[0], 'execCommand');

        component = $componentController('ngWig',
                                            { $scope: scope, $element: element, $attrs: attrs },
                                            { content: content, options: options, buttons: buttons, onPaste: pasteSpy, beforeExecCommand: beforeExecSpy, afterExecCommand: afterExecSpy }
                                            );
    }));

    function getCompiledElement(template) {
        let element = angular.element(template || '<ng-wig ng-model="text1"></ng-wig>');
        let compiledElement = compile(element)(scope);

        scope.$digest();

        controller = element.controller('ngWig');

        return compiledElement;
    }

    it('should expose content', () => {
        expect(component.content).toEqual(content);
    });

    it('should expose options', () => {
        expect(component.options).toEqual(options);
    });

    it('should expose buttons', () => {
        expect(component.buttons).toEqual(buttons);
    });

    it('should call onPaste', () => {
        component.onPaste();

        expect(pasteSpy).toHaveBeenCalled();
    });

    it('should call beforeExecCommand', () => {
        component.beforeExecCommand();

        expect(beforeExecSpy).toHaveBeenCalled();
    });

    it('should call afterExecCommand', () => {
        component.afterExecCommand();

        expect(afterExecSpy).toHaveBeenCalled();
    });

    it('should set required', () => {
        expect(component.required).toEqual(false);
    });

    it('should set isSourceModeAllowed', () => {
        expect(component.isSourceModeAllowed).toEqual(false);
    });

    it('should set editMode', () => {
        expect(component.editMode).toEqual(false);
    });

    describe('isEditorActive function', () => {
        it('should exist', () => {
            expect(component.isEditorActive).not.toBe(null);
        });

        it('should return false', () => {
            expect(component.isEditorActive()).toEqual(false);
        });
    });

    describe('toggleEditMode function', () => {
        it('should exist', () => {
            expect(component.toggleEditMode).not.toBe(null);
        });

        it('should toggle the edit mode of the editor', () => {
            component.toggleEditMode();

            expect(component.editMode).toEqual(true);
        });

        it('should remove all ranges from the selection', () => {
            component.toggleEditMode();

            expect(mockWindow.getSelection().removeAllRanges).toHaveBeenCalled();
        });
    });

    describe('execCommand function', () => {
        it('should exist', () => {
            expect(component.execCommand).not.toBe(null);
        });

        it('should return if the editor is in edit mode', () => {
            component.editMode = true;

            expect(component.execCommand('fakeCmd')).toEqual(false);
        });

        it('should execute the BOLD command', () => {
            component.execCommand('bold', {});

            expect(beforeExecSpy).toHaveBeenCalledWith({
                command: 'bold',
                options: {}
            });
            expect(currentDocument[0].execCommand).toHaveBeenCalledWith('bold',false,{});
            expect(afterExecSpy).toHaveBeenCalledWith({
                command: 'bold',
                options: {}
            });
        });

        it('should use insertHtml to create a link for IE', () => {
            spyOn(mockWindow, 'prompt').and.returnValue('http://fakeLink');
            spyOn(currentDocument[0], 'getSelection').and.returnValue('');
            component.execCommand('createlink', 'http://fakeLink');

            expect(currentDocument[0].execCommand).toHaveBeenCalledWith('insertHtml', false, '<a href="http://fakeLink">http://fakeLink</a>');
        });

        it('should fail if command is unknown', function(){
            expect(() => {component.execCommand('fakeCmd', {})}).toThrow('The command "fakeCmd" is not supported');
        });

        it('should show a prompt when the command name is createlink', () => {
            spyOn(mockWindow, 'prompt').and.returnValue('http://fakeLink');
            component.execCommand('createlink');

            expect(mockWindow.prompt).toHaveBeenCalledWith('Please enter the URL', 'http://');
        });

        it('should show a prompt when the command name is insertImage', () => {
            spyOn(mockWindow, 'prompt').and.returnValue('http://fakeImage');
            component.execCommand('insertImage');

            expect(mockWindow.prompt).toHaveBeenCalledWith('Please enter the URL', 'http://');
        });

        it('should not show a prompt when the command is not createlink or insertImage', () => {
            spyOn(mockWindow, 'prompt');
            component.execCommand('bold');

            expect(mockWindow.prompt).not.toHaveBeenCalled();
        });

        it('should return if the prompt is cancelled', () => {
            spyOn(mockWindow, 'prompt').and.returnValue(undefined);
            component.execCommand('createlink');

            expect(beforeExecSpy).not.toHaveBeenCalled();
            expect(currentDocument[0].execCommand).not.toHaveBeenCalled();
            expect(afterExecSpy).not.toHaveBeenCalled();
        });
    });

    it('should set disabled property', () => {
        element = getCompiledElement('<ng-wig disabled="true" ng-model="text1"></ng-wig>');
        ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));

        expect(controller.disabled).toEqual('true');
        expect(ngWigElement.attr('contenteditable')).toEqual('false');
    });

    it('should set the placeholder property', () => {
        element = getCompiledElement('<ng-wig disabled="true" ng-model="text1" placeholder="a placeholder"></ng-wig>');
        ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));

        expect(ngWigElement.attr('placeholder')).toEqual('a placeholder');
    });

    describe('$onInit function', () => {
        let ngWigElement;

        it('should exist', () => {
            expect(component.$onInit).not.toBe(null);
        });

        it('should set toolbarButtons', () => {
            component.ngModelController = controller.ngModelController;
            component.$onInit();

            expect(component.toolbarButtons).toBe(mocks);
        });

        describe('$render function', () => {
            beforeEach(() => {
              spyOn(controller.ngModelController, '$setViewValue');
            });

            it('should render a paragraph element if ngModel value does not exist', () => {
              element = getCompiledElement();
              ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));
              expect(ngWigElement.html()).toEqual('<p></p>');
            });

            it('should update the model value on blur event', () => {
                ngWigElement.triggerHandler('blur');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on keyup event', () => {
                ngWigElement.triggerHandler('keyup');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on change event', () => {
                ngWigElement.triggerHandler('change');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on focus event', () => {
                ngWigElement.triggerHandler('focus');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should update the model value on click event', () => {
                ngWigElement.triggerHandler('click');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should render an empty element', function(){
              element = getCompiledElement('<ng-wig ng-model="text1" placeholder="My placeholder"></ng-wig>');
              ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));
              expect(ngWigElement.html()).toEqual('');
            });

            it('should render the model value even if a placeholder exists', function(){
              scope.string = "This is a value";
              let el = `<ng-wig ng-model="string" placeholder="My placeholder"></ng-wig>`;
              element = getCompiledElement(el);
              ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));
              expect(ngWigElement.html()).toEqual('This is a value');
            });

            it('should render the model value even if a placeholder exits and the model value is recevied async', function(){
              let el = `<ng-wig ng-model="string" placeholder="My placeholder"></ng-wig>`;
              element = getCompiledElement(el);
              ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));

              $timeout(function () {
                scope.string = "This is a value";
                $timeout.flush();
                expect($timeout.verifyNoPendingTasks()).toEqual(true);
                expect(ngWigElement.html()).toEqual('This is a value');
              }, 100);
            });
        });
    });
});
