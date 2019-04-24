var QuotedPremium = function(args){

  var quotedPremium = {};

  quotedPremium.createdAt = new Date();
  quotedPremium.premium = 0;
  quotedPremium.premiumBeforeDiscount = 0;
  quotedPremium.discount = 0;
  quotedPremium.status = "pending";


  quotedPremium.setStatus = function(status){
    quotedPremium.status = status;
  };

  quotedPremium.setDiscount = function(discount){
    quotedPremium.discount =  quotedPremium.discount + discount;
  };

  quotedPremium.updateQuotePremiumBeforeDiscount = function(cost){
    quotedPremium.premiumBeforeDiscount= quotedPremium.premiumBeforeDiscount + cost;
  };

  quotedPremium.finaliseQuote = function(cost){
    quotedPremium.premium= quotedPremium.premiumBeforeDiscount - quotedPremium.discount;
  };


  return quotedPremium;

};

module.exports = QuotedPremium;