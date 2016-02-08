var irc = require('..');
var Stream = require('stream').PassThrough;

describe('welcome()', function () {
    var stream, client;
    beforeEach(function () {
        stream = new Stream;
        stream.setTimeout = function () {};
        client = irc(stream);
    });
    describe('on RPL_WELCOME', function () {
        it('should set client.me to the users nick', function () {
            stream.write(':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n');
            process.nextTick(function () {
                client.me.should.equal('tobi');
            });
        });

        it('should emit "welcome"', function (done) {
            client.on('welcome', function (nick) {
                nick.should.equal('tobi');
                done();
            });

            stream.write(':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n');
        });
    });
});
