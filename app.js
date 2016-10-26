var crypto = require('crypto-js');
var generatePassword = require('password-generator');
var Checker = require('password-checker');
var checker = new Checker();

function passwordPut() {
  generatePassword(30, false);
}

function checkSecure(inputCheckPassword) {
  checker.min_length = 8;
  checker.disallowWords(true, true);
  checker.disallowPasswords(true, true, 3);
  checker.disallowNames(true);
  return checker.check(inputCheckPassword);
}
