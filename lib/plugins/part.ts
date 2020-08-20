/**
 * Module dependencies.
 */

import * as utils from '../utils'

/**
 * PART plugin to emit "part" events.
 *
 * @return {Function}
 * @api public
 */

export default function () {
  return function (irc) {
    irc.on('data', function (msg) {
      if ('PART' != msg.command) return
      var e = {}
      e.nick = utils.nick(msg)
      e.hostmask = utils.hostmask(msg)
      e.channels = utils.channelList(msg.params)
      e.message = msg.trailing
      irc.emit('part', e)
    })
  }
}
