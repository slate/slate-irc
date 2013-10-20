
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('quit()', function(){
  describe('on QUIT', function(){
    it('should emit "quit"', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('quit', function(e){
        e.nick.should.equal('tobi');
        e.message.should.eql('Remote host closed the connection');
        done();
      });

      stream.write(':tobi!~tobi@107-214-168-243.lightspeed.cicril.sbcglobal.net QUIT :Remote host closed the connection\r\n');
    })
  })
})