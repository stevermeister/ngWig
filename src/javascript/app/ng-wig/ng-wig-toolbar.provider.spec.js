describe('provider: ngWigToolbar', () => {
    let toolbarProvider;
    
    beforeEach(() => {
        module('ngWig', (_ngWigToolbarProvider_) => {
            toolbarProvider = _ngWigToolbarProvider_;
        });

        inject();
    });

    describe('setButtons function', () => {
        it('should exist', () => {
            expect(toolbarProvider.setButtons).toBeDefined();
        });

        it('should throw an error if buttons are not provided', () => {
            expect(() => { toolbarProvider.setButtons() }).toThrow('Argument "buttons" should be an array');
        });

        it('should not throw an error if buttons are provided', () => {
           expect(() => { toolbarProvider.setButtons(['button1', 'button2']) }).not.toThrow();
        });
    });

    describe('addStandardButton function', () => {
        it('should exist', () => {
            expect(toolbarProvider.addStandardButton).toBeDefined();
        });

        it('should throw an error if name/title/command is not provided', () => {
            let errorMsg = 'Arguments "name", "title" and "command" are required';
            
            expect(() => toolbarProvider.addStandardButton()).toThrow(errorMsg);
            expect(() => toolbarProvider.addStandardButton('button1')).toThrow(errorMsg);
            expect(() => toolbarProvider.addStandardButton('button1', 'My button')).toThrow(errorMsg);
        });

        it('should not throw an error if name, title and command are provided', () => {
            expect(() => { toolbarProvider.addStandardButton('button1', 'My button', 'fakeCmd()') }).not.toThrow();
        });
    });

    describe('addCustomButton function', () => {
        it('should exist', () => {
            expect(toolbarProvider.addCustomButton).toBeDefined();
        });

        it('should throw an error if name/plugin is not provided', () => {
            let errorMsg = 'Arguments "name" and "pluginName" are required';

            expect(() => { toolbarProvider.addCustomButton() }).toThrow(errorMsg);
            expect(() => { toolbarProvider.addCustomButton('button1') }).toThrow(errorMsg);
        });
        
        it('should not throw an error if name and pluginName are provided', () => {
            expect(() => { toolbarProvider.addCustomButton('button1', 'my-button') }).not.toThrow();
        });
    });

    describe('$get function', () => {
        it('should exist', () => {
            expect(toolbarProvider.$get).toBeDefined();
        });

        describe('getToolbarButtons function', () => {
            it('should exist', inject(() => {
                expect(toolbarProvider.$get().getToolbarButtons).toBeDefined();
            }));

            it('should throw an error if provided buttons have not been added first', () => {
                expect(() => {
                    toolbarProvider.$get().getToolbarButtons(['button1'])
                }).toThrow('There is no "button1" in your library. Possible variants: list1,list2,bold,italic,link,clear-styles,forecolor,formats');
            });
            
            it('should return 8 buttons by default', () => {
                expect(toolbarProvider.$get().getToolbarButtons().length).toEqual(8);
            });

            it('should return 1 button', () => {
                toolbarProvider.addCustomButton('button1', 'my-button');

                expect(toolbarProvider.$get().getToolbarButtons(['button1']).length).toEqual(1);
            });

            describe('isActive function', () => {
                it('should be set to a button', () => {
                    toolbarProvider.addCustomButton('button1', 'my-button');

                    expect(toolbarProvider.$get().getToolbarButtons(['button1'])[0].isActive).toBeDefined();
                });

                it('should return false if there is no command', () => {
                    toolbarProvider.addCustomButton('button1', 'my-button');

                    expect(toolbarProvider.$get().getToolbarButtons(['button1'])[0].isActive()).toEqual(false);
                });

                it('should return false if queryCommandState returns false', () => {
                    spyOn(document, 'queryCommandState').and.returnValue(false);
                    toolbarProvider.addStandardButton('button1', 'my-button', 'fakeCmd');

                    expect(toolbarProvider.$get().getToolbarButtons(['button1'])[0].isActive()).toEqual(false);
                });

                it('should return true', () => {
                    spyOn(document, 'queryCommandState').and.returnValue(true);
                    toolbarProvider.addStandardButton('button1', 'my-button', 'fakeCmd');

                    expect(toolbarProvider.$get().getToolbarButtons(['button1'])[0].isActive()).toEqual(true);
                });
            });
        });
    });
});
