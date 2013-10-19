
/**
 * JOIN plugin to emit "join" events with (nick, chan)
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('message', function(msg){
      if ('JOIN' != msg.command) return;
      var nick = msg.prefix.split('!')[0];
      var chan = msg.string.split('JOIN ')[1];
      irc.emit('join', nick, chan);
    });
  }
}