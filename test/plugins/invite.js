
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('invite()', function(){
  describe('on INVITE', function(){
    it('should emit "invite"', function(done){
      var stream = new Stream;
      var client = irc(stream);

      client.on('invite', function(e){
        e.from.should.equal('test');
        e.to.should.equal('astranger');
        e.channel.should.equal('#something');
        done();
      });

      stream.write(':test!~user@example.com INVITE astranger :#something\r\n');
    })
  })
})
