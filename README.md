ngWig
=====

##Dependencies

*it's only AngularJS! No jQuery or other WYSIWYG monsters*

 - ng-wig2+ - Angular1.3+
 - ng-wig3+ - Angular1.5+


##Usage

    angular.module('yourApp', ['ngWig'])

it's just attribute directive for textarea:

    <ng-wig ng-model="text1"></ng-wig>

##Installation

ngWig could be simply installed via npm:

    npm install ng-wig

or via bower:

    bower install ng-wig

##CDN

    https://cdn.rawgit.com/stevermeister/ngWig/master/dist/ng-wig.min.js

    https://cdn.rawgit.com/stevermeister/ngWig/master/dist/ng-wig.js

    https://cdn.rawgit.com/stevermeister/ngWig/master/dist/css/ng-wig.css


[Demo] (http://stevermeister.github.io/ngWig/demo/)

[![Screenshot] (http://stevermeister.github.io/ngWig/images/ng-wig-demo.png)](http://stevermeister.github.io/ngWig/demo/)


##Examples

### Quick start ([plunker](https://plnkr.co/edit/IaTeHRUdWU1WUJnUiftl?p=preview))
  ```<ng-wig ng-model="text1"></ng-wig>```

###Disabled ([plunker](https://plnkr.co/edit/og1wRflbWfqyC8S4edzs?p=preview))

  ```<ng-wig ng-model="text1" ng-disabled="true"></ng-wig>```

###Edit Source option ([plunker](https://plnkr.co/edit/JVOI2l2gnZMKORMWjAEZ?p=preview))

  ```<ng-wig ng-model="text1" source-mode-allowed></ng-wig>```

###ngModel sync ([plunker](https://plnkr.co/edit/8owI0CDjoos8DArlc10g?p=preview))

  ```  <ng-wig ng-model="text1"></ng-wig>
       <ng-wig ng-model="text1"></ng-wig>```

###Set buttons ([plunker](https://plnkr.co/edit/9Fjqwnf74jJAKNx2cMYI?p=preview))

  ```<ng-wig ng-model="text1" buttons="formats, bold, italic"></ng-wig>```

###Setup generic buttons ([plunker](https://plnkr.co/edit/XteWPwo0eQ1gz4L6cpDr?p=preview))

    .config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
      ngWigToolbarProvider.setButtons(['bold', 'italic']);
    }]);

###Add standard buttons ([plunker](https://plnkr.co/edit/Avi90RnnoTPGWzosQHQo?p=preview))

    .config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
      ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
    }]);

###Add custom buttons (plugin) ([plunker](https://plnkr.co/edit/vAKfMFRt9DAbUXSmUEFA?p=preview))


    angular.module('ngWig').config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
     ngWigToolbarProvider.addCustomButton('forecolor', 'nw-forecolor-button');
    }])
    .component('nwForecolorButton', {
      template: '<button colorpicker ng-model="fontcolor" ng-disabled="editMode" colorpicker-position="right" class="nw-button font-color" title="Font Color" ng-disabled="isDisabled">Font Color</button>',
      controller: function($scope) {
        $scope.$on('colorpicker-selected', function($event, color) {
          $scope.$emit('execCommand', {command: 'foreColor', options: color.value});
        });
      }
    });

###OnPaste Hook ([plunker](https://plnkr.co/edit/dsvfoDZw8CPVrNo9R6Bv?p=preview))

    ```<ng-wig ng-model="text1" on-paste="onPaste($event, pasteContent)"></ng-wig>```

###Clear Styles button (plugin) ([plunker](https://plnkr.co/edit/j8FtcMAVkLSztZ6V0ION?p=preview))
<br>
<br>

## Contribution (Development Setup)

    npm install
    npm run devSetup


## Creating plugins
