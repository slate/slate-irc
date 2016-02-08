var irc = require('..');
var Stream = require('stream').PassThrough;

describe('away()', function () {
    var stream, client;
    beforeEach(function () {
        stream = new Stream;
        stream.setTimeout = function () {};
        client = irc(stream);
    });
    describe('on RPL_AWAY', function () {
        it('should emit "away"', function (done) {
            client.on('away', function (e) {
                e.nick.should.equal('colinm');
                e.message.should.eql('brb food time');
                done();
            });
            stream.write(':irc.host.net 301 me colinm :brb food time\r\n');
        });
    });
});
