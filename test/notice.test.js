import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "notice"', () => {
  const stream = new Stream()
  const client = irc(stream)
  let n = 0

  client.on('notice', (e) => {
    expect(e.from).toStrictEqual('NickServ')
    expect(e.to).toStrictEqual('cmilhench')
    expect(e.hostmask.nick).toStrictEqual('NickServ')
    expect(e.hostmask.username).toStrictEqual('NickServ')
    expect(e.hostmask.hostname).toStrictEqual('services.')
    expect(e.hostmask.string).toStrictEqual('NickServ!NickServ@services.')
    switch (++n) {
      case 1:
        expect(e.message).toStrictEqual(
          'This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.',
        )
        break
      case 2:
        expect(e.message).toStrictEqual(
          'You have 30 seconds to identify to your nickname before it is changed.',
        )
        break
    }
  })

  stream.write(
    ':NickServ!NickServ@services. NOTICE cmilhench :This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.\r\n',
  )
  stream.write(
    ':NickServ!NickServ@services. NOTICE cmilhench :You have 30 seconds to identify to your nickname before it is changed.\r\n',
  )
})
