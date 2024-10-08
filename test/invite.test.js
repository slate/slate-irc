import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "invite"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    client.on('invite', function (e) {
      expect(e.from).toStrictEqual('test')
      expect(e.to).toStrictEqual('astranger')
      expect(e.channel).toStrictEqual('#something')
      expect(e.hostmask.nick).toStrictEqual('test')
      expect(e.hostmask.username).toStrictEqual('~user')
      expect(e.hostmask.hostname).toStrictEqual('example.com')
      expect(e.hostmask.string).toStrictEqual('test!~user@example.com')
      done()
    })

    stream.write(':test!~user@example.com INVITE astranger :#something\r\n')
  }))
