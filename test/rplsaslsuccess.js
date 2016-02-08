var irc = require('..');
var Stream = require('stream').PassThrough;

describe('rplsaslsuccess()', function () {
  var stream, client;
  beforeEach(function () {
    stream = new Stream;
    stream.setTimeout = function () {
    };
    client = irc(stream);
  });
  describe('on successful login with sasl', function () {
    it('should emit "SASLSUCCESS"', function (done) {
      client.on('saslsuccess', function (e) {
        e.message.should.equal('SASL authentication successful');
        done();
      });

      stream.write(':jaguar.test 903 jilles :SASL authentication successful\r\n');
    });
  });
});
