var irc = require('slate-irc');
var websocket = require('websocket-stream');

var stream = new websocket('ws://localhost', 'binary');
stream.on('error', function(error) {
  throw error;
});

var client = irc(stream);
client.use(logger());

client.pass('pass');
client.nick('tobi');
client.user('tobi', 'Tobi Ferret');

function logger() {
  return function(irc){ 
    // Pipe to browser log.
    var BrowserStdout = require('browser-stdout')();
    irc.stream.pipe(BrowserStdout);
  }
}
