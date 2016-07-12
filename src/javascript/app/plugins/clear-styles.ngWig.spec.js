describe('component: nwClearStylesButton', () => {
    var component;
    var scope;
    var execCommand;
    var editMode;
    var disabled;
    var ngWigToolbar;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _ngWigToolbar_) => {
        scope = _$rootScope_.$new();
        
        ngWigToolbar = _ngWigToolbar_;

        editMode = false;
        disabled = false;

        component = _$componentController_('nwClearStylesButton', { $scope: scope }, { editMode: editMode, disabled: disabled });
    }));

    it('should expose editMode', () => {
        expect(component.editMode).toEqual(false);
    });

    it('should expose disabled', () => {
        expect(component.disabled).toEqual(false);
    });

    it('should have clearStyles function', () => {
        expect(component.clearStyles).toBeDefined();
    });

    it('should be added to the button list', () => {
        var filteredButtons = ngWigToolbar.getToolbarButtons().filter(button => button.pluginName === 'nw-clear-styles-button');
        
        expect(filteredButtons.length).toEqual(1);
    });
});
