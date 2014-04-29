
/**
 * Parse channel list `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

exports.channelList = function(str){
  return str.split(',').map(function(chan){
    return chan.toLowerCase();
  });
};

/**
 * Parse nick from `msg`.
 *
 * @param {Object} msg
 * @return {String}
 * @api private
 */

exports.nick = function(msg){
  return msg.prefix.split('!')[0];
};

/**
 * Merge the contents of two objects together into the first object.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.extend = function(a, b) {
    for (var prop in b) {
	a[prop] = b[prop];
    }
    return a;
}
