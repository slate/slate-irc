
/**
 * PONG plugin to reply to PINGs.
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('data', function(msg){
      if ('PING' != msg.command) return;
      irc.write('PONG :' + msg.trailing);
    });
  }
}