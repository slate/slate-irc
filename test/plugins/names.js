
var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('names()', function(){
  describe('client.names(chan, fn)', function(){
    it('should respond with user names', function(done){
      var stream = new Stream;
      
      var client = irc(stream);

      client.names('#luna-lang', function(err, names){
        if (err) return done(err);
        names.should.eql(['foo', 'bar', 'baz', 'some', 'more']);
        done();
      });

      setImmediate(function(){
        stream.write(':pratchett.freenode.net 353 tjholowaychuk = #luna-lang :foo bar baz\r\n');
        stream.write(':pratchett.freenode.net 353 tjholowaychuk = #luna-lang :some more\r\n');
        stream.write(':pratchett.freenode.net 366 tjholowaychuk #luna-lang :End of /NAMES list.\r\n');
      });
    })
  })
})