var QuotedPremium = require("../models/QuotePremium");
var QuoteRequest = require("../models/QuoteRequest");
var Emitter = require("events").EventEmitter;
var util = require("util");
var uuid = require("uuid");
var randomString = uuid.v4();

// store the result of the get quote request
// this is called by the QuoteGenerator to package the Result (error or success)
var QuoteResult = function () {
  var result = {
    success: false,
    message: null,
    quote: null
  };
  return result;
};


var QuoteGenerator = function (db) {
  Emitter.call(this);
  var self = this;
  var callbackWith = null;

  // start with validate, the generate reference etc.  One function after the other in a chain, each should process the QuoteRequest (our http request refereneced by rfq - request for quote.. Ok i know), 
  // update the QuotePremium (Pojo) this is the Pojo tracks the 
  // quote generation process, once the function is complete. Emit the appropriate event and send the QuoteRequest and QuotePremium (Pojo) along with the event - so 
  // processing can be continued with the next function in the event chain.

  var validateInputs = function (rfq, quotedPremium) {
    console.log("validateInputs");
    // validate the request payload
    if (!rfq.name || !rfq.surname || !rfq.age || !rfq.email || !rfq.gender) {
      rfq.setInvalid("First name, Surname, Age, Email, Gender are all required");
      self.emit("invalid", rfq);
    } 
    else if (!rfq.cartype || !rfq.carcolour || !rfq.carvaluation) {
      rfq.setInvalid("Car type, Car colour, car valuation are all required");
      self.emit("invalid", rfq);
    } else {
      rfq.validate();
      self.emit("validated", rfq, quotedPremium);
    }
  };

  var generateReference = function (rfq, quotedPremium) {
    console.log("generateReference");
    const quoteRef = rfq.surname + '-' + randomString.substr(0,4);
    quotedPremium.setReference(quoteRef);
    console.log("generated Reference=" + quotedPremium.reference)
    self.emit("generated-quote-reference", rfq, quotedPremium);
  };

  var getBasePremium = function (rfq, quotedPremium) {
    console.log("getBasePremium");
    const basePremium = 100;
    console.log("base price =" + basePremium)
    quotedPremium.updateQuotePremiumBeforeDiscount(basePremium);
    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("calculated-base-premium", rfq, quotedPremium);
  };

  // factors are applied as percentages. A simple if else OR switch checks the QuoteRequest (what we recieved in the http request) for 
  // explicit insurance risk business rules and applies a risk percentage to the running total (for the premium before discounts)
  // to add more rules to existing factors just added an if/else condition or switch case.

  var applyGenderFactors = function (rfq, quotedPremium) {
    console.log("applyGenderFactors");
    if (rfq.gender == "male") {
      const genderFactor = quotedPremium.premiumBeforeDiscount * 0.1;
      //console.log(genderFactor);
      quotedPremium.updateQuotePremiumBeforeDiscount(genderFactor);
    }

    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("gender-factors-applied", rfq, quotedPremium);
  };

  var applyAgeFactors = function (rfq, quotedPremium) {
    console.log("applyAgeFactors");

    let ageFactor = null;

    if (rfq.age >= 80) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.3;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    if (rfq.age >= 70) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.2;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    if (rfq.age <= 70) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.1;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    if (rfq.age <= 50) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.1;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    if (rfq.age <= 40) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.1;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    if (rfq.age <= 25) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.2;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    if (rfq.age <= 18) {
      ageFactor = quotedPremium.premiumBeforeDiscount * 0.3;
      quotedPremium.updateQuotePremiumBeforeDiscount(ageFactor);
    }
    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("age-factors-applied", rfq, quotedPremium);
  };

  var applyCarTypeFactors = function (rfq, quotedPremium) {
    console.log("applyCarTypeFactors");
    if (rfq.cartype == "sports") {
      const carTypeFactor = quotedPremium.premiumBeforeDiscount * 0.3;
      //console.log(carTypeFactor);
      quotedPremium.updateQuotePremiumBeforeDiscount(carTypeFactor);
    }
    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("car-type-factors-applied", rfq, quotedPremium);
  };

  var applyCarColourFactors = function (rfq, quotedPremium) {
    console.log("applyCarColourFactors");
    if (rfq.carcolour == "red") {
      const carColourFactor = quotedPremium.premiumBeforeDiscount * 0.3;
      //console.log(carColourFactor);
      quotedPremium.updateQuotePremiumBeforeDiscount(carColourFactor);
    }
    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("car-colour-factors-applied", rfq, quotedPremium);
  };

  var applyCarValuationFactors = function (rfq, quotedPremium) {
    console.log("applyCarValuationFactors");
    let carValuationFactor = null;

    switch (true) {
      case (rfq.carvaluation < 5):
        console.log("< 5");
        break;
      case (rfq.carvaluation < 20):
        carValuationFactor = quotedPremium.premiumBeforeDiscount * 0.1;
        console.log("< 20");
        break;
      case (rfq.carvaluation < 50):
        carValuationFactor = quotedPremium.premiumBeforeDiscount * 0.2;
        console.log("< 50");
        break;
      case (rfq.carvaluation < 100):
        carValuationFactor = quotedPremium.premiumBeforeDiscount * 0.3;
        console.log("< 100");
        break;
      default:
        console.log("> 100");
        carValuationFactor = quotedPremium.premiumBeforeDiscount * 0.4;
        break;
    }
    if (carValuationFactor) {
      console.log(carValuationFactor)
      quotedPremium.updateQuotePremiumBeforeDiscount(carValuationFactor);
    }
    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("car-valuations-factors-applied", rfq, quotedPremium);
  };

  // No claims discount calculated once we have a quote premium.  NCB found in the QuoteRequest (rfq)
  // the result is stored against the QuotePremium

  var calculateNCBDiscount = function (rfq, quotedPremium) {
    console.log("apply-no-claims-bonus");
    let ncbDiscount = null;

    console.log(rfq.ncb);

    const ncb = parseInt(rfq.ncb)

    switch (ncb) {
      case 0:
        console.log("0 ncbs");
        break;
      case 1:
        ncbDiscount = quotedPremium.premiumBeforeDiscount * 0.3;
        console.log("1 bonus");
        break;
      case 2:
        ncbDiscount = quotedPremium.premiumBeforeDiscount * 0.4;
        console.log("2 ncbs");
        break;
      case 3:
        ncbDiscount = quotedPremium.premiumBeforeDiscount * 0.5;
        console.log("3 ncbs");
        break;
      case 4:
        ncbDiscount = quotedPremium.premiumBeforeDiscount * 0.55;
        console.log("4 ncbs");
        break;
      default:
        console.log("5+ ncbs");
        ncbDiscount = quotedPremium.premiumBeforeDiscount * 0.6;
        break;
    }
    if (ncbDiscount) {
      console.log(ncbDiscount)
      quotedPremium.setDiscount(ncbDiscount);
    }
    console.log("updated quoted premium discount to apply =" + quotedPremium.discount)

    self.emit("no-claims-bonus-calculated", rfq, quotedPremium);
  };

  // apply discount and finalise quote we're almost ready for packaging to respond to the client via our QuoteResult Object.
  var applyDiscount = function (rfq, quotedPremium) {
    console.log("applyDiscount");

    quotedPremium.finaliseQuote();

    console.log("final premium =" + quotedPremium.premium)
    self.emit("premuim-discounts-applied", rfq, quotedPremium);
  };


  // this is a callback-able function, next holds our callback function to call once the generate quote is complete. 
  // the callback --> defined in the app.js /post call
  // this callbackWith approach allows the program to support both callbacks and events.
  self.generatePolicyQuote = function (args, next) {
    console.log("generatePolicyQuote invoked");
    callbackWith = next;
    var rfq = new QuoteRequest(args);
    console.log("rfq =" + JSON.stringify(rfq));
    var quotedPremium = new QuotedPremium();
    console.log("quotedpremium" + JSON.stringify(quotedPremium))
    self.emit("quote-request-received", rfq, quotedPremium);
  };

  //the final call if everything works as expected. Time to package our work in a QuoteResult object to respond back.
  // set the QuoteResult and then invoke the callback function --> defined in the app,js /post call 
  var quoteCompleteOK = function (rfq, quotedPremium) {
    quotedPremium.setStatus("premium-calculated");
    var quoteResult = new QuoteResult();
    quoteResult.success = true;
    quoteResult.message = "quoteCompleteOK";
    quoteResult.quote = quotedPremium;
    console.log("quoteCompleteOK");
   // self.emit("quote-processed", quoteResult);
    if (callbackWith) {
      callbackWith(null, quoteResult);
    }
  };

  //the final call if anything fails, return the error in a QuoteResult object.
  // set the QuoteResult and then invoke the callback function --> defined in th app,js /post call 
  var quoteError = function (rfq) {
    console.log("quoteError");
    var quoteResult = new QuoteResult();
    quoteResult.success = false;
    quoteResult.message = rfq.message;
 //   self.emit("quote-processing-error", quoteResult);
    if (callbackWith) {
      callbackWith(null, quoteResult);
    }
  };

  //The event chain for a successful quote-generation
  self.on("quote-request-received", validateInputs);
  self.on("validated", generateReference); 
  self.on("generated-quote-reference", getBasePremium);
  self.on("calculated-base-premium", applyGenderFactors);
  self.on("gender-factors-applied", applyAgeFactors);
  self.on("age-factors-applied", applyCarTypeFactors);
  self.on("car-type-factors-applied", applyCarColourFactors);
  self.on("car-colour-factors-applied", applyCarValuationFactors);
  self.on("car-valuations-factors-applied", calculateNCBDiscount);
  self.on("no-claims-bonus-calculated", applyDiscount);
  self.on("premuim-discounts-applied", quoteCompleteOK);

  //the event chain for a non-successful quote-generation
  self.on("invalid", quoteError);

  return self;
};
// extend the event emitter so that this class can inherit the event emitter methods etc
// allows quote generator to emit and listen to events from this class.
util.inherits(QuoteGenerator, Emitter);
module.exports = QuoteGenerator;
