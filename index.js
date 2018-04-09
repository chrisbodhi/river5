'use strict';

// Import the interface to Tessel hardware
var tessel = require('tessel');
// Load the http module to create an http server.
var http = require('http');

var feedtools = require ("davereader");
var readConfig = require('./river5');

// Configure our HTTP server to respond with "Hello from Tessel!" to all requests.
// https://gist.github.com/charlesdaniel/1686663
var server = http.createServer(function (request, response) {
  var auth = request.headers.authorization;

  if (auth) {
    var tmp = auth.split(' ');

    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();

    console.log("Decoded Authorization ", plain_auth);

    var creds = plain_auth.split(':');
    var username = creds[0];
    var password = creds[1];

    if((username === 'hack') && (password === 'thegibson')) {
      response.statusCode = 200;
      readConfig (function (myConfig) {
        feedtools.init (myConfig, function () {});
      });
    } else {
      response.statusCode = 401;
      response.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
      response.end('<html><body>Need some creds son</body></html>');
    }
  } else {
    response.statusCode = 401;
    response.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    response.end('<html><body>Need some creds son</body></html>');
  }
});

// Listen on port 8080, IP defaults to 192.168.1.101. Also accessible through [tessel-name].local
server.listen(8080);

// Put a friendly message in the terminal
console.log("Server running at http://192.168.1.101:8080/");
