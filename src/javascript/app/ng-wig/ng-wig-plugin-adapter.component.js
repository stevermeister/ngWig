angular.module('ngWig')
  .component('ngWigPlugin', {
    bindings: {
      plugin: '<',
      execCommand: '=',
      editMode: '=',
      disabled: '='
    },
    controller: function($scope, $element, $compile) {
      $element.replaceWith($compile('<' + this.plugin.pluginName + ' ' +
        'plugin=' + '"$ctrl.plugin"' +
        'exec-command=' + '"$ctrl.execCommand"' +
        'edit-mode=' + '"$ctrl.editMode"' +
        'disabled=' + '"$ctrl.disabled"' +
        '/>')($scope));
    }
  });