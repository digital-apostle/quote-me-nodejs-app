const express = require('express');

const quoteRouter = express.Router();
// const debug = require('debug')('app:environmentRoutes');

const quoteController = require('../controllers/quote-controller');


// function router() {
  const {
    getNewQuote
  } = quoteController;

  //console.log("in router");

  // quoteRouter.route('/qoute')
  //   .post(function (req, res, next) {
  //     getNewQuote
  //   })

  quoteRouter.post('/quote', function(req, res) {
      res.send('(get) It worked ' + req);
     //getNewQuote
  });
  // quoteRouter.route('/qoute').post(function(req, res){
  //   console.log("in post quote");
  //   getNewQuote
  //   }
  // );

  // app.post('/user/all', function(req, res){
  //   Controller.Create
  // });

  // quoteRouter.route('/quote')
  //   .post(getNewQuote);

//   return quoteRouter;
// }


module.exports = quoteRouter;