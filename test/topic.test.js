import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "topic"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    client.on('topic', (e) => {
      expect(e.nick).toStrictEqual('tobi')
      expect(e.channel).toStrictEqual('#slate')
      expect(e.topic).toStrictEqual('Slate 1.0 is out!')
      expect(e.hostmask.nick).toStrictEqual('tobi')
      expect(e.hostmask.username).toStrictEqual('~user')
      expect(e.hostmask.hostname).toStrictEqual('example.com')
      expect(e.hostmask.string).toStrictEqual('tobi!~user@example.com')
      done()
    })

    stream.write(':tobi!~user@example.com TOPIC #slate :Slate 1.0 is out!\r\n')
  }))
