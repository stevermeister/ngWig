angular.module('ngWig')
  .component('ngWigPlugin', {
    bindings: {
      plugin: '<',
      execCommand: '=',
      editMode: '=',
      disabled: '=',
      options: '<',
      content: '='
    },
    controller: function($scope, $element, $compile) {
      var $ctrl = this;
      this.$onInit = function() {
        $element.replaceWith($compile('<' + $ctrl.plugin.pluginName + ' ' +
        'plugin=' + '"$ctrl.plugin"' +
        'exec-command=' + '"$ctrl.execCommand"' +
        'edit-mode=' + '"$ctrl.editMode"' +
        'disabled=' + '"$ctrl.disabled"' +
        'options=' + '"$ctrl.options"' +
        'content=' + '"$ctrl.content"' +
        '/>')($scope));
      }
      
    }
  });