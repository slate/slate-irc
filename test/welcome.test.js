import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should set client.me to the users nick', () => {
  var stream = new Stream()
  var client = irc(stream)
  stream.write(
    ':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n',
  )
  process.nextTick(() => {
    expect(client.me).toStrictEqual('tobi')
  })
})

it('should emit "welcome"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)

    client.on('welcome', (nick) => {
      expect(nick).toStrictEqual('tobi')
      done()
    })

    stream.write(
      ':cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n',
    )
  }))
