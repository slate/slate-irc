import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "nick"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    client.on('nick', function (e) {
      expect(e.nick).toStrictEqual('colinm')
      expect(e.new).toStrictEqual('cmilhench')
      expect(e.hostmask.nick).toStrictEqual('colinm')
      expect(e.hostmask.username).toStrictEqual('~colinm')
      expect(e.hostmask.hostname).toStrictEqual('host-92-17-247-88.as13285.net')
      expect(e.hostmask.string).toStrictEqual(
        'colinm!~colinm@host-92-17-247-88.as13285.net',
      )
      done()
    })

    stream.write(
      ':colinm!~colinm@host-92-17-247-88.as13285.net NICK :cmilhench\r\n',
    )
  }))
