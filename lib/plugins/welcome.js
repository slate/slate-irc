
/**
 * RPL_WELCOME plugin to set `irc.me`.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('RPL_WELCOME' != msg.command) return;
      irc.me = msg.params;
      irc.emit('welcome', irc.me);
    });
  }
}
