
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  calendar = require('./routes/calendar'),
  euler = require('./routes/euler'),
  path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('db connection', "tcp://postgres:5432@localhost/postgres");
});

app.configure('production', function(){
  app.set('db connection', process.env.DATABASE_URL);
});

app.get('/', routes.index);
app.get('/calendar/getItems/:num', calendar.getNItems);
app.post('/calendar/new_event', calendar.newEvent);
app.get('/calendar/next_time', calendar.nextTime);
app.get('/calendar/schedule_on_date', calendar.scheduleOnDate);
app.get('/euler', euler.answers);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
