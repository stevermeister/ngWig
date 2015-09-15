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
      if(!Array.isArray(buttons)) {
          throw 'Argument "buttons" should be an array';
      }

      defaultButtonsList = buttons;
  }

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