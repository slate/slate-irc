import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'node:stream'

it('should emit "join"', () => {
  const stream = new Stream()
  const client = irc(stream)

  client.on('join', (e) => {
    expect(e.nick).toStrictEqual('tjholowaychuk')
    expect(e.channel).toStrictEqual('#express')
    expect(e.hostmask.nick).toStrictEqual('tjholowaychuk')
    expect(e.hostmask.username).toStrictEqual('~tjholoway')
    expect(e.hostmask.hostname).toStrictEqual(
      'S01067cb21b2fd643.gv.shawcable.net',
    )
    expect(e.hostmask.string).toStrictEqual(
      'tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net',
    )
  })

  stream.write(
    ':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net JOIN #express\r\n',
  )
})
