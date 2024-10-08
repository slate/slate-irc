import { describe, it } from 'vitest'
import 'should'

import irc from '..'
import { PassThrough as Stream } from 'stream'

describe('on INVITE', () => {
  it('should emit "invite"', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)

      client.on('invite', function (e) {
        e.from.should.equal('test')
        e.to.should.equal('astranger')
        e.channel.should.equal('#something')
        e.hostmask.nick.should.equal('test')
        e.hostmask.username.should.equal('~user')
        e.hostmask.hostname.should.equal('example.com')
        e.hostmask.string.should.equal('test!~user@example.com')
        done()
      })

      stream.write(':test!~user@example.com INVITE astranger :#something\r\n')
    }))
})
