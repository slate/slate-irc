
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * JOIN plugin to emit "join" events
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('JOIN' != msg.command) return;
      var e = {};
      e.nick = utils.nick(msg);
      e.channel = msg.params.toLowerCase();
      irc.emit('join', e);
    });
  }
}