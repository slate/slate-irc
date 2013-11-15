
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('away()', function(){
  describe('on RPL_AWAY', function(){
    it('should emit "away"', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('away', function(e){
        e.nick.should.equal('loki');
        e.message.should.eql('brb food time');
        done();
      });

      stream.write(':loki 301 colinm cmilhench :brb food time\r\n');
    })
  })
})