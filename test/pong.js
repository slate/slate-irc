var irc = require('..');
var Stream = require('stream').PassThrough;

describe('pong()', function() {
  describe('on PING', function() {
    it('should respond with PONG', function(done) {
      var stream = new Stream;
      var client = irc(stream);
      var n = 0;

      stream.on('data', function(chunk) {
        switch (n++) {
          case 0:
            chunk.should.equal('PING :rothfuss.freenode.net\r\n');
            break;
          case 1:
            chunk.should.equal('PONG :rothfuss.freenode.net\r\n');
            done();
            break;
        }
      });

      stream.write('PING :rothfuss.freenode.net\r\n');
    });
  });
});
