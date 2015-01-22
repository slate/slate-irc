
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * TOPIC plugin to emit "topic" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    var channel;
    irc.on('data', function(msg) {
      switch (msg.command) {
			case 'RPL_NOTOPIC':
			case 'RPL_TOPIC':
				channel = msg.params.split(' ')[1];
				break;

			case 'TOPIC':
				channel = msg.params;
				break;

			default:
				return;
      }

      var e = {};
      if ('TOPIC' == msg.command) e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channel = channel.toLowerCase();
      e.topic = msg.trailing;
      irc.emit('topic', e);
    });
  }
}
