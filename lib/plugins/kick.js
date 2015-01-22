
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * KICK plugin to emit "kick" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    irc.on('data', function(msg) {
      if ('KICK' != msg.command) return;
      var e = {};
      var params = msg.params.split(' ');
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channel = params[0].toLowerCase();
      e.client = params[1];
      e.message = msg.trailing;
      irc.emit('kick', e);
    });
  }
}
