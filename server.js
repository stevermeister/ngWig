var express = require('express');
var app = express();

app.use(express.static(__dirname + '/src'));
app.all('/*', function(req, res) {
  res.sendfile('index.html', { root: __dirname+'/src' });
});

//app.listen(3000);
module.exports = app;