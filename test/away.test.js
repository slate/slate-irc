import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "away"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    client.on('away', (e) => {
      expect(e.nick).toStrictEqual('colinm')
      expect(e.message).toStrictEqual('brb food time')
      done()
    })

    stream.write(':irc.host.net 301 me colinm :brb food time\r\n')
  }))
