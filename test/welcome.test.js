import { describe, it } from 'vitest'
import 'should'

import irc from '..'
import { PassThrough as Stream } from 'stream'

describe('on RPL_WELCOME', () => {
  it('should set client.me to the users nick', () => {
    var stream = new Stream()
    var client = irc(stream)
    stream.write(
      ':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n',
    )
    process.nextTick(() => {
      client.me.should.equal('tobi')
    })
  })

  it('should emit "welcome"', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)

      client.on('welcome', function (nick) {
        nick.should.equal('tobi')
        done()
      })

      stream.write(
        ':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n',
      )
    }))
})
