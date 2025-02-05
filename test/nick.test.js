import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'node:stream'

it('should emit "nick"', () => {
  const stream = new Stream()
  const client = irc(stream)

  client.on('nick', (e) => {
    expect(e.nick).toStrictEqual('colinm')
    expect(e.new).toStrictEqual('cmilhench')
    expect(e.hostmask.nick).toStrictEqual('colinm')
    expect(e.hostmask.username).toStrictEqual('~colinm')
    expect(e.hostmask.hostname).toStrictEqual('host-92-17-247-88.as13285.net')
    expect(e.hostmask.string).toStrictEqual(
      'colinm!~colinm@host-92-17-247-88.as13285.net',
    )
  })

  stream.write(
    ':colinm!~colinm@host-92-17-247-88.as13285.net NICK :cmilhench\r\n',
  )
})
