ngWig
=====

##Usage
it's just attribute directive for textarea:

    <textarea ng-wig="text1" class="editor1"></textarea>

##Installation

ngWig could be simply installed via npm:

    npm install ng-wig

or via bower:

    bower install ng-wig

More information on [ngWig site](http://stevermeister.github.io/ngWig/)

[Demo] (http://stevermeister.github.io/ngWig/demo/)  

[![Screenshot] (http://stevermeister.github.io/ngWig/images/ng-wig-demo.png)](http://stevermeister.github.io/ngWig/demo/)

##OnPaste Hook

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
    <textarea ng-wig="text1" on-paste="onPaste" class="editor1"></textarea>

## Development Setup

    npm install
    npm run devSetup
