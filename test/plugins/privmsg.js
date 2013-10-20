
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('privmsg()', function(){
  describe('on PRIVMSG', function(){
    it('should emit "message"', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('message', function(e){
        e.from.should.equal('tobi');
        e.to.should.equal('loki');
        e.message.should.equal('Hello :)');
        done();
      });

      stream.write(':tobi PRIVMSG loki :Hello :)\r\n');
    })
  })
})