var irc = require('..');
var Stream = require('stream').PassThrough;

describe('privmsg()', function() {
  describe('on PRIVMSG', function() {
    it('should emit "message"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('message', function(e) {
        e.from.should.equal('tobi');
        e.to.should.equal('loki');
        e.message.should.equal('Hello :)');
        e.hostmask.nick.should.equal('tobi');
        e.hostmask.username.should.equal('~user');
        e.hostmask.hostname.should.equal('example.com');
        e.hostmask.string.should.equal('tobi!~user@example.com');
        done();
      });

      stream.write(':tobi!~user@example.com PRIVMSG loki :Hello :)\r\n');
    });
  });
});
