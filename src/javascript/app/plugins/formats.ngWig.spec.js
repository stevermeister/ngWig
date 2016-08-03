describe('component: nwFormatsButton', () => {
    let component;
    let scope;
    let execCommand = 'fakeCmd()';
    let editMode = false;
    let disabled = false;
    let formats = [
             { name: 'Normal text', value: '<p>' },
             { name: 'Header 1', value: '<h1>' },
             { name: 'Header 2', value: '<h2>' },
             { name: 'Header 3', value: '<h3>' }
        ];
    let ngWigToolbar;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _ngWigToolbar_) => {
        scope = _$rootScope_.$new();
        
        ngWigToolbar = _ngWigToolbar_;

        component = _$componentController_('nwFormatsButton', { $scope: scope }, { execCommand: execCommand, editMode: editMode, disabled: disabled });
    }));
    
    it('should expose execCommand', () => {
        expect(component.execCommand).toEqual(execCommand);
    });

    it('should expose editMode', () => {
        expect(component.editMode).toEqual(editMode);
    });

    it('should expose disabled', () => {
        expect(component.disabled).toEqual(disabled);
    });

    it('should populate formats list', () => {
        expect(component.formats).toEqual(formats);
    });

    it('should set a format by default',() => {
        expect(component.format).toEqual(formats[0]);
    });

    it('should be added to the button list', () => {
        let filteredButtons = ngWigToolbar.getToolbarButtons().filter(button => button.pluginName === 'nw-formats-button');
        
        expect(filteredButtons.length).toEqual(1);
    });
});
