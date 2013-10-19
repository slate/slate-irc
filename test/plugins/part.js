
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('part()', function(){
  describe('on PART', function(){
    it('should emit "part"', function(done){
      var stream = new Stream;
      var client = irc(stream);
      
      client.on('part', function(e){
        e.nick.should.equal('tjholowaychuk');
        e.channels.should.eql(['#express']);
        e.message.should.equal('So long!');
        done();
      });

      stream.write(':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net PART #express :So long!\r\n');
    })
  })
})