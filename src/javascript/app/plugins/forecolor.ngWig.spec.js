describe('component: nwForecolorButton', () => {
    var component;
    var scope;
    var execCommand;
    var editMode;
    var disabled;
    var mocks;
    var ngWigToolbar;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _ngWigToolbar_) => {
        scope = _$rootScope_.$new();
        mocks = { name: "fontcolor.color", value: "#ff0000" };

        ngWigToolbar = _ngWigToolbar_;
        
        execCommand = 'fakeCmd()';
        editMode = false;
        disabled = false;

        component = _$componentController_('nwForecolorButton', { $scope: scope }, { execCommand: execCommand, editMode: editMode, disabled: disabled });
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

    it('should call foreColor execCommand', function(){
        spyOn(component, 'execCommand');

        scope.$emit('colorpicker-selected', mocks);

        expect(component.execCommand).toHaveBeenCalledWith('foreColor', mocks.value);
    });

    it('should be added to the button list', () => {
        var filteredButtons = ngWigToolbar.getToolbarButtons().filter(button => button.pluginName === 'nw-forecolor-button');
        
        expect(filteredButtons.length).toEqual(1);
    });
});
