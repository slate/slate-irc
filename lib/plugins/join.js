
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
      e.channels = utils.channelList(msg.params);
      irc.emit('join', e);
    });
  }
}