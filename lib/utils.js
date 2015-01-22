
/**
 * Parse channel list `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

exports.channelList = function(str) {
  return str.split(',').map(function(chan) {
    return chan.toLowerCase();
  });
};

/**
 * Parse nick from `msg`.
 *
 * @param {Object} msg
 * @return {String}
 * @api public
 */

exports.nick = function(msg) {
  return msg.prefix.split('!')[0];
};

/**
 * Parse hostmask from `msg`.
 *
 * @param {Object} msg
 * @return {Object}
 * @api public
 */

exports.hostmask = function(msg) {
  var hostmask = {};
  var parts = msg.prefix.split('!');
  hostmask.nick = parts[0];

  try {
    parts = parts[1].split('@');
    hostmask.username = parts[0];
    hostmask.hostname = parts[1];
  } catch (e) {
    // ..
  }

  hostmask.string = msg.prefix;
  return hostmask;
}

/**
 * Merge the contents of two objects together into the first object.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 */

exports.extend = function(a, b) {
    for (var prop in b) {
      a[prop] = b[prop];
    }
    return a;
}
