describe('component: nwForecolorButton', () => {
    var component;
    var scope;
    var execCommand;
    var editMode;
    var disabled;
    var mocks;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_) => {
        scope = _$rootScope_.$new();

        mocks = { name: "fontcolor.color", value: "#ff0000" };
        
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
});
