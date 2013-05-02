var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    config = require('./config'),
    db = new mongodb.Server(config.mongodb.host, config.mongodb.port, {}),
    hbs = require('express-hbs');

hbs.registerHelper('print', function(obj) {
  var props=[];

  for(var prop in obj) {
    props.push("<dt>"+prop+"</dt>");
    props.push("<dd>"+obj[prop]+"</dd>");
  }

  return new hbs.SafeString("<dl>"+props.join("")+"</dl>");
});

app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layouts/application',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));

mongodb.Db.connect(config.mongodb.url, function(error, client) {
 var dbRequests = new mongodb.Collection(client, 'requests');

  app.post('/callback', function(req, res) {

    console.log(req.body);

    var doc = {
      received: new Date(),
      ip: req.ip,
      path: req.path,
      query: req.query,
      body: req.body,
      rawBody: req.rawBody
    };

    dbRequests.insert(doc, function(err) {
      res.send(200);
    });
  });

  app.get('/', function(req, res) {
    var reqs = dbRequests.find({}, { limit: 10 }).sort({$natural: -1}).toArray(function(err, docs) {
      console.log(docs);
      res.render('index', { reqs: docs });
    });
  });

  app.listen(3001);
});