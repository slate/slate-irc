/**
 * Module dependencies.
 */

import { EventEmitter as Emitter } from 'events'
import debugModule from 'debug'
import Parser from 'slate-irc-parser'
import replies from 'irc-replies'

const debug = debugModule('slate-irc')

/**
 * Core plugins.
 */

import away from './lib/plugins/away'
import disconnect from './lib/plugins/disconnect'
import errors from './lib/plugins/errors'
import invite from './lib/plugins/invite'
import join from './lib/plugins/join'
import kick from './lib/plugins/kick'
import mode from './lib/plugins/mode'
import motd from './lib/plugins/motd'
import names from './lib/plugins/names'
import nick from './lib/plugins/nick'
import notice from './lib/plugins/notice'
import part from './lib/plugins/part'
import pong from './lib/plugins/pong'
import privmsg from './lib/plugins/privmsg'
import quit from './lib/plugins/quit'
import topic from './lib/plugins/topic'
import welcome from './lib/plugins/welcome'
import whois from './lib/plugins/whois'

/**
 * Initialize a new IRC client with the
 * given duplex `stream`.
 *
 * @param {Stream} stream
 * @param {Parser} [parser]
 * @param {String} [encoding]
 * @api public
 */

export default function Client(stream, parser, encoding) {
  if (!(this instanceof Client)) return new Client(stream, parser, encoding)
  stream.setEncoding(encoding || 'utf8')
  this.stream = stream
  this.parser = parser || new Parser()
  this.parser.on('message', this.onmessage.bind(this))
  stream.pipe(this.parser)
  this.setMaxListeners(100)
  this.use(away())
  this.use(disconnect())
  this.use(errors())
  this.use(invite())
  this.use(join())
  this.use(kick())
  this.use(mode())
  this.use(motd())
  this.use(names())
  this.use(nick())
  this.use(notice())
  this.use(part())
  this.use(pong())
  this.use(privmsg())
  this.use(quit())
  this.use(topic())
  this.use(welcome())
  this.use(whois())
}

/**
 * Inherit from `Emitter.prototype`.
 */

Client.prototype.__proto__ = Emitter.prototype

