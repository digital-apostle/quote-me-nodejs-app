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
  healthResponse.setServiceStatus("healthy");
  res.json(healthResponse);
});

app.post('/quote', (req, res) => {
  console.log("/quote request recieved")

  // get an instance of quote generator (?)
  var qm = new quoteMe();
  console.log(req.body);

  //call 
  qm.register(req.body, function (err, result) {
    
    if (result.success) {
      console.log("app.post/quote success")
      res.json(result)
    } else {
      console.log("app.post/quote error")
      res.json(result)
    }
  });
});

//app.get quote

var port = 3000;

app.listen(port);

console.log("listening on port 3000");