
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * JOIN plugin to emit "join" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('JOIN' != msg.command) return;
      var e = {};
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channel = (msg.params || msg.trailing).toLowerCase();
      irc.emit('join', e);
    });
  }
}
