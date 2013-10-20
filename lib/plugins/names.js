
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

    irc.on('data', function(msg){
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
          var e = { channel: chan, names: map[chan] };
          irc.emit('names', e);
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

    self.on('names', function onnames(e){
      if (e.channel != channel) return;
      fn(null, e.names);
      self.removeListener('names', onnames);
    });
  });
}