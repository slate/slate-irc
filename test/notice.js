var irc = require('..');
var Stream = require('stream').PassThrough;

describe('notice()', function() {
  describe('on NOTICE', function() {
    it('should emit "notice"', function(done) {
      var stream = new Stream;
      var client = irc(stream);
      var n = 0;

      client.on('notice', function(e) {
        e.from.should.equal('NickServ');
        e.to.should.equal('cmilhench');
        e.hostmask.nick.should.equal('NickServ');
        e.hostmask.username.should.equal('NickServ');
        e.hostmask.hostname.should.equal('services.');
        e.hostmask.string.should.equal('NickServ!NickServ@services.');
        switch (++n) {
          case 1:
            e.message.should.equal([
              'This nickname is registered. ',
              'Please choose a different nickname, ',
              'or identify via /msg NickServ identify <password>.'].join(''));
          break;
          case 2:
            e.message.should.equal([
              'You have 30 seconds to identify to your nickname ',
              'before it is changed.'].join(''));
            done();
            break;
        }
      });

      stream.write([
        ':NickServ!NickServ@services. NOTICE cmilhench :',
        'This nickname is registered. ',
        'Please choose a different nickname, ',
        'or identify via /msg NickServ identify <password>.\r\n'].join(''));
      stream.write([
        ':NickServ!NickServ@services. NOTICE cmilhench :',
        'You have 30 seconds to identify to your nickname ',
        'before it is changed.\r\n'].join(''));
    });
  });
});
