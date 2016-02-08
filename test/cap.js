var irc = require('..');
var Stream = require('stream').PassThrough;

describe('cap()', function () {
  var stream, client;
  beforeEach(function () {
    stream = new Stream;
    stream.setTimeout = function () {
    };
    client = irc(stream);
  });
  describe('on CAP', function () {
    it('should emit "CAP" and parse ACK with capabilities', function (done) {
      client.on('cap', function (e) {
        e.nick.should.equal('jilles');
        e.command.should.eql('ACK');
        e.should.have.property('capabilities').with.lengthOf(1);
        e.capabilities[0].should.eql('sasl');
        done();
      });

      stream.write(':jaguar.test CAP jilles ACK :sasl\r\n');
    });
    it('should emit "CAP" and parse ACK with multiple capabilities', function (done) {
      client.on('cap', function (e) {
        e.nick.should.equal('jilles');
        e.command.should.eql('ACK');
        e.should.have.property('capabilities').with.lengthOf(3);
        done();
      });

      stream.write(':jaguar.test CAP jilles ACK :sasl foo bar\r\n');
    });
    it('should emit "CAP" and parse LS with capabilites', function (done) {
      client.on('cap', function (e) {
        e.nick.should.eql('*');
        e.command.should.eql('LS');
        e.should.have.property('capabilities').with.lengthOf(2);
        e.capabilities.should.containDeep(['multi-prefix', 'sasl']);
        done();
      });

      stream.write(':jaguar.test CAP * LS :multi-prefix sasl\r\n');
    });
  });
});
