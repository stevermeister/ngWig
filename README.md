ngWig
=====

## Dependencies

*it's only AngularJS! No jQuery or other WYSIWYG monsters*

 - ng-wig2+ - Angular1.3+
 - ng-wig3+ - Angular1.5+
 
 Also suports latest Angular1.6


## Usage

    angular.module('yourApp', ['ngWig'])

it's just attribute directive for textarea:

    <ng-wig ng-model="text1"></ng-wig>
    
    
## Sanitization    

**Important:** ngWig is light weight solution that **does not include sanitization module**. So it's your own responsiblity to be sure that contecnt that you placed there is already checked and does not have any possible injections.
Credits to [@MacJu](https://github.com/MacJu) for highlighting the issue.

## Installation

ngWig could be simply installed via npm:

    npm install ng-wig

or via bower:

    bower install ng-wig

## CDN

    https://cdnjs.cloudflare.com/ajax/libs/ng-wig/3.0.14/ng-wig.min.js

    https://cdnjs.cloudflare.com/ajax/libs/ng-wig/3.0.14/ng-wig.js

    https://cdnjs.cloudflare.com/ajax/libs/ng-wig/3.0.14/css/ng-wig.css

## Always last version CDN
    https://cdn.rawgit.com/stevermeister/ngWig/master/dist/ng-wig.min.js

    https://cdn.rawgit.com/stevermeister/ngWig/master/dist/ng-wig.js

    https://cdn.rawgit.com/stevermeister/ngWig/master/dist/css/ng-wig.css


[Demo] (http://stevermeister.github.io/ngWig/demo/)

[![Screenshot] (http://stevermeister.github.io/ngWig/images/ng-wig-demo.png)](http://stevermeister.github.io/ngWig/demo/)


## Examples

### Quick start ([plunker](https://plnkr.co/edit/IaTeHRUdWU1WUJnUiftl?p=preview))

    <ng-wig ng-model="text1"></ng-wig>

### Disabled ([plunker](https://plnkr.co/edit/og1wRflbWfqyC8S4edzs?p=preview))

    <ng-wig ng-model="text1" ng-disabled="true"></ng-wig>

### Edit Source option ([plunker](https://plnkr.co/edit/JVOI2l2gnZMKORMWjAEZ?p=preview))

    <ng-wig ng-model="text1" source-mode-allowed></ng-wig>

### Placeholder ([plunker](https://plnkr.co/edit/yXZkpyHcb47rbXfTHs31?p=preview))

    <ng-wig ng-model="text1" placeholder="'Enter instructions here.'"></ng-wig>

### ngModel sync ([plunker](https://plnkr.co/edit/8owI0CDjoos8DArlc10g?p=preview))

    <ng-wig ng-model="text1"></ng-wig>
    <ng-wig ng-model="text1"></ng-wig>

### Set buttons ([plunker](https://plnkr.co/edit/9Fjqwnf74jJAKNx2cMYI?p=preview))

    <ng-wig ng-model="text1" buttons="formats, bold, italic"></ng-wig>

### Setup generic buttons ([plunker](https://plnkr.co/edit/XteWPwo0eQ1gz4L6cpDr?p=preview))

    .config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
      ngWigToolbarProvider.setButtons(['bold', 'italic']);
    }]);

### Add standard buttons ([plunker](https://plnkr.co/edit/Avi90RnnoTPGWzosQHQo?p=preview))

    .config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
      ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
    }]);

### Add custom button (plugin) ([plunker](https://plnkr.co/edit/Ik2fmPzDu6ecifUqVICv?p=preview))

- Javascript:

        angular.module('ngWig').config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
            ngWigToolbarProvider.addCustomButton('my-custom', 'nw-my-custom-button');
        }])
        .component('nwMyCustomButton', {
            template: '<button class="nw-button my-custom" title="My Custom Button" ng-click="$ctrl.click()">My Custom Button</button>',
            controller: function() {
                this.click = function(){
                    alert('My Custom Button');
                };
            }
        });

- CSS:

        .nw-button.my-custom:before {
            content: '\f1b3';
        }

### OnPaste Hook ([plunker](https://plnkr.co/edit/dsvfoDZw8CPVrNo9R6Bv?p=preview))

        <ng-wig ng-model="text1" on-paste="onPaste($event, pasteContent)"></ng-wig>

### Formats (plugin) ([plunker](https://plnkr.co/edit/TgKThPQjlG4ctzGYk6Kq?p=preview))
        <ng-wig ng-model="text1" buttons="formats"></ng-wig>

### Forecolor (plugin) ([plunker](https://plnkr.co/edit/2hmkjBJHs7tTyOU7TDIH?p=preview))
        <ng-wig ng-model="text1" buttons="forecolor"></ng-wig>

### Clear Styles (plugin) ([plunker](https://plnkr.co/edit/j8FtcMAVkLSztZ6V0ION?p=preview))
        <ng-wig ng-model="text1" buttons="clear-styles"></ng-wig>

## Contribution (Development Setup)

    npm install
    npm run devSetup


## Creating plugins
