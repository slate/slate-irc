var irc = require('..');
var Stream = require('stream').PassThrough;

describe('nick()', function() {
  describe('on NICK', function() {

    it('should emit "nick"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('nick', function(e) {
        e.nick.should.eql('colinm');
        e.new.should.equal('cmilhench');
        e.hostmask.nick.should.equal('colinm');
        e.hostmask.username.should.equal('~colinm');
        e.hostmask.hostname.should.equal('host-92-17-247-88.as13285.net');
        e.hostmask.string.should.equal('colinm!~colinm@host-92-17-247-88.as13285.net');
        done();
      });

      stream.write(':colinm!~colinm@host-92-17-247-88.as13285.net NICK :cmilhench\r\n');
    });
  });
});
