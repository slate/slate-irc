
var irc = require('..');
var net = require('net');

var stream = net.connect({
  port: 6667,
  host: 'irc.freenode.org'
});

var client = irc(stream);

client.use(logger());

client.pass('pass');
client.nick('tobi');
client.user('tobi', 'Tobi Ferret');

client.join('#luna-lang');
client.names('#luna-lang', function(err, names){
  if (err) throw err;
  console.log(names);
});

function logger() {
  return function(irc){
    irc.stream.pipe(process.stdout);
  }
}