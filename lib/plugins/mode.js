/**
 * Module dependencies.
 */

import * as utils from '../utils'

/**
 * MODE plugin to emit "mode" events.
 *
 * @return {Function}
 * @api public
 */

export default function () {
  return function (irc) {
    irc.on('data', function (msg) {
      if ('MODE' != msg.command) return
      var params = msg.params.split(' ')
      var e = {}
      e.nick = utils.nick(msg)
      e.target = params[0]
      e.mode = params[1] || msg.trailing
      e.client = params[2]
      irc.emit('mode', e)
    })
  }
}
