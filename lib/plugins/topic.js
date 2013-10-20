
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

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('TOPIC' != msg.command) return;
      var e = {};
      e.nick = utils.nick(msg);
      e.channel = msg.params;
      e.topic = msg.trailing;
      irc.emit('topic', e);
    });
  }
}