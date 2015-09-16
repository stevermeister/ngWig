angular.module('ngWig').provider('ngWigToolbar', function () {

  var buttonLibrary = {
    list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'nw-button--unordered-list', isSimple: true},
    list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'nw-button--ordered-list', isSimple: true},
    bold: {title: 'Bold', command: 'bold', styleClass: 'nw-button--bold', isSimple: true},
    italic: {title: 'Italic', command: 'italic', styleClass: 'nw-button--italic', isSimple: true},
    link: {title: 'Link', command: 'createlink', styleClass: 'nw-button--link', isSimple: true}
  };

  var defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];

  this.setButtons = function(buttons) {
    if(!Array.isArray(buttons)) {
      throw 'Argument "buttons" should be an array';
    }

    defaultButtonsList = buttons;
  }

  this.addSimpleButton = function (name, options) {
    if (typeof name !== "string") {
      throw 'Argument "name" should be a string';
    }

    var lowerCaseName = name.toLowerCase(),
        defaultOptions = {
          title: lowerCaseName[0].toUpperCase() + lowerCaseName.slice(1),
          command: lowerCaseName,
          styleClass: 'nw-button--' + lowerCaseName
        };

    buttonLibrary[name] = angular.extend({},defaultOptions, options, {isSimple: true});
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