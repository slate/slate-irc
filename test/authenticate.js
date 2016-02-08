var irc = require('..');
var Stream = require('stream').PassThrough;

describe('authenticate()', function () {
  var stream, client;
  beforeEach(function () {
    stream = new Stream;
    stream.setTimeout = function () {
    };
    client = irc(stream);
  });
  describe('on AUTHENTICATE', function () {
    it('should emit "AUTHENTICATE"', function (done) {
      client.on('authenticate', function (e) {
        e.message.should.equal('+')
        done();
      });

      stream.write('AUTHENTICATE +\r\n');
    });
  });
});
