describe('component: nwForecolorButton', () => {
    let component;
    let scope;
    let execCommand = 'fakeCmd()';
    let editMode = false;
    let disabled = false;
    let mocks = { name: "fontcolor.color", value: "#ff0000" };
    let ngWigToolbar;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _ngWigToolbar_) => {
        scope = _$rootScope_.$new();

        ngWigToolbar = _ngWigToolbar_;

        component = _$componentController_('nwForecolorButton', { $scope: scope }, { execCommand: execCommand, editMode: editMode, disabled: disabled });
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

    it('should call foreColor execCommand', () => {
        spyOn(component, 'execCommand');

        scope.$emit('colorpicker-selected', mocks);

        expect(component.execCommand).toHaveBeenCalledWith('foreColor', mocks.value);
    });

    it('should be added to the button list', () => {
        let filteredButtons = ngWigToolbar.getToolbarButtons().filter(button => button.pluginName === 'nw-forecolor-button');
        
        expect(filteredButtons.length).toEqual(1);
    });
});
