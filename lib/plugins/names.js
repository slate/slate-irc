
/**
 * Module dependencies.
 */

var debug = require('debug')('slate-irc:names');
var utils = require('../utils');

/**
 * NAMES plugin to emit `name event`.
 *
 * @return {Function}
 * @api public
 */

module.exports = function() {
  return function(irc) {
    var map = {};
    irc.names = names;
    irc.nameCallbacks = {};

    irc.on('data', function(msg) {
      switch (msg.command) {
        case 'RPL_NAMREPLY':
          var chan = msg.params.split(/ [=@*] /)[1].toLowerCase();
          var names = msg.trailing.split(' ');
          var users = [];

          names.forEach(function(n) {
            var user = n.split(/([~&@%+])/);
            var name = user.pop();
            var mode = user.pop();
            users.push({name: name, mode: mode || ''});
          });

          map[chan] = (map[chan] || []).concat(users);
          debug('add %s %j', chan, users);
          break;

        case 'RPL_ENDOFNAMES':
          var chan = msg.params.split(' ')[1].toLowerCase();
          debug('emit "names" for %s', chan);
          var e = { channel: chan, names: map[chan] || [] };
          var cb = irc.nameCallbacks[chan];

          if (cb) cb(e)
          else irc.emit('names', e);

          delete map[chan];
          break;
      }
    });
  }
}

/**
 * Fetch names for `channel` and invoke `fn(err, names)`.
 *
 * @param {String} channel
 * @param {Function} fn
 * @api public
 */

function names(channel, fn) {
  var self = this;
  channel = channel.toLowerCase();

  if (fn) {
    this.nameCallbacks[channel] = function(e) {
      delete self.nameCallbacks[channel];
      fn(null, e.names);
    };
  }

  this.write('NAMES ' + channel);
}
