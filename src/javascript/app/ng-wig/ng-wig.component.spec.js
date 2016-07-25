describe('component: ngWig', () => {
    let component;
    let controller;
    let scope;
    let content;
    let options;
    let buttons;
    let beforeExecCommand;
    let afterExecCommand;
    let element;
    let attrs;
    let pasteSpy;
    let beforeExecSpy;
    let afterExecSpy;
    let mocks;
    let window;
    let compile;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _$window_, _$compile_, _ngWigToolbar_) => {
        window = _$window_;
        compile = _$compile_;

        scope = _$rootScope_.$new();

        content = 'Fake text';
        element = angular.element('<div></div>');
        attrs = { $observe: () => {} };
        options = ['Option 1', 'Option 2'];
        buttons = 'button1,button2';
        pasteSpy = jasmine.createSpy('pasteSpy');
        beforeExecSpy = jasmine.createSpy('beforeExecSpy');
        afterExecSpy = jasmine.createSpy('afterExecSpy');

        mocks = {
            list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul'},
            list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol'},
            bold: {title: 'Bold', command: 'bold', styleClass: 'bold'},
            italic: {title: 'Italic', command: 'italic', styleClass: 'italic'},
            link: {title: 'Link', command: 'createlink', styleClass: 'link'}
        };

        spyOn(_ngWigToolbar_, 'getToolbarButtons').and.returnValue(mocks);
        spyOn(window.getSelection(), 'removeAllRanges');
        spyOn(window, 'prompt');
        spyOn(scope, '$broadcast');

        component = _$componentController_('ngWig', 
                                            { $scope: scope, $element: element, $attrs: attrs }, 
                                            { content: content, options: options, buttons: buttons, onPaste: pasteSpy, beforeExecCommand: beforeExecSpy, afterExecCommand: afterExecSpy }
                                            );
    }));

    function getCompiledElement(template) {
        let element = angular.element(template || '<ng-wig ng-model="text1"><ng-wig>');
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

    it('should set toolbarButtons', () => {
        expect(component.toolbarButtons).toBe(mocks);
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

            expect(window.getSelection().removeAllRanges).toHaveBeenCalled();
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

        it('should broadcast the command', () => {
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

        it('should show a prompt when the command name is createlink', () => {
            component.execCommand('createlink');

            expect(window.prompt).toHaveBeenCalledWith('Please enter the URL', 'http://');
        });

        it('should show a prompt when the command name is insertImage', () => {
            component.execCommand('insertImage');

            expect(window.prompt).toHaveBeenCalledWith('Please enter the URL', 'http://');
        });

        it('should not show a prompt', () => {
            component.execCommand('fakeCmd');

            expect(window.prompt).not.toHaveBeenCalled();
        });
    });

    it('should fail if ngModel is not provided', () => {
        expect(() => { getCompiledElement('<ng-wig><ng-wig>') }).toThrow();
    });

    describe('$onInit function', () => {
        let ngWigElement;

        it('should exist', () => {
            expect(component.$onInit).not.toBe(null);
        });

        describe('$render function', () => {
            beforeEach(() => {
                element = getCompiledElement();
                ngWigElement = angular.element(element[0].querySelector('#ng-wig-editable'));

                spyOn(controller.ngModelController, '$setViewValue');
            });

            it('should render a paragraph element if ngModel value does not exist', () => {
                expect(ngWigElement.html()).toEqual('<p></p>');
            });

            it('should the model value on blur event', () => {
                ngWigElement.triggerHandler('blur');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });

            it('should the model value on blur event', () => {
                ngWigElement.triggerHandler('blur');

                expect(controller.ngModelController.$setViewValue).toHaveBeenCalledWith('<p></p>');
            });
        });
    });
});
