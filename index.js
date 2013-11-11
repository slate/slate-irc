
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var debug = require('debug')('slate-irc');
var Parser = require('slate-irc-parser');
var replies = require('irc-replies');

/**
 * Core plugins.
 */

var nick = require('./lib/plugins/nick');
var privmsg = require('./lib/plugins/privmsg');
var topic = require('./lib/plugins/topic');
var names = require('./lib/plugins/names');
var quit = require('./lib/plugins/quit');
var away = require('./lib/plugins/away');
var welcome = require('./lib/plugins/welcome');
var pong = require('./lib/plugins/pong');
var join = require('./lib/plugins/join');
var part = require('./lib/plugins/part');
var kick = require('./lib/plugins/kick');

/**
 * Expose `Client.`
 */

module.exports = Client;

/**
 * Initialize a new IRC client with the
 * given duplex `stream`.
 *
 * @param {Stream} stream
 * @api public
 */

function Client(stream) {
  if (!(this instanceof Client)) return new Client(stream);
  stream.setEncoding('utf8');
  this.stream = stream;
  this.parser = new Parser;
  this.parser.on('message', this.onmessage.bind(this));
  stream.pipe(this.parser);
  this.use(nick());
  this.use(privmsg());
  this.use(topic());
  this.use(names());
  this.use(away());
  this.use(quit());
  this.use(join());
  this.use(part());
  this.use(kick());
  this.use(pong());
  this.use(welcome());
}

/**
 * Inherit from `Emitter.prototype`.
 */

Client.prototype.__proto__ = Emitter.prototype;

/**
 * Write `str` and invoke `fn(err)`.
 *
 * @param {String} str
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.write = function(str, fn){
  this.stream.write(str + '\r\n', fn);
};

/**
 * PASS <pass>
 *
 * @param {String} pass
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.pass = function(pass, fn){
  this.write('PASS ' + pass, fn);
};

/**
 * NICK <nick>
 *
 * @param {String} nick
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.nick = function(nick, fn){
  this.me = nick;
  this.write('NICK ' + nick, fn);
};

/**
 * USER <username> <realname>
 *
 * @param {String} username
 * @param {String} realname
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.user = function(username, realname, fn){
  this.write('USER ' + username + ' 0 * :' + realname, fn);
};

/**
 * Send `msg` to `target`, where `target`
 * is a channel or user name.
 *
 * @param {String} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.send = function(target, msg, fn){
  this.write('PRIVMSG ' + target + ' :' + msg, fn);
};

/**
 * Join channel(s).
 *
 * @param {String|Array} channels
 * @api public
 */

Client.prototype.join = function(channels, fn){
  this.write('JOIN ' + toArray(channels).join(','), fn);
};

/**
 * Leave channel(s) with optional `msg`.
 *
 * @param {String|Array} channels
 * @param {String|Function} [msg or fn]
 * @param {Function} [fn]
 * @return {Type}
 * @api public
 */

Client.prototype.part = function(channels, msg, fn){
  if ('function' == typeof msg) {
    fn = msg;
    msg = '';
  }

  this.write('PART ' + toArray(channels).join(',') + ' :' + msg, fn);
};

/**
 * Kick nick(s) from channel(s) with optional `msg`.
 *
 * @param {String|Array} channels
 * @param {String|Array} nicks
 * @param {String|Function} [msg or fn]
 * @param {Function} [fn]
 * @return {Type}
 * @api public
 */
Client.prototype.kick = function(channels, nicks, msg, fn){
  if ('function' == typeof msg) {
    fn = msg;
    msg = '';
  }
  this.write('KICK ' + toArray(channels).join(',') + ' ' + toArray(nicks).join(',') + ' :' + msg, fn);
};

/**
 * Disconnect from the server with `msg`.
 *
 * @param {String} [msg]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.quit = function(msg, fn){
  msg = msg || 'Bye!';
  this.write('QUIT :' + msg, fn);
};

/**
 * Use the given plugin `fn`.
 *
 * @param {Function} fn
 * @return {Client} self
 * @api public
 */

Client.prototype.use = function(fn){
  fn(this);
  return this;
};

/**
 * Handle messages.
 * 
 * Emit "message" (msg).
 * 
 * @api private
 */

Client.prototype.onmessage = function(msg){
  msg.command = replies[msg.command] || msg.command;
  debug('message %s %s', msg.command, msg.string);
  this.emit('data', msg);
};

/**
 * Array helper.
 */

function toArray(val) {
  return Array.isArray(val) ? val : [val];
}