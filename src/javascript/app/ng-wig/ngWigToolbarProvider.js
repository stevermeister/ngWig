angular.module('ngWig').provider('ngWigToolbar', function () {

  var buttonLibrary = {
    list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'nw-button--unordered-list'},
    list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'nw-button--ordered-list'},
    bold: {title: 'Bold', command: 'bold', styleClass: 'nw-button--bold'},
    italic: {title: 'Italic', command: 'italic', styleClass: 'nw-button--italic'},
    link: {title: 'Link', command: 'createlink', styleClass: 'nw-button--link'}
  };

  var defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];

  this.setButtons = function(buttons) {
    if(!angular.isArray(buttons)) {
      throw 'Argument "buttons" should be an array';
    }

    defaultButtonsList = buttons;
  }

  this.addSimpleButton = function (name, title, command, styleClass) {
    if (!name || !angular.isString(name)) {
      throw 'Argument "name" is required and should be a string';
    }

    if (!title || !angular.isString(title)) {
      throw 'Argument "title" is required and should be a string';
    }

    if (!command || !angular.isString(command)) {
      throw 'Argument "command" is required and should be a string';
    }

    styleClass = styleClass || '';
    buttonLibrary[name] = {title: title, command: command, styleClass: styleClass}
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
          toolbarButtons.push(buttonLibrary[buttonKey]);
        });
        return toolbarButtons;
      }
    };
  };


});