
/**
 * ERRORS plugin to emit "errors" events.
 *
 * List of possible errors:
 * https://github.com/williamwicks/irc-replies/blob/master/replies.json#L113-L170
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if (msg.command.indexOf("ERR_") !== 0) return;
      var e = {};
      e.cmd = msg.command;
      e.message = msg.trailing;
      irc.emit('errors', e);
    });
  }
}
