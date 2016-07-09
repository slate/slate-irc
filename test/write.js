var irc = require('..');
var Stream = require('stream').PassThrough;
var should = require('should');

describe('client.write()', function() {
  it('should err when newline characters are given', function(done) {
    var stream = new Stream;
    var client = irc(stream);

    var cnt = 0;
    var tests = [
      'NICK tobi\nUSER user :example.com',
      'PRIVMSG #loki :Hello :)\r\nNewline :(',
      'PRIVMSG #lock :Some servers accept \r as a line delimiter'
      ];
    tests.forEach(function(msg) {
      client.write(msg, function(err) {
        should(err).not.null();
        cnt++;
        if (cnt >= tests.length) done();
      });
    });
  });
});
