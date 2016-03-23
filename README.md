ngWig
=====

##Dependancies

*it's only AngularJS! No jQuery or other WYSIWYG monsters*

 - ng-wig2+ - Angular1.3+
 - ng-wig3+ - Angular1.5+


##Usage
it's just attribute directive for textarea:

    <ng-wig ng-model="text1"></ng-wig>

##Installation

ngWig could be simply installed via npm:

    npm install ng-wig

or via bower:

    bower install ng-wig

##CDN




More information on [ngWig site](http://stevermeister.github.io/ngWig/)

[Demo] (http://stevermeister.github.io/ngWig/demo/)  

[![Screenshot] (http://stevermeister.github.io/ngWig/images/ng-wig-demo.png)](http://stevermeister.github.io/ngWig/demo/)


##Examples

- Quick start - https://plnkr.co/edit/IaTeHRUdWU1WUJnUiftl?p=preview
- Disabled - https://plnkr.co/edit/og1wRflbWfqyC8S4edzs?p=preview
- Edit Source option - https://plnkr.co/edit/JVOI2l2gnZMKORMWjAEZ?p=preview
- ngModel sync - https://plnkr.co/edit/8owI0CDjoos8DArlc10g?p=preview
- Set buttons - https://plnkr.co/edit/9Fjqwnf74jJAKNx2cMYI?p=preview
- Setup generic buttons ???- https://plnkr.co/edit/clNHorPs4pyIPKhy1uLH?p=preview
- Add standard buttons - 
- OnPaste Hook - 

If you need access to the pasted content you can provide a function to be called when `paste` event is fired.

```js
// in your controller
var doSomething = function(pasteContent){
    return pasteContent.slice(0, 33);
};

$scope.onPaste = function(pasteEvent, originalTextContent){
    // here you can cancel the event
    // or just alter the pasteContent
    var pasteContent = (pasteEvent.originalEvent || pasteEvent).clipboardData.getData('text/plain');
    // here you can return the new content using a promise
    return $q.when(originalTextContent + paste.content.slice(0, 33));
    // or just paste
    //document.execCommand('insertHTML', false, doSomething(pasteContent));
};
```
    <ng-wig ng-model="text1" on-paste="onPaste"></ng-wig>

## Contribution (Development Setup)

    npm install
    npm run devSetup
    
    
## Creating plugins
