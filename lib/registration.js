var Quote = require("../models/quote");
var QuoteRequest = require("../models/QuoteRequest");
var Emitter = require("events").EventEmitter;
var util = require("util");

//A wrapper object for our registration call result
var QuoteResult = function(){
  var result = {
    success : false,
    message : null,
    quote : null
  };
  return result;
};

//This is the prototype which we will export
var Registration = function(db){
  Emitter.call(this);
  var self = this;
  var continueWith = null;

  var validateInputs = function(rfq){
    console.log("validateInputs");
    //make sure there's an email and password
    if(!rfq.email || false){
      rfq.setInvalid("Email and password are required");
      self.emit("invalid",rfq);
    }else if(false){
      rfq.setInvalid("Passwords don't match");
      self.emit("invalid",rfq);
    }else{
      rfq.validate();
      self.emit("validated",rfq);
    }

  };

  var getBasePremium = function(rfq){
    console.log("getBasePremium");
    self.emit("calculated-base-premium",rfq);
  };

  var applyGenderFactors = function(rfq){
    console.log("applyGenderFactors");
    self.emit("gender-factors-applied",rfq);
  };

  var applyAgeFactors = function(rfq){
    console.log("applyAgeFactors");
    self.emit("age-factors-applied",rfq);
  };

  var applyCarTypeFactors = function(rfq){
    console.log("applyCarTypeFactors");
    self.emit("car-type-factors-applied",rfq);
  };

  var applyCarColourFactors = function(rfq){
    console.log("applyCarColourFactors");
    self.emit("car-colour-factors-applied",rfq);
  };

  self.applyForQuote = function(args, next){
    console.log("applyForQuote invoked");
    continueWith = next;
    var rfq = new QuoteRequest(args);
    console.log("rfq ="+JSON.stringify(rfq));
    self.emit("quote-request-received",rfq);
  };

  //the final call if everything works as expected
  var quoteCompleteOK = function(rfq){
    var quoteResult = new QuoteResult();
    quoteResult.success = true;
    quoteResult.quote = rfq.Quote;
    console.log("quoteCompleteOK ");
    self.emit("quote-processed", quoteResult);
    if(continueWith){
      continueWith(null,quoteResult);
    }
  };

  //the final call if anything fails
  var quoteError = function(rfq){
    console.log("quoteError");
    var quoteResult = new QuoteResult();
    quoteResult.success = false;
    quoteResult.message = rfq.message;
    self.emit("quote-processing-error", quoteResult);
    if(continueWith){
      continueWith(null,quoteResult);
    }
  };


  //The event chain for a successful registration
  self.on("quote-request-received",validateInputs);
  self.on("validated", getBasePremium);
  self.on("calculated-base-premium",applyGenderFactors);
  self.on("gender-factors-applied",applyAgeFactors);
  self.on("age-factors-applied",applyCarTypeFactors);
  self.on("car-type-factors-applied",applyCarColourFactors);
  self.on("car-colour-factors-applied",quoteCompleteOK);

  //the event chain for a non-successful registration
  self.on("invalid",quoteError);

  return self;
};
util.inherits(Registration,Emitter);
module.exports = Registration;
