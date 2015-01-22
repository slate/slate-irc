var irc = require('..');
var Stream = require('stream').PassThrough;

describe('welcome()', function() {
  describe('on RPL_WELCOME', function() {
    it('should set client.me to the users nick', function() {
      var stream = new Stream;
      var client = irc(stream);
      stream.write(':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n');
      process.nextTick(function() {
        client.me.should.equal('tobi');
      });
    });

    it('should emit "welcome"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('welcome', function(nick) {
        nick.should.equal('tobi');
        done();
      });

      stream.write(':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n');
    });
  });
});
