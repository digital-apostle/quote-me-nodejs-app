//this is an QuoteRequest for Quote (not our executable)
//use this to call the Register routine
var QuoteRequest = function(args){

  var rfq = {};
  //rfq.email = args.email;
  rfq.email = "darren.kabengele@Everis.com"
  rfq.status = "pending";
  rfq.message = null;

  rfq.isValid = function(){
    return rfq.status == "validated";
  };
  rfq.isInvalid = function(){
    return !isValid();
  };
  rfq.setInvalid = function(message){
    rfq.status = "invalid";
    rfq.message = message;
  };
  rfq.validate = function(message){
    rfq.status = "validated";
  };

  return rfq;
};

module.exports = QuoteRequest;
