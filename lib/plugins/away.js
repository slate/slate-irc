
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * AWAY plugin to emit "away" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('RPL_AWAY' != msg.command && 'RPL_NOWAWAY' != msg.command && 'RPL_UNAWAY' != msg.command) return;
      var params = msg.params.split(' ');
      var e = {};
      if ('RPL_NOWAWAY' == msg.command || 'RPL_UNAWAY' == msg.command) {
        e.nick = params[0];
      }
      else {
        e.nick = params[1];
      }
      e.message = msg.trailing;
      irc.emit('away', e);
    });
  }
}
