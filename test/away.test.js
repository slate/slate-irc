import { it } from 'vitest'
import 'should'

import irc from '..'
import { PassThrough as Stream } from 'stream'

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
