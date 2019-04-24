var Quote = function(args){

  var rfq = {};
  // if(args.id){
  //   rfq.id = args.id;
  // }
  // rfq.email = args.email;
  // rfq.createdAt = args.createdAt || new Date();
  // rfq.status = args.status || "pending";

  rfq.email = "darren.kabengele@everis.com";
  rfq.createdAt = args.createdAt || new Date();
  rfq.status = args.status || "pending";

  app.validate = function(message){
    app.status = "validated";
  };

  return rfq;

};

module.exports = Quote;
