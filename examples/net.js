
var irc = require('..');
var net = require('net');

var stream = net.connect({
  port: 6667,
  host: 'irc.freenode.org'
});

var client = irc(stream);

client.pass('pass');
client.nick('nick');
client.user('username', 'realname');

client.join('#luna-lang');
client.names('#luna-lang', function(err, names){
  console.log(names);
});