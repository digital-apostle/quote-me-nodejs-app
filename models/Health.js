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

  health.serviceStatus = function(status){
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
