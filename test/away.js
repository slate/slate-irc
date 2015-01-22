var irc = require('..');
var Stream = require('stream').PassThrough;

describe('away()', function() {
  describe('on RPL_AWAY', function() {
    it('should emit "away"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('away', function(e) {
        e.nick.should.equal('loki');
        e.message.should.eql('brb food time');
        e.hostmask.nick.should.equal('loki');
        e.hostmask.username.should.equal('~user');
        e.hostmask.hostname.should.equal('example.com');
        e.hostmask.string.should.equal('loki!~user@example.com');
        done();
      });

      stream.write(':loki!~user@example.com 301 colinm cmilhench :brb food time\r\n');
    });
  });
});
