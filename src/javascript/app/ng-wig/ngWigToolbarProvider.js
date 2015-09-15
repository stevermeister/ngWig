angular.module('ngWig').provider('ngWigToolbar', function () {
    var buttonLibrary = {
        list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'nw-button--unordered-list'},
        list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'nw-button--ordered-list'},
        bold: {title: 'Bold', command: 'bold', styleClass: 'nw-button--bold'},
        italic: {title: 'Italic', command: 'italic', styleClass: 'nw-button--italic'},
        link: {title: 'Link', command: 'createlink', styleClass: 'nw-button--link'}
    };

    var defaultConfig = {
        button: ['list1', 'list2', 'bold', 'italic', 'link'],
        other: ['source']
    };

    function getToolbarItems(type, list) {
        var items = [],
            library = itemLibrary[type],
            defaultList = defaultConfig[type] || [];

        (list || defaultList).forEach(function (key) {
            if (!library[key]) {
                throw 'There is no "' + key + '" in your library. Possible variants: ' + Object.keys(library);
            }
            items.push(library[key]);
        });
        return items;
    }

    function addToConfig(type, name) {
        if (Array.isArray(defaultConfig[type])) {
            defaultConfig[type].push(name);
        } else {
            defaultConfig[type] = [name];
        }
    }

    this.setConfig = function (config) {
        defaultConfig = config || {};
    };

    this.addButton = function (name, options) {
        if (typeof name !== "string") {
            throw 'Argument "name" is required and should be string';
        }

        var lowerCaseName = name.toLowerCase(),
            defaultOptions = {
                title: lowerCaseName[0].toUpperCase() + lowerCaseName.slice(1),
                command: lowerCaseName,
                styleClass: 'nw-button--' + lowerCaseName
            };

        buttonLibrary[name] = angular.extend({}, defaultOptions, options);
        addToConfig('button', name);
    };

    this.$get = function () {
        return {
            getToolbarButtons: function (list) {
                var toolbarButtons = [],
                    defaultButtonsList = defaultConfig['button'] || [];

                (list || defaultButtonsList).forEach(function (buttonKey) {
                    if (!buttonLibrary[buttonKey]) {
                        throw 'There is no "' + buttonKey + '" in your library. Possible variants: ' + Object.keys(buttonLibrary);
                    }
                    toolbarButtons.push(buttonLibrary[buttonKey]);
                });
                return toolbarButtons;
            },
            isSourceEnabled: function () {
                return defaultConfig['other'] && !!~defaultConfig['other'].indexOf('source');
            }
        };
    };
});