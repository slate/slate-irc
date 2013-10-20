
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

  it('should emit "names"', function(done){
    var stream = new Stream;
    
    var client = irc(stream);

    client.on('names', function(e){
      e.channel.should.equal('#luna-lang');
      e.names.should.eql('one two three foo bar baz'.split(' '));
      done();
    });

    stream.write(':tobi!~tobi@184.151.231.170 JOIN #luna-lang\r\n');
    stream.write(':rothfuss.freenode.net 353 tjholowaychuk = #luna-lang :one two three\r\n');
    stream.write(':rothfuss.freenode.net 353 tjholowaychuk = #luna-lang :foo bar baz\r\n');
    stream.write(':rothfuss.freenode.net 366 tjholowaychuk #luna-lang :End of /NAMES list.\r\n');
  })

  it('should strip @ / +', function(done){
    var stream = new Stream;
    
    var client = irc(stream);

    client.on('names', function(e){
      e.channel.should.equal('##luna-lang');
      e.names.should.eql(['tjholowaychuk']);
      done();
    });

    stream.write(':tobi!~tobi@184.151.231.170 JOIN #luna-lang\r\n');
    stream.write(':rothfuss.freenode.net 353 tjholowaychuk @ ##luna-lang :@tjholowaychuk\r\n');
    stream.write(':rothfuss.freenode.net 366 tjholowaychuk ##luna-lang :End of /NAMES list.\r\n');
  })
})
