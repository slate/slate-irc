import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "quit"', () => {
  const stream = new Stream()
  const client = irc(stream)

  client.on('quit', (e) => {
    expect(e.nick).toStrictEqual('tobi')
    expect(e.message).toStrictEqual('Remote host closed the connection')
    expect(e.hostmask.nick).toStrictEqual('tobi')
    expect(e.hostmask.username).toStrictEqual('~tobi')
    expect(e.hostmask.hostname).toStrictEqual(
      '107-214-168-243.lightspeed.cicril.sbcglobal.net',
    )
    expect(e.hostmask.string).toStrictEqual(
      'tobi!~tobi@107-214-168-243.lightspeed.cicril.sbcglobal.net',
    )
  })

  stream.write(
    ':tobi!~tobi@107-214-168-243.lightspeed.cicril.sbcglobal.net QUIT :Remote host closed the connection\r\n',
  )
})
