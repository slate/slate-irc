
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * QUIT plugin to emit "quit" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('QUIT' != msg.command) return;
      var e = {};
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.message = msg.trailing;
      irc.emit('quit', e);
    });
  }
}
