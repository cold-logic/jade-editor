var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  path = require('path'),
  app = express();

app.use(express['static'](path.join(__dirname, 'public')));
app.use(bodyParser());
app.set('view engine', 'jade');

app.get('/', function(request, response) {
  //todo: make app chooser
  response.redirect('/demo');
});

app.get('/:app', function(request, response) {
  response.render('index', {
    layout: false,
    app: request.params.app
  });
});

var templateService = require('./lib/common/template-service');
services = {};
var siblings = process.argv.length > 2 && process.argv[2][0] === 'r';

var rootDir = siblings ? path.dirname(__dirname) : path.join(__dirname, 'apps');
console.log('App root is', rootDir);

var getTemplateService = function(app) {
  if (!services[app]) {
    var root = (app === 'jade-editor') ? path.dirname(__dirname) : rootDir;
    var appDir = path.join(root, app);
    services[app] = templateService.getApp(appDir);
  }
  return services[app];
};

app.get('/applications/:application/features', function(request, response) {
  var templates = getTemplateService(request.params.application);
  templates.listAll(function(err, data) {
    response.send(data);
  });
});

app.get('/applications/:application/features/all', function(request, response) {
  var templates = getTemplateService(request.params.application);
  templates.getAll(function(err, data) {
    response.send(data);
  });
});

app.get('/applications/:application/features/:feature/templates/:template', function(request, response) {
  var templates = getTemplateService(request.params.application);
  templates.getTemplate(request.params.feature, request.params.template, function(err, template) {
    response.send(err || template);
  });
});

app.get('/applications/:application/features/:feature/templates', function(request, response) {
  var templates = getTemplateService(request.params.application);
  templates.getTemplates(request.params.feature, function(err, templates) {
    response.send(err || templates);
  });
});

app.post('/applications/:application/features/:feature/templates/:templateName', function(request, response) {
  var templates = getTemplateService(request.params.application);
  templates.saveTemplate(request.params.feature, request.params.templateName,
    request.param('template'), function(err) {
      if (err) {
        console.log('template save error', err);
      }
      response.end();
    });
});


/*
var io = require('socket.io').listen(app);
//io.set('log level', 2); 
io.sockets.on('connection', function(client) {
    client.on('disconnect', function() {
        console.log('Client has connected');
    });
    client.on('message', function(event) {
        //client.json.send(jade.render(event.template, options));
        //client.send(err);
    });
    client.on('disconnect', function() {
        console.log('Client has disconnected');
    });
});
*/

var port = 8800;
app.listen(port);
console.log('Jade-editor started on port ' + port);