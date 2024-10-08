import { describe, it } from 'vitest'
import 'should'

import irc from '..'
import { PassThrough as Stream } from 'stream'

describe('on PRIVMSG', () => {
  it('should emit "message"', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)

      client.on('message', function (e) {
        e.from.should.equal('tobi')
        e.to.should.equal('loki')
        e.message.should.equal('Hello :)')
        e.hostmask.nick.should.equal('tobi')
        e.hostmask.username.should.equal('~user')
        e.hostmask.hostname.should.equal('example.com')
        e.hostmask.string.should.equal('tobi!~user@example.com')
        done()
      })

      stream.write(':tobi!~user@example.com PRIVMSG loki :Hello :)\r\n')
    }))
})
