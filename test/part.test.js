import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "part"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    client.on('part', (e) => {
      expect(e.nick).toStrictEqual('tjholowaychuk')
      expect(e.channels).toStrictEqual(['#express'])
      expect(e.message).toStrictEqual('So long!')
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
      ':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net PART #express :So long!\r\n',
    )
  }))
