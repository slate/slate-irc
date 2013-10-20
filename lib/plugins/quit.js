
/**
 * QUIT plugin to emit "quit" events
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('QUIT' != msg.command) return;
      var e = {};
      e.nick = msg.prefix.split('!')[0];
      e.message = msg.trailing;
      irc.emit('quit', e);
    });
  }
}