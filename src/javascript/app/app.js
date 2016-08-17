angular.module('myapp', ['ngWig']).run(($rootScope, $q, $timeout) => {
  $rootScope.text1 = '<h1>Lorem ipsum</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe maxime similique, ab voluptate dolorem incidunt, totam dolores illum eum ad quas odit. Magnam rerum doloribus vitae magni quasi molestias repellat.</p><ul><li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus tempora explicabo fugit unde maxime alias.</li><li>Numquam, nihil. Fugiat aspernatur suscipit voluptatum dolorum nisi numquam, fugit at, saepe alias assumenda autem.</li><li>Iste dolore sed placeat aperiam alias modi repellat dolorem, temporibus odio adipisci obcaecati, est facere!</li><li>Quas totam itaque voluptatibus dolore ea reprehenderit ut quibusdam, odit beatae aliquam, deleniti unde tempora!</li><li>Rerum quis soluta, necessitatibus. Maxime repudiandae minus at eum, dicta deserunt dignissimos laborum doloribus. Vel.</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis enim illum, iure cumque amet. Eos quisquam, nemo voluptates. Minima facilis, recusandae atque ullam illum quae iure impedit nihil dolorum hic?</p><ol><li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae ex repudiandae ratione, autem? Nulla voluptatem et soluta dolores facilis reiciendis, porro repudiandae, aperiam commodi minima repellat voluptas dignissimos corrupti itaque.</li><li>Quisquam cupiditate odit voluptatem eum quibusdam modi, facilis.</li><li>Obcaecati molestias quisquam numquam deserunt nobis recusandae perferendis.</li><li>Totam sequi quam omnis fuga, laboriosam suscipit libero.</li></ol><h1>Dolor sit amet</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur repellendus et impedit aspernatur quae fugiat doloribus possimus laborum eveniet atque quisquam quis qui quaerat, eum consectetur, id libero a facilis.</p>';
  $rootScope.text2 = '<p><i>This is really simple WYSIWYG for AngularJS!</i></p>';
  $rootScope.text3 = '<p><i>Text in disabled editor</i></p>';
  $rootScope.placeholder = 'Enter instructions here.';
  $timeout(() => {
    $rootScope.text5 = $rootScope.text2;
  }, 2000);
  $rootScope.onPaste = (e, pasteContent) => {
    return $q.when(pasteContent.slice(0, 30));
  };
}).config(['ngWigToolbarProvider', function(ngWigToolbarProvider) {
  ngWigToolbarProvider.setButtons(['formats', 'list1', 'list2', 'bold', 'italic', 'link']);
  ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
}]);
