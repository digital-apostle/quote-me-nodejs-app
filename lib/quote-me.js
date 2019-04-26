var events = require("events");
var util = require("util");
var quoteApplication = require("./quote-application");
    
var quoteMe = function () {
  var self = this;
  events.EventEmitter.call(self);

  //self.register = function(email,password,confirm,next){
  self.register = function(req,next){

    //console.log(req);

    var reg = new quoteApplication();

    reg.on("quote-processed", function(QuoteResult){
      console.log("quote-processed event");
      self.emit("quote-processed",QuoteResult);
    });
    reg.on("quote-processing-error", function(QuoteResult){
      console.log("quote-processing-error event");
      self.emit("quote-processing-error",QuoteResult);
     // return QuoteResult;
    });
    reg.applyForQuote(req, next);

  };

  return self;
};

util.inherits(quoteMe, events.EventEmitter);

module.exports = quoteMe;