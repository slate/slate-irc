
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('topic()', function(){
  describe('on TOPIC', function(){
    it('should emit "topic"', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('topic', function(e){
        e.nick.should.equal('tobi');
        e.channel.should.eql('#slate');
        e.topic.should.equal('Slate 1.0 is out!');
        done();
      });

      stream.write(':tobi TOPIC #slate :Slate 1.0 is out!\r\n');
    })
  })
})