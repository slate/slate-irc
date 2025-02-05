import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "join"', () =>
  new Promise((done) => {
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
      done()
    })

    stream.write(
      ':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net JOIN #express\r\n',
    )
  }))
