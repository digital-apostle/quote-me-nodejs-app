var QuotedPremium = require("../models/QuotePremium");
var QuoteRequest = require("../models/QuoteRequest");
var Emitter = require("events").EventEmitter;
var util = require("util");

//A wrapper object for our quote-application call result
var QuoteResult = function () {
  var result = {
    success: false,
    message: null,
    quote: null
  };
  return result;
};

//This is the prototype which we will export
var QuoteApplication = function (db) {
  Emitter.call(this);
  var self = this;
  var continueWith = null;

  var validateInputs = function (rfq, quotedPremium) {
    console.log("validateInputs");
    //make sure there's an email and password
    if (!rfq.email || false) {
      rfq.setInvalid("Email and password are required");
      self.emit("invalid", rfq);
    } else if (false) {
      rfq.setInvalid("Passwords don't match");
      self.emit("invalid", rfq);
    } else {
      rfq.validate();
      self.emit("validated", rfq, quotedPremium);
    }
  };

  var getBasePremium = function (rfq, quotedPremium) {
    console.log("getBasePremium");
    const basePremium = 100;
    console.log("base price =" + basePremium)
    quotedPremium.updateQuotePremiumBeforeDiscount(basePremium);
    console.log("updated quoted premium =" + quotedPremium.premiumBeforeDiscount)
    self.emit("calculated-base-premium", rfq, quotedPremium);
  };

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

  var applyDiscount = function (rfq, quotedPremium) {
    console.log("applyDiscount");

    quotedPremium.finaliseQuote();

    console.log("final premium =" + quotedPremium.premium)
    self.emit("premuim-discounts-applied", rfq, quotedPremium);
  };

  self.applyForQuote = function (args, next) {
    console.log("applyForQuote invoked");
    continueWith = next;
    var rfq = new QuoteRequest(args);
    console.log("rfq =" + JSON.stringify(rfq));
    var quotedPremium = new QuotedPremium();
    console.log("quotedpremium" + JSON.stringify(quotedPremium))
    self.emit("quote-request-received", rfq, quotedPremium);
  };

  //the final call if everything works as expected
  var quoteCompleteOK = function (rfq, quotedPremium) {
    quotedPremium.setStatus("premium-calculated");
    var quoteResult = new QuoteResult();
    quoteResult.success = true;
    quoteResult.message = "quoteCompleteOK";
    quoteResult.quote = quotedPremium;
    console.log("quoteCompleteOK");
    self.emit("quote-processed", quoteResult);
    if (continueWith) {
      continueWith(null, quoteResult);
    }
  };

  //the final call if anything fails
  var quoteError = function (rfq) {
    console.log("quoteError");
    var quoteResult = new QuoteResult();
    quoteResult.success = false;
    quoteResult.message = rfq.message;
    self.emit("quote-processing-error", quoteResult);
    if (continueWith) {
      continueWith(null, quoteResult);
    }
  };

  //The event chain for a successful quote-application
  self.on("quote-request-received", validateInputs);
  self.on("validated", getBasePremium);
  self.on("calculated-base-premium", applyGenderFactors);
  self.on("gender-factors-applied", applyAgeFactors);
  self.on("age-factors-applied", applyCarTypeFactors);
  self.on("car-type-factors-applied", applyCarColourFactors);
  self.on("car-colour-factors-applied", applyCarValuationFactors);
  self.on("car-valuations-factors-applied", calculateNCBDiscount);
  self.on("no-claims-bonus-calculated", applyDiscount);
  self.on("no-claims-bonus-calculated", quoteCompleteOK);

  //the event chain for a non-successful quote-application
  self.on("invalid", quoteError);

  return self;
};
util.inherits(QuoteApplication, Emitter);
module.exports = QuoteApplication;
