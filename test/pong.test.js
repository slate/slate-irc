import { describe, it } from 'vitest'
import 'should'

import irc from '..'
import { PassThrough as Stream } from 'stream'

describe('on PING', () => {
  it('should respond with PONG', () =>
    new Promise((done) => {
      var stream = new Stream()
      var client = irc(stream)
      var n = 0

      stream.on('data', function (chunk) {
        switch (n++) {
          case 0:
            chunk.should.equal('PING :rothfuss.freenode.net\r\n')
            break
          case 1:
            chunk.should.equal('PONG :rothfuss.freenode.net\r\n')
            done()
            break
        }
      })

      stream.write('PING :rothfuss.freenode.net\r\n')
    }))
})
