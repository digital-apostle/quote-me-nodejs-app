//this is an QuoteRequest for Quote (not our executable)
//use this to call the Register routine
var QuoteRequest = function(args){

  var rfq = {};
  //map customer
  rfq.email = args.customer.email;
  rfq.name = args.customer.name;
  rfq.surname = args.customer.surname;
  rfq.gender = args.customer.gender;
  rfq.age = args.customer.age;
  rfq.city = args.customer.city;
  rfq.ncb = args.customer.ncb;
  
  //map car
  rfq.carmake = args.car.make;
  rfq.carmodel = args.car.model;
  rfq.cartype = args.car.type;
  rfq.carcolour = args.car.colour;
  rfq.carvaluation = args.car.valuation;

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
