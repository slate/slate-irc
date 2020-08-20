/**
 * Module dependencies.
 */

import * as utils from '../utils'

/**
 * NICK plugin to emit "nick" events.
 *
 * @return {Function}
 * @api public
 */

export default function () {
  return function (irc) {
    irc.on('data', function (msg) {
      if ('NICK' != msg.command) return
      var e = {}
      e.nick = utils.nick(msg)
      e.hostmask = utils.hostmask(msg)
      e.new = msg.trailing
      if (!e.new) e.new = msg.params
      if (e.nick == irc.me) irc.me = e.new
      irc.emit('nick', e)
    })
  }
}
