
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('catsonyourkeyboard'));
app.use(express.session());
app.use(express.limit('5gb'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: "./public/uploads" }));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', function(req, res, next){
  var _path = req.files.fileName.path;
  setTimeout(function(){
    fs.unlink(req.files.fileName.path, function(err){
      if(err) throw err;
      console.log("deleted " + req.files.fileName.path);
    });
  }, 86400);
  res.render('uploadComplete', {path: req.files.fileName.path.replace('/public', '')});
});

app.get('/public/uploads/:file', function(req, res){
  res.redirect('/uploads/' + req.params.file);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
