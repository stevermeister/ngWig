describe('component: nwFormatsButton', () => {
    var component;
    var scope;
    var execCommand;
    var editMode;
    var disabled;
    var formats;
    var ngWigToolbar;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _ngWigToolbar_) => {
        scope = _$rootScope_.$new();
        
        ngWigToolbar = _ngWigToolbar_;

        execCommand = 'fakeCmd()';
        editMode = false;
        disabled = false;
        formats = [
             { name: 'Normal text', value: '<p>' },
             { name: 'Header 1', value: '<h1>' },
             { name: 'Header 2', value: '<h2>' },
             { name: 'Header 3', value: '<h3>' }
        ];

        component = _$componentController_('nwFormatsButton', { $scope: scope }, { execCommand: execCommand, editMode: editMode, disabled: disabled });
    }));
    
    it('should expose execCommand', () => {
        expect(component.execCommand).toEqual(execCommand);
    });

    it('should expose editMode', () => {
        expect(component.editMode).toEqual(false);
    });

    it('should expose disabled', () => {
        expect(component.disabled).toEqual(false);
    });

    it('should populate formats list', () => {
        expect(component.formats).toEqual(formats);
    });

    it('should set a format by default',() => {
        expect(component.format).toEqual(formats[0]);
    });

    it('should be added to the button list', () => {
        var filteredButtons = ngWigToolbar.getToolbarButtons().filter(button => button.pluginName === 'nw-formats-button');
        
        expect(filteredButtons.length).toEqual(1);
    });
});
