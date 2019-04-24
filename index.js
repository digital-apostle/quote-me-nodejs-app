var express = require('express');
const bodyParser = require('body-parser');
var QuoteMe = require('./QuoteMe.js')
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/quote', (req, res) => {
  console.log("/qoute request recived")
  var qm = new QuoteMe();
  console.log(req.body);
  qm.register(req.body, function (err, result) {
    
    if (result.success) {
      console.log("app.post/quoute success")
      // done(null, result)
      res.json(result)
    } else {
      console.log("app.post/quoute error")
      // done(null, false, {message: "error"})
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
