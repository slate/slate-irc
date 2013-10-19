
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
      e.nick = msg.prefix.split('!')[0];
      e.channels = msg.params.split(',');
      irc.emit('join', e);
    });
  }
}