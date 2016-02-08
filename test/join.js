var irc = require('..');
var Stream = require('stream').PassThrough;

describe('join()', function() {
  var stream, client;

  beforeEach(function () {
    stream = new Stream;
    stream.setTimeout = function () {
    };
    client = irc(stream);
  });

  describe('on JOIN', function() {
    it('should emit "join"', function(done) {
      client.on('join', function(e) {
        e.nick.should.equal('tjholowaychuk');
        e.channel.should.equal('#express');
        e.hostmask.nick.should.equal('tjholowaychuk');
        e.hostmask.username.should.equal('~tjholoway');
        e.hostmask.hostname.should.equal('S01067cb21b2fd643.gv.shawcable.net');
        e.hostmask.string.should.equal('tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net');
        done();
      });

      stream.write(':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net JOIN #express\r\n');
    });
  });
});
