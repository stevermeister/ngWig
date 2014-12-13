/**
 * Allow dynamic binding to html
 * require angular-sanitize module loaded
 * to use;
 * <ng-wig-html to-bind="text2"></ng-wig-html>
 * 'text2' is the actual model assign in the ng-wig directive 
**/
angular.module('ngWig').directive('ngWigHtml', function ($compile) {
	 return {
        restrict: "AE",
		link: function(scope, element, attr)  {
			var ele = $compile('<div ng-bind-html="'+attr.toBind+'"></div>')(scope);
			element.replaceWith(ele);
		}
    }
});