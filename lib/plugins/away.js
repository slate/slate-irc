
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * AWAY notification plugin emitting "away"
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('RPL_AWAY' != msg.command) return;
      var e = {};
      e.nick = utils.nick(msg);
      e.message = msg.trailing;
      irc.emit('away', e);
    });
  }
}