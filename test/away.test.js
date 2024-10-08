import { describe, it } from 'vitest'
import 'should'

var irc = require('..')
var Stream = require('stream').PassThrough

describe('on RPL_AWAY', function () {
  it('should emit "away"', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)

      client.on('away', function (e) {
        e.nick.should.equal('colinm')
        e.message.should.eql('brb food time')
        done()
      })

      stream.write(':irc.host.net 301 me colinm :brb food time\r\n')
    }))
})
