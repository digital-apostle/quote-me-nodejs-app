// var events = require("events");
// var util = require("util");
var quoteGenerator = require("./quote-generator");
    
var quoteMe = function () {
 // var self = this;
 // events.EventEmitter.call(self);

  //self.register = function(req,next){

    var quoteApp = new quoteGenerator();

   /* quoteApp.on("quote-processed", function(QuoteResult){
      console.log("quote-processed event");
      self.emit("quote-processed",QuoteResult);
    });
    quoteApp.on("quote-processing-error", function(QuoteResult){
      console.log("quote-processing-error event");
      self.emit("quote-processing-error",QuoteResult);
    }); */

    // pass our callback function, from app.js /post quote  
    // this can be called directly from app.js.  Just require QuoteGen and the call genPolicyQuote
    quoteApp.generatePolicyQuote(req, next);

  //};

  // return self;
};

//util.inherits(quoteMe, events.EventEmitter);

module.exports = quoteMe;