var irc = require('..');
var Stream = require('stream').PassThrough;

describe('rplloggedin()', function () {
  var stream, client;
  beforeEach(function () {
    stream = new Stream;
    stream.setTimeout = function () {
    };
    client = irc(stream);
  });
  describe('on successful login with sasl', function () {
    it('should emit "LOGGEDIN"', function (done) {
      client.on('loggedin', function (e) {
        e.message.should.equal('You are now logged in as jilles');
        done();
      });

      stream.write(':jaguar.test 900 jilles jilles!jilles@localhost.stack.nl jilles :You are now logged in as jilles\r\n');
    });
  });
});
