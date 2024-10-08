import { describe, it } from 'vitest'
import 'should'

var irc = require('..')
var Stream = require('stream').PassThrough

describe('on QUIT', function () {
  it('should emit "quit"', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)

      client.on('quit', function (e) {
        e.nick.should.equal('tobi')
        e.message.should.eql('Remote host closed the connection')
        e.hostmask.nick.should.equal('tobi')
        e.hostmask.username.should.equal('~tobi')
        e.hostmask.hostname.should.equal(
          '107-214-168-243.lightspeed.cicril.sbcglobal.net',
        )
        e.hostmask.string.should.equal(
          'tobi!~tobi@107-214-168-243.lightspeed.cicril.sbcglobal.net',
        )
        done()
      })

      stream.write(
        ':tobi!~tobi@107-214-168-243.lightspeed.cicril.sbcglobal.net QUIT :Remote host closed the connection\r\n',
      )
    }))
})
