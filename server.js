var connect = require('connect');
var serveStatic = require('serve-static');
var portNumber = 8080;

connect().use(serveStatic(__dirname)).listen(portNumber);