import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "message"', () =>
  new Promise((done) => {
    const stream = new Stream()
    const client = irc(stream)

    client.on('message', (e) => {
      expect(e.from).toStrictEqual('tobi')
      expect(e.to).toStrictEqual('loki')
      expect(e.message).toStrictEqual('Hello :)')
      expect(e.hostmask.nick).toStrictEqual('tobi')
      expect(e.hostmask.username).toStrictEqual('~user')
      expect(e.hostmask.hostname).toStrictEqual('example.com')
      expect(e.hostmask.string).toStrictEqual('tobi!~user@example.com')
      done()
    })

    stream.write(':tobi!~user@example.com PRIVMSG loki :Hello :)\r\n')
  }))
