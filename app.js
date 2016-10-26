var crypto = require('crypto-js');
var generatePassword = require('password-generator');
var Checker = require('password-checker');
var checker = new Checker();

function passwordPut() {
  generatePassword(30, false);
}
