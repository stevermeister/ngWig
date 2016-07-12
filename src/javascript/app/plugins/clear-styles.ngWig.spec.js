describe('component: nwClearStylesButton', () => {
    var component;
    var scope;
    var execCommand;
    var editMode;
    var disabled;

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_) => {
        scope = _$rootScope_.$new();

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
});
