import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should emit "notice"', () =>
  new Promise((done) => {
    var stream = new Stream()
    var client = irc(stream)
    var n = 0

    client.on('notice', function (e) {
      expect(e.from).toStrictEqual('NickServ')
      expect(e.to).toStrictEqual('cmilhench')
      expect(e.hostmask.nick).toStrictEqual('NickServ')
      expect(e.hostmask.username).toStrictEqual('NickServ')
      expect(e.hostmask.hostname).toStrictEqual('services.')
      expect(e.hostmask.string).toStrictEqual('NickServ!NickServ@services.')
      switch (++n) {
        case 1:
          expect(e.message).toStrictEqual(
            [
              'This nickname is registered. ',
              'Please choose a different nickname, ',
              'or identify via /msg NickServ identify <password>.',
            ].join(''),
          )
          break
        case 2:
          expect(e.message).toStrictEqual(
            [
              'You have 30 seconds to identify to your nickname ',
              'before it is changed.',
            ].join(''),
          )
          done()
          break
      }
    })

    stream.write(
      [
        ':NickServ!NickServ@services. NOTICE cmilhench :',
        'This nickname is registered. ',
        'Please choose a different nickname, ',
        'or identify via /msg NickServ identify <password>.\r\n',
      ].join(''),
    )
    stream.write(
      [
        ':NickServ!NickServ@services. NOTICE cmilhench :',
        'You have 30 seconds to identify to your nickname ',
        'before it is changed.\r\n',
      ].join(''),
    )
  }))
