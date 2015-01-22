
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * NOTICE plugin to emit "notice" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('NOTICE' != msg.command) return;
      var e = {};
      e.from = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.to = msg.params.toLowerCase();
      e.message = msg.trailing;
      irc.emit('notice', e);
    });
  }
}
