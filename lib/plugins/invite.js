/**
 * Module dependencies.
 */

import * as utils from '../utils'

/**
 * INVITE plugin to emit "invite" events.
 *
 * @return {Function}
 * @api public
 */

export default function () {
  return function (irc) {
    irc.on('data', function (msg) {
      if ('INVITE' != msg.command) return
      var e = {}
      e.from = utils.nick(msg)
      e.hostmask = utils.hostmask(msg)
      e.to = msg.params.toLowerCase()
      e.channel = msg.trailing
      irc.emit('invite', e)
    })
  }
}
