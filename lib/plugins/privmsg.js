
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * PRIVMSG plugin to emit "message" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('PRIVMSG' != msg.command) return;
      var e = {};
      e.from = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.to = msg.params.toLowerCase();
      e.message = msg.trailing;
      irc.emit('message', e);
    });
  }
}
