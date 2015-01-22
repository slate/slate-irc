var irc = require('..');
var Stream = require('stream').PassThrough;

describe('topic()', function() {
  describe('on TOPIC', function() {
    it('should emit "topic"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('topic', function(e) {
        e.nick.should.equal('tobi');
        e.channel.should.eql('#slate');
        e.topic.should.equal('Slate 1.0 is out!');
        e.hostmask.nick.should.equal('tobi');
        e.hostmask.username.should.equal('~user');
        e.hostmask.hostname.should.equal('example.com');
        e.hostmask.string.should.equal('tobi!~user@example.com');
        done();
      });

      stream.write(':tobi!~user@example.com TOPIC #slate :Slate 1.0 is out!\r\n');
    });
  });
});
