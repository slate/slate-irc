
/**
 * MOTD plugin to emit "motd" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    var e = {};
    e.motd = [];

    irc.on('data', function(msg) {
      switch (msg.command) {
        case "RPL_MOTDSTART":
          e.motd.length = 0;
        case "RPL_ENDOFMOTD":
        case "RPL_MOTD":
          e.motd.push(msg.trailing);
          break;
      }

      if (msg.command == "RPL_ENDOFMOTD") {
        irc.emit('motd', e);
      }
    });
  }
}
