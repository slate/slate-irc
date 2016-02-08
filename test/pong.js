var irc = require('..');
var Stream = require('stream').PassThrough;

describe('pong()', function () {
    var stream, client;
    beforeEach(function () {
        stream = new Stream;
        stream.setTimeout = function () {};
        client = irc(stream);
    });
    describe('on PING', function () {
        it('should respond with PONG', function (done) {
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
