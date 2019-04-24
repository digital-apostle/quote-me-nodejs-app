//const debug = require('debug')('app:regionController');
//const QuoteMe = require('../QuoteMe')

function quoteController() {
  function getNewQuote(req, res) {
    // var qm = new QuoteMe();
    // qm.register(req, function (err, result) {
      
    //   if (result.success) {
    //     console.log("app.post/quoute success")
    //     // done(null, result)
    //     res.json(result)
    //   } else {
    //     console.log("app.post/quoute error")
    //     // done(null, false, {message: "error"})
    //     res.json(result)
    //   }
    // });
    console.log("in getNewQuote");
    res.send('(get) It worked ' + req);
  }

  return {
    getNewQuote
  };
}

module.exports = quoteController;