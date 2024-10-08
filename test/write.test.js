import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should err when newline characters are given', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    var cnt = 0
    var tests = [
      'NICK tobi\nUSER user :example.com',
      'PRIVMSG #loki :Hello :)\r\nNewline :(',
      'PRIVMSG #lock :Some servers accept \r as a line delimiter',
    ]
    tests.forEach(function (msg) {
      client.write(msg, function (err) {
        expect(err).not.toBeNull()
        cnt++
        if (cnt >= tests.length) done()
      })
    })
  }))
