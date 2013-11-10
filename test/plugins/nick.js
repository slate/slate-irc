
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('nick()', function(){
  describe('on NICK', function(){

    it('should emit "nick"', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('nick', function(e){
        e.nick.should.eql('colinm');
        e.new.should.equal('cmilhench');
        done();
      });

      stream.write(':colinm!~colinm@host-92-17-247-88.as13285.net NICK :cmilhench\r\n');
    })
  })
})