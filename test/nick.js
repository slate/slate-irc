var irc = require('..');
var Stream = require('stream').PassThrough;

describe('nick()', function () {
    var stream, client;
    beforeEach(function () {
        stream = new Stream;
        stream.setTimeout = function () {};
        client = irc(stream);
    });
    describe('on NICK', function () {
        it('should emit "nick"', function (done) {
            client.on('nick', function (e) {
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
