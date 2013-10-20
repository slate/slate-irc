
/**
 * PRIVMSG plugin to emit "message" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('PRIVMSG' != msg.command) return;
      var e = {};
      e.from = msg.prefix.split('!')[0];
      e.to = msg.params;
      e.message = msg.trailing;
      irc.emit('message', e);
    });
  }
}