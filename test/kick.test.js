import { describe, it } from 'vitest'
import 'should'

import irc from '..'
import { PassThrough as Stream } from 'stream'

describe('on KICK', () => {
  it('should emit "kick"', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)

      client.on('kick', function (e) {
        e.nick.should.equal('tjholowaychuk')
        e.client.should.equal('tobi')
        e.channel.should.eql('#express')
        e.hostmask.nick.should.equal('tjholowaychuk')
        e.hostmask.username.should.equal('~tjholoway')
        e.hostmask.hostname.should.equal('S01067cb21b2fd643.gv.shawcable.net')
        e.hostmask.string.should.equal(
          'tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net',
        )
        done()
      })

      stream.write(
        ':tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net KICK #express tobi :Too ferrety\r\n',
      )
    }))
})
