const express = require('express');
const bodyParser = require('body-parser');
const quoteMe = require('./lib/quote-me.js');
const health = require("./models/Health");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  const message = '{"message":"Ping OK"}';
  res.json(JSON.parse(message));
});

app.get('/health', (req, res) => {
  let healthResponse = new health();
  healthResponse.serviceStatus("healthy");
  healthResponse.serviceStatus("healthy");
  res.json(healthResponse);
});

app.post('/quote', (req, res) => {
  console.log("/qoute request recived")
  var qm = new quoteMe();
  console.log(req.body);
  qm.register(req.body, function (err, result) {
    
    if (result.success) {
      console.log("app.post/quoute success")
      res.json(result)
    } else {
      console.log("app.post/quoute error")
      res.json(result)
    }
  });
});

//const quoteRouter = require('./routes/quote-routes');

//app.use('/', mainRouter);
//app.use('/', quoteRouter);


var port = 3000;

app.listen(port);

console.log("listening on port 3000");

//module.exports = app;
