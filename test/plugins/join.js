
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('join()', function(){
  describe('on JOIN', function(){
    it('should emit "join" with (nick, channel)', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('join', function(nick, chan){
        nick.should.equal('tjholowaychuk');
        chan.should.equal('#express');
        done();
      });

      stream.write(':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net JOIN #express\r\n');
    })
  })
})