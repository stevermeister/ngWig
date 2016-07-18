describe('component: ngWigPlugin', () => {
    var component;
    var scope;
    var plugin;
    var execCommand;
    var editMode;
    var disabled;
    var options;
    var content;
    var element;
    var compile;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _$compile_) => {
        scope = _$rootScope_.$new();
        compile = _$compile_;

        plugin = {
            name: 'myPlugin',
            pluginName: 'my-plugin'
        };
        editMode = false;
        disabled = false;
        options = ['Option 1', 'Option 2'];
        content = 'Fake text';
        element = angular.element('<div></div>');
        execCommand = 'fakeCmd()';

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
        var pluginElement = compile('<' + component.plugin.pluginName + ' ' +
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
