
/**
 * KICK plugin to emit "kick" events
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('message', function(msg){
      if ('KICK' != msg.command) return;
      var e = {};
      var params = msg.params.split(' ');
      e.nick = msg.prefix.split('!')[0];
      e.channel = params[0];
      e.client = params[1];
      irc.emit('kick', e);
    });
  }
}