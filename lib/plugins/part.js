
/**
 * PART plugin to emit "part" events
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('PART' != msg.command) return;
      var e = {};
      e.nick = msg.prefix.split('!')[0];
      e.channels = msg.params.split(',');
      e.message = msg.trailing;
      irc.emit('part', e);
    });
  }
}