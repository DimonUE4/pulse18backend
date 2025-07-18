// utils/validators.js

exports.validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  exports.validatePassword = (password) => {
    return password && password.length >= 6;
  };
  