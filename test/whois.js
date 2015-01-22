var irc = require('..');
var Stream = require('stream').PassThrough;

describe('whois()', function() {
  describe('client.whois(target, mask, fn)', function() {
    it('should respond with user info', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.whois('colinm', function(err, e) {
        if (err) return done(err);e.hostname.should.equal('client.host.net');
        e.username.should.equal('~colinm');
        e.realname.should.equal('Colin Milhench');
        e.server.should.equal('other.host.net');
        e.channels.should.be.instanceof(Array).and.have.lengthOf(4);
        e.channels.should.containEql('#Node.js');
        e.channels.should.containEql('#express');
        e.channels.should.containEql('#some');
        e.channels.should.containEql('#more');
        e.away.should.equal('brb');
        e.sign.should.equal('1384330635');
        e.idle.should.equal('10543');
        done();
      });

      stream.write(':irc.host.net 311 me colinm ~colinm client.host.net * :Colin Milhench\r\n');
      stream.write(':irc.host.net 319 me colinm :#Node.js #express\r\n');
      stream.write(':irc.host.net 319 me colinm :#some #more\r\n');
      stream.write(':irc.host.net 312 me colinm other.host.net :Paris, FR\r\n');
      stream.write(':irc.host.net 301 me colinm :brb\r\n');
      stream.write(':irc.host.net 378 me colinm is connecting from *@client.host.net 127.0.0.1\r\n');
      stream.write(':irc.host.net 317 me colinm 10543 1384330635 seconds idle, signon time\r\n');
      stream.write(':irc.host.net 330 me colinm cmilhench :is logged in as\r\n');
      stream.write(':irc.host.net 318 me colinm :End of /WHOIS list.\r\n');
    });

    it('should emit "info"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.on('whois', function(err, e) {
        e.hostname.should.equal('client.host.net');
        e.username.should.equal('~colinm');
        e.realname.should.equal('Colin Milhench');
        e.server.should.equal('other.host.net');
        e.channels.should.be.instanceof(Array).and.have.lengthOf(4);
        e.channels.should.containEql('#Node.js');
        e.channels.should.containEql('#express');
        e.channels.should.containEql('#some');
        e.channels.should.containEql('#more');
        e.sign.should.equal('1384330635');
        e.idle.should.equal('10543');
        done();
      });

      stream.write(':irc.host.net 311 me colinm ~colinm client.host.net * :Colin Milhench\r\n');
      stream.write(':irc.host.net 319 me colinm :#Node.js #express\r\n');
      stream.write(':irc.host.net 319 me colinm :#some #more\r\n');
      stream.write(':irc.host.net 312 me colinm other.host.net :Paris, FR\r\n');
      stream.write(':irc.host.net 378 me colinm is connecting from *@client.host.net 127.0.0.1\r\n');
      stream.write(':irc.host.net 317 me colinm 10543 1384330635 seconds idle, signon time\r\n');
      stream.write(':irc.host.net 330 me colinm cmilhench :is logged in as\r\n');
      stream.write(':irc.host.net 318 me colinm :End of /WHOIS list.\r\n');
    });

    it('should emit "info"', function(done) {
      var stream = new Stream;
      var client = irc(stream);

      client.whois('colinm');

      client.on('whois', function(err, e) {
        e.hostname.should.equal('client.host.net');
        e.username.should.equal('~colinm');
        e.realname.should.equal('Colin Milhench');
        e.server.should.equal('other.host.net');
        e.channels.should.be.instanceof(Array).and.have.lengthOf(4);
        e.channels.should.containEql('#Node.js');
        e.channels.should.containEql('#express');
        e.channels.should.containEql('#some');
        e.channels.should.containEql('#more');
        e.sign.should.equal('1384330635');
        e.idle.should.equal('10543');
        done();
      });

      stream.write(':irc.host.net 311 me colinm ~colinm client.host.net * :Colin Milhench\r\n');
      stream.write(':irc.host.net 319 me colinm :#Node.js #express\r\n');
      stream.write(':irc.host.net 319 me colinm :#some #more\r\n');
      stream.write(':irc.host.net 312 me colinm other.host.net :Paris, FR\r\n');
      stream.write(':irc.host.net 378 me colinm is connecting from *@client.host.net 127.0.0.1\r\n');
      stream.write(':irc.host.net 317 me colinm 10543 1384330635 seconds idle, signon time\r\n');
      stream.write(':irc.host.net 330 me colinm cmilhench :is logged in as\r\n');
      stream.write(':irc.host.net 318 me colinm :End of /WHOIS list.\r\n');
    });

    it('should err with No such nick/channel', function(done) {
      var stream = new Stream;
      var client = irc(stream);
      client.whois('nonick');
      client.on('whois', function(err, e) {
        err.should.equal('No such nick/channel');
        done();
      });
      stream.write(':irc.freenode.net 401 me nonick :No such nick/channel\r\n');
      stream.write(':irc.freenode.net 318 me nonick :End of /WHOIS list.\r\n');
    });

    it('should err with No such server', function(done) {
      var stream = new Stream;
      var client = irc(stream);
      client.whois('nonick', function(err, e) {
        err.should.equal('No such server');
        done();
      });
      stream.write(':holmes.freenode.net 402 me nonick :No such server\r\n');
    });

    it('should err with Not enough parameters', function(done) {
      var stream = new Stream;
      var client = irc(stream);
      client.on('whois', function(err, e) {
        err.should.equal('Not enough parameters');
        done();
      });
      stream.write(':irc.freenode.net 461 me WHOIS :Not enough parameters\r\n');
    });
  });
});
