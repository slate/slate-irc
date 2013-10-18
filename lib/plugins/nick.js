
/**
 * PONG plugin to reply to PINGs.
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    irc.on('message', function(msg){
      if ('RPL_WELCOME' != msg.command) return;
      irc.me = msg.params;
      irc.emit('nick', irc.me);
    });
  }
}