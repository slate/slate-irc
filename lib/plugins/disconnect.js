
/**
 * DISCONNECT plugin to emit "disconnect" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    var stream = irc.stream;
    var ms = 60 * 1000;

    stream.on('close', function() {
      irc.emit('disconnect');
    });

    stream.setTimeout(ms);

    stream.on('timeout', function() {
      var timeout = true;
      var time = new Date().getTime();

      irc.write("PING :" + time);

      irc.once("pong", function(res) {
        if (res == time) {
          timeout = false; 
        }
      });

      setTimeout(function() {
        if (timeout) {
          stream.destroy();
        }
      }, 5000);
    });
  }
}