/**
 * Write `str` without checking for '\r' or '\n' and invoke `fn(err)`.
 *
 * @param {String} str
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.writeUnsafe = function (str, fn) {
  this.stream.write(str + '\r\n', fn)
}

/**
 * Write `str` and invoke `fn(err)`.
 *
 * @param {String} str
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.write = function (str, fn) {
  if (str.indexOf('\n') != -1 || str.indexOf('\r') != -1) {
    fn &&
      fn(
        new Error(
          "The parameter to write() must not contain any '\\n' or '\\r'.",
        ),
      )
    return
  }
  this.writeUnsafe(str, fn)
}

/**
 * PASS <pass>
 *
 * @param {String} pass
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.pass = function (pass, fn) {
  this.write('PASS ' + pass, fn)
}

/**
 * WEBIRC <password> <username> <hostname> <ip>
 * See https://www.irc.wiki/WebIRC
 *
 * @param {String} password
 * @param {String} username
 * @param {String} hostname
 * @param {String} ip
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.webirc = function (password, username, hostname, ip, fn) {
  var message = [password, username, hostname, ip].join(' ')
  this.write('WEBIRC ' + message, fn)
}

/**
 * NICK <nick>
 *
 * @param {String} nick
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.nick = function (nick, fn) {
  this.write('NICK ' + nick, fn)
}

/**
 * USER <username> <realname>
 *
 * @param {String} username
 * @param {String} realname
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.user = function (username, realname, fn) {
  this.write('USER ' + username + ' 0 * :' + realname, fn)
}

/**
 * Send an invite to `name`, for a `channel`.
 *
 * @param {String} name
 * @param {String} channel
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.invite = function (name, channel, fn) {
  this.write('INVITE ' + name + ' ' + channel, fn)
}

/**
 * Send `msg` to `target`, where `target`
 * is a channel or user name.
 *
 * @param {String|Array} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.send = function (target, msg, fn) {
  this.write('PRIVMSG ' + toArray(target).join(',') + ' :' + msg, fn)
}

/**
 * Send `msg` to `target` as an ACTION, where `target`
 * is a channel or user name.
 *
 * An action is a PRIVMSG with a syntax
 * like this:
 *
 *    PRIVMSG <target> :\u0001ACTION <msg>\u0001
 *
 * @param {String} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.action = function (target, msg, fn) {
  this.send(target, '\u0001' + 'ACTION ' + msg + '\u0001', fn)
}

/**
 * Send `msg` to `target` as a NOTICE, where `target`
 * is a channel or user name.
 *
 * @param {String} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.notice = function (target, msg, fn) {
  this.write('NOTICE ' + target + ' :' + msg, fn)
}

/**
 * Send `msg` to `target` as a CTCP notice, where `target`
 * is a user name.
 *
 * @param {String} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.ctcp = function (target, msg, fn) {
  this.notice(target, '\x01' + msg + '\x01', fn)
}

/**
 * Join channel(s).
 *
 * @param {String|Array} channels
 * @param {String|Array|Function} [keys or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.join = function (channels, keys, fn) {
  if ('function' == typeof keys) {
    fn = keys
    keys = ''
  }

  this.write(
    'JOIN ' + toArray(channels).join(',') + ' ' + toArray(keys).join(','),
    fn,
  )
}

/**
 * Leave channel(s) with optional `msg`.
 *
 * @param {String|Array} channels
 * @param {String|Function} [msg or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.part = function (channels, msg, fn) {
  if ('function' == typeof msg) {
    fn = msg
    msg = ''
  }

  var part = 'PART ' + toArray(channels).join(',')

  if (msg) {
    part += ' :' + msg
  }

  this.write(part, fn)
}

/**
 * Set the user's away message
 *
 * @param {String} [msg = 'Talk to you later!']
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.away = function (msg, fn) {
  msg = msg || 'Talk to you later!'
  this.write('AWAY :' + msg, fn)
}

/**
 * Remove user's away message
 *
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.back = function (fn) {
  this.write('AWAY', fn)
}

/**
 * Get channel topic or set the topic to `topic`.
 *
 * @param {String} channel
 * @param {String|Function} [topic or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.topic = function (channel, topic, fn) {
  if ('function' == typeof topic) {
    fn = topic
    topic = ''
  }

  if (topic) {
    topic = ' :' + topic
  }

  this.write('TOPIC ' + channel + topic, fn)
}

/**
 * Kick nick(s) from channel(s) with optional `msg`.
 *
 * @param {String|Array} channels
 * @param {String|Array} nicks
 * @param {String|Function} [msg or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.kick = function (channels, nicks, msg, fn) {
  if ('function' == typeof msg) {
    fn = msg
    msg = ''
  }

  var kick =
    'KICK ' + toArray(channels).join(',') + ' ' + toArray(nicks).join(',')

  if (msg) {
    kick += ' :' + msg
  }

  this.write(kick, fn)
}

/**
 * Disconnect from the server with `msg`.
 *
 * @param {String} [msg]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.quit = function (msg, fn) {
  msg = msg || 'Bye!'
  this.write('QUIT :' + msg, fn)
}

/**
 * Used to obtain operator privileges.
 * The combination of `name` and `password` are required
 * to gain Operator privileges.  Upon success, a `'mode'`
 * event will be emitted.
 *
 * @param {String} name
 * @param {String} password
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.oper = function (name, password, fn) {
  this.write('OPER ' + name + ' ' + password, fn)
}

/**
 * Used to set a user's mode or channel's mode for a user;
 *
 * @param {String} [nick or channel]
 * @param {String} flags
 * @param {String} params [nick - if setting channel mode]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.mode = function (target, flags, params, fn) {
  if ('function' === typeof params) {
    fn = params
    params = ''
  }
  if (params) {
    this.write('MODE ' + target + ' ' + flags + ' ' + params, fn)
  } else {
    this.write('MODE ' + target + ' ' + flags, fn)
  }
}

/**
 * Use the given plugin `fn`.
 *
 * @param {Function} fn
 * @return {Client} self
 * @api public
 */

Client.prototype.use = function (fn) {
  fn(this)
  return this
}

/**
 * Handle messages.
 *
 * Emit "message" (msg).
 *
 * @api private
 */

Client.prototype.onmessage = function (msg) {
  msg.command = replies[msg.command] || msg.command
  debug('message %s %s', msg.command, msg.string)
  this.emit('data', msg)
}

/**
 * Array helper.
 */

function toArray(val) {
  return Array.isArray(val) ? val : [val]
}
