import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'node:stream'

it('should err when newline characters are given', () => {
  const stream = new Stream()
  const client = irc(stream)

  let cnt = 0
  const tests = [
    'NICK tobi\nUSER user :example.com',
    'PRIVMSG #loki :Hello :)\r\nNewline :(',
    'PRIVMSG #lock :Some servers accept \r as a line delimiter',
  ]
  tests.forEach((msg) => {
    client.write(msg, (err) => {
      expect(err).not.toBeNull()
      cnt++
    })
  })
})
