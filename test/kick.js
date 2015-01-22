var irc = require('..');
var Stream = require('stream').PassThrough;

describe('kick()', function() {
  describe('on KICK', function() {
    it('should emit "kick"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('kick', function(e) {
        e.nick.should.equal('tjholowaychuk');
        e.client.should.equal('tobi');
        e.channel.should.eql('#express');
        e.hostmask.nick.should.equal('tjholowaychuk');
        e.hostmask.username.should.equal('~tjholoway');
        e.hostmask.hostname.should.equal('S01067cb21b2fd643.gv.shawcable.net');
        e.hostmask.string.should.equal('tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net');
        done();
      });

      stream.write(':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net KICK #express tobi :Too ferrety\r\n');
    });
  });
});
