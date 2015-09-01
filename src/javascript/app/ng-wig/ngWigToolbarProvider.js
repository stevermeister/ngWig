angular.module('ngWig').provider('ngWigToolbar', function () {
    var FORMAT_TYPE = 'format',
        BUTTON_TYPE = 'button',
        OTHER_TYPE = 'other';

    var itemLibrary = {
      button: {
          list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'nw-button--unordered-list'},
          list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'nw-button--ordered-list'},
          bold: {title: 'Bold', command: 'bold', styleClass: 'nw-button--bold'},
          italic: {title: 'Italic', command: 'italic', styleClass: 'nw-button--italic'},
          link: {title: 'Link', command: 'createlink', styleClass: 'nw-button--link'}
      },
      format: {
          p: {name: 'Normal text', value: 'p'},
          h1: {name: 'Header 1', value: 'h1'},
          h2: {name: 'Header 2', value: 'h2'},
          h3: {name: 'Header 3', value: 'h3'}
      }
    };

    var defaultConfig = {
        button: ['list1', 'list2', 'bold', 'italic', 'link'],
        format: ['p', 'h1', 'h2', 'h3'],
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

    this.setConfig = function(config) {
      defaultConfig  = config || {};
    };

    this.$get = function () {
      return {
          getToolbarButtons: function(list) {
              return getToolbarItems(BUTTON_TYPE, list);
          },
          getToolbarFormats: function() {
              return getToolbarItems(FORMAT_TYPE);
          },
          isSourceEnabled: function() {
              return defaultConfig[OTHER_TYPE] && !!~defaultConfig[OTHER_TYPE].indexOf('source');
          }
      };
    };


});