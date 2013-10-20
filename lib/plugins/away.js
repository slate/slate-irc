
/**
 * AWAY notification plugin emitting "away"
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('AWAY' != msg.command) return;
      var e = {};
      e.nick = msg.prefix.split('!')[0];
      e.message = msg.trailing;
      irc.emit('away', e);
    });
  }
}