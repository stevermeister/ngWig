describe('component: ngWigPlugin', () => {
    let component;
    let scope;
    let plugin = {
        name: 'myPlugin',
        pluginName: 'my-plugin'
    };
    let execCommand = 'fakeCmd()';
    let editMode = false;
    let disabled = false;
    let options = ['Option 1', 'Option 2'];
    let content = 'Fake text';
    let element = angular.element('<div></div>');
    let compile;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _$compile_) => {
        scope = _$rootScope_.$new();
        compile = _$compile_;

        spyOn(element, 'replaceWith');
        
        component = _$componentController_('ngWigPlugin', 
                                            { $scope: scope, $element: element }, 
                                            { plugin: plugin, execCommand: execCommand, editMode: editMode, disabled: disabled, options: options, content: content }
                                            );
    }));
    
    it('should expose plugin', () => {
        expect(component.plugin).toEqual(plugin);
    });

    it('should expose execCommand', () => {
        expect(component.execCommand).toEqual(execCommand);
    });

    it('should expose editMode', () => {
        expect(component.editMode).toEqual(editMode);
    });

    it('should expose disabled', () => {
        expect(component.disabled).toEqual(disabled);
    });

    it('should expose options', () => {
        expect(component.options).toEqual(options);
    });

    it('should expose content', () => {
        expect(component.content).toEqual(content);
    });

    it('should replace with the plugin template', () => {
        component.$onInit();
        
        let pluginElement = compile('<' + component.plugin.pluginName + ' ' +
        'plugin=' + '"$ctrl.plugin"' +
        'exec-command=' + '"$ctrl.execCommand"' +
        'edit-mode=' + '"$ctrl.editMode"' +
        'disabled=' + '"$ctrl.disabled"' +
        'options=' + '"$ctrl.options"' +
        'content=' + '"$ctrl.content"' +
        '/>')(scope);
        
        expect(element.replaceWith).toHaveBeenCalledWith(pluginElement);
    });
});
