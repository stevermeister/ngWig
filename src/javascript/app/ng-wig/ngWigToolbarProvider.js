angular.module('ngWig').provider('ngWigToolbar', function () {

  var buttonLibrary = {
    list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul'},
    list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol'},
    bold: {title: 'Bold', command: 'bold', styleClass: 'bold'},
    italic: {title: 'Italic', command: 'italic', styleClass: 'italic'},
    link: {title: 'Link', command: 'createlink', styleClass: 'link'}
  };

  var defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];

  var isButtonActive = function () {
    return this.command && document.queryCommandState(this.command);
  };

  this.setButtons = function(buttons) {
    if(!angular.isArray(buttons)) {
      throw 'Argument "buttons" should be an array';
    }

    defaultButtonsList = buttons;
  };

  this.addStandardButton = function (name, title, command, styleClass) {
    if(!name || !title || !command) {
      throw 'Arguments "name", "title" and "command" are required';
    }

    styleClass = styleClass || '';
    buttonLibrary[name] = {title: title, command: command, styleClass: styleClass}
    defaultButtonsList.push(name);
  };

  this.addCustomButton = function (name, pluginName) {
    if(!name || !pluginName) {
      throw 'Arguments "name" and "pluginName" are required';
    }

    buttonLibrary[name] = {pluginName: pluginName, isComplex: true};
    defaultButtonsList.push(name);
  };

  this.$get = function () {
    return {
      getToolbarButtons: function(list) {
        var toolbarButtons = [];
        (list || defaultButtonsList).forEach(function(buttonKey) {
          if(!buttonLibrary[buttonKey]) {
            throw 'There is no "' + buttonKey + '" in your library. Possible variants: ' + Object.keys(buttonLibrary);
          }

          var button = angular.copy(buttonLibrary[buttonKey]);

          if(!angular.isFunction(button.isActive)) {
            button.isActive = isButtonActive;
          }

          toolbarButtons.push(button);
        });
        return toolbarButtons;
      }
    };
  };


});