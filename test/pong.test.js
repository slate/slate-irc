import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should respond with PONG', () =>
  new Promise((done) => {
    var stream = new Stream()
    irc(stream)
    var n = 0

    stream.on('data', (chunk) => {
      switch (n++) {
        case 0:
          expect(chunk).toStrictEqual('PING :rothfuss.freenode.net\r\n')
          break
        case 1:
          expect(chunk).toStrictEqual('PONG :rothfuss.freenode.net\r\n')
          done()
          break
      }
    })

    stream.write('PING :rothfuss.freenode.net\r\n')
  }))
