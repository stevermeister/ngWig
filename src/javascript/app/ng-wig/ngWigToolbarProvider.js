angular.module('ngWig').provider('ngWigToolbarProvider', function () {

  var standardToolbarButtons = [
    {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'nw-button--unordered-list'},
    {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'nw-button--ordered-list'},
    {title: 'Bold', command: 'bold', styleClass: 'nw-button--bold'},
    {title: 'Italic', command: 'italic', styleClass: 'nw-button--italic'},
    {title: 'Link', command: 'createlink', styleClass: 'nw-button--link'}
  ];

  this.$get = function () {
    return {
      buttons: standardToolbarButtons
    };
  };


});