
/**
 * Module dependencies.
 */

var debug = require('debug')('slate-irc:names');

/**
 * Names lookup plugin.
 *
 *    client.names('#channel', function(err, names){
 *      console.log(names);
 *    });
 *
 * @return {Function}
 * @api public
 */

module.exports = function(){
  return function(irc){
    var map = {};

    irc.names = names;

    irc.on('message', function(msg){
      switch (msg.command) {
        case 'RPL_NAMREPLY':
          var chan = msg.params.split(' = ')[1];
          var names = msg.trailing.split(' ');
          map[chan] = map[chan] || [];
          map[chan] = map[chan].concat(names);
          debug('add %s %j', chan, names);
          break;

        case 'RPL_ENDOFNAMES':
          var chan = msg.params.split(' ')[1];
          debug('emit "names" for %s', chan);
          irc.emit('names', chan, map[chan]);
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

  this.write('NAMES ' + channel, function(err){
    if (err) return fn(err);

    self.on('names', function onnames(chan, names){
      if (chan != channel) return;
      fn(null, names);
      self.removeListener('names', onnames);
    });
  });
}