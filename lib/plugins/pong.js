
/**
 * PONG plugin to reply to PINGs.
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('PONG' == msg.command) irc.emit('pong');
      if ('PING' != msg.command) return;
      irc.write('PONG :' + msg.trailing);
    });
  }
}