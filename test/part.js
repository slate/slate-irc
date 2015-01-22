var irc = require('..');
var Stream = require('stream').PassThrough;

describe('part()', function() {
  describe('on PART', function() {
    it('should emit "part"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('part', function(e) {
        e.nick.should.equal('tjholowaychuk');
        e.channels.should.eql(['#express']);
        e.message.should.equal('So long!');
        e.hostmask.nick.should.equal('tjholowaychuk');
        e.hostmask.username.should.equal('~tjholoway');
        e.hostmask.hostname.should.equal('S01067cb21b2fd643.gv.shawcable.net');
        e.hostmask.string.should.equal('tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net');
        done();
      });

      stream.write(':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net PART #express :So long!\r\n');
    });
  });
});
