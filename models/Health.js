// standard microservice style Health endpoint
// here for the purpose of API Proxy monitoring features
// for now it is set by app,js directly - alternatively it could be set dynamically via another endpoint and app.js just gets the status

var Health = function(args){

  //  PASS = "healthy";
  //  FAIL = "unhealthy";
  // WARN = "healthy with some concerns";

  var health = {};
  var error = {};

  error.code = null;
  error.error_desription = null;

  health.time = new Date();
  health.serviceStatus = null;
  health.error = error;

  health.setServiceStatus = function(status){
    health.status = status;
  };

  health.setErrorCode = function(code){
    health.error.code = code;
  }

  health.setErrorDescription = function(errorDesc){
    health.error.code = errorDesc;
  }

  return health;

};

module.exports = Health;
