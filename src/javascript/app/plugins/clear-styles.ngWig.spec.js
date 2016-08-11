describe('component: nwClearStylesButton', () => {
    let component;
    let scope;
    let execCommand;
    let editMode = false;
    let disabled = false;
    let ngWigToolbar;
    let content = '<p>Fake text</p>';

    beforeEach(module('ngWig'));

    beforeEach(inject((_$componentController_, _$rootScope_, _ngWigToolbar_) => {
        scope = _$rootScope_.$new();
        
        ngWigToolbar = _ngWigToolbar_;

        component = _$componentController_('nwClearStylesButton', { $scope: scope }, { editMode: editMode, disabled: disabled, content: content });
    }));

    it('should expose editMode', () => {
        expect(component.editMode).toEqual(editMode);
    });

    it('should expose disabled', () => {
        expect(component.disabled).toEqual(disabled);
    });

    it('should expose content', () => {
        expect(component.content).toEqual(content);
    });

    it('should have clearStyles function', () => {
        expect(component.clearStyles).toBeDefined();
    });

    it('should be added to the button list', () => {
        let filteredButtons = ngWigToolbar.getToolbarButtons().filter(button => button.pluginName === 'nw-clear-styles-button');
        
        expect(filteredButtons.length).toEqual(1);
    });

    it('should remove styles from the content', () => {
        component.clearStyles(new MouseEvent('click'));

        expect(component.content).toEqual('Fake text');
    });
});
