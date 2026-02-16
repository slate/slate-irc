/**
 * Module dependencies.
 */

import { EventEmitter as Emitter } from "events";

import debugModule from "debug";
import replies from "irc-replies";
import Parser from "slate-irc-parser";

import type { IrcClient, IrcMessage, IrcStream, Plugin, WriteCallback } from "./types";

const debug = debugModule("slate-irc");

/**
 * Core plugins.
 */

import away from "./plugins/away";
import disconnect from "./plugins/disconnect";
import errors from "./plugins/errors";
import invite from "./plugins/invite";
import join from "./plugins/join";
import kick from "./plugins/kick";
import mode from "./plugins/mode";
import motd from "./plugins/motd";
import names from "./plugins/names";
import nick from "./plugins/nick";
import notice from "./plugins/notice";
import part from "./plugins/part";
import pong from "./plugins/pong";
import privmsg from "./plugins/privmsg";
import quit from "./plugins/quit";
import topic from "./plugins/topic";
import welcome from "./plugins/welcome";
import whois from "./plugins/whois";

/**
 * Initialize a new IRC client with the
 * given duplex `stream`.
 *
 * @param {Stream} stream
 * @param {Parser} [parser]
 * @param {String} [encoding]
 * @api public
 */

type ClientConstructor = {
  new (stream: IrcStream, parser?: Parser, encoding?: BufferEncoding): IrcClient;
  (stream: IrcStream, parser?: Parser, encoding?: BufferEncoding): IrcClient;
  prototype: IrcClient;
};

const Client = function (
  this: IrcClient | undefined,
  stream: IrcStream,
  parser?: Parser,
  encoding?: BufferEncoding,
): IrcClient {
  if (!(this instanceof Client)) return new Client(stream, parser, encoding);
  const irc = this as IrcClient;
  stream.setEncoding(encoding || "utf8");
  irc.stream = stream;
  irc.parser = parser || new Parser();
  irc.parser.on("message", irc.onmessage.bind(irc));
  stream.pipe(irc.parser as unknown as NodeJS.WritableStream);
  irc.setMaxListeners(100);
  irc.use(away());
  irc.use(disconnect());
  irc.use(errors());
  irc.use(invite());
  irc.use(join());
  irc.use(kick());
  irc.use(mode());
  irc.use(motd());
  irc.use(names());
  irc.use(nick());
  irc.use(notice());
  irc.use(part());
  irc.use(pong());
  irc.use(privmsg());
  irc.use(quit());
  irc.use(topic());
  irc.use(welcome());
  irc.use(whois());
  return irc;
} as ClientConstructor;

export default Client;

/**
 * Inherit from `Emitter.prototype`.
 */

(Client.prototype as unknown as { __proto__: typeof Emitter.prototype }).__proto__ =
  Emitter.prototype;

/**
 * Write `str` without checking for '\r' or '\n' and invoke `fn(err)`.
 *
 * @param {String} str
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.writeUnsafe = function (this: IrcClient, str: string, fn?: WriteCallback): void {
  this.stream.write(str + "\r\n", fn);
};

/**
 * Write `str` and invoke `fn(err)`.
 *
 * @param {String} str
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.write = function (this: IrcClient, str: string, fn?: WriteCallback): void {
  if (str.indexOf("\n") != -1 || str.indexOf("\r") != -1) {
    if (fn) fn(new Error("The parameter to write() must not contain any '\\n' or '\\r'."));
    return;
  }
  this.writeUnsafe(str, fn);
};

/**
 * PASS <pass>
 *
 * @param {String} pass
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.pass = function (this: IrcClient, pass: string, fn?: WriteCallback): void {
  this.write("PASS " + pass, fn);
};

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

Client.prototype.webirc = function (
  this: IrcClient,
  password: string,
  username: string,
  hostname: string,
  ip: string,
  fn?: WriteCallback,
): void {
  var message = [password, username, hostname, ip].join(" ");
  this.write("WEBIRC " + message, fn);
};

/**
 * NICK <nick>
 *
 * @param {String} nick
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.nick = function (this: IrcClient, nick: string, fn?: WriteCallback): void {
  this.write("NICK " + nick, fn);
};

/**
 * USER <username> <realname>
 *
 * @param {String} username
 * @param {String} realname
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.user = function (
  this: IrcClient,
  username: string,
  realname: string,
  fn?: WriteCallback,
): void {
  this.write("USER " + username + " 0 * :" + realname, fn);
};

/**
 * Send an invite to `name`, for a `channel`.
 *
 * @param {String} name
 * @param {String} channel
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.invite = function (
  this: IrcClient,
  name: string,
  channel: string,
  fn?: WriteCallback,
): void {
  this.write("INVITE " + name + " " + channel, fn);
};

/**
 * Send `msg` to `target`, where `target`
 * is a channel or user name.
 *
 * @param {String|Array} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.send = function (
  this: IrcClient,
  target: string | string[],
  msg: string,
  fn?: WriteCallback,
): void {
  this.write("PRIVMSG " + toArray(target).join(",") + " :" + msg, fn);
};

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

Client.prototype.action = function (
  this: IrcClient,
  target: string,
  msg: string,
  fn?: WriteCallback,
): void {
  this.send(target, "\u0001" + "ACTION " + msg + "\u0001", fn);
};

/**
 * Send `msg` to `target` as a NOTICE, where `target`
 * is a channel or user name.
 *
 * @param {String} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.notice = function (
  this: IrcClient,
  target: string,
  msg: string,
  fn?: WriteCallback,
): void {
  this.write("NOTICE " + target + " :" + msg, fn);
};

/**
 * Send `msg` to `target` as a CTCP notice, where `target`
 * is a user name.
 *
 * @param {String} target
 * @param {String} msg
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.ctcp = function (
  this: IrcClient,
  target: string,
  msg: string,
  fn?: WriteCallback,
): void {
  this.notice(target, "\x01" + msg + "\x01", fn);
};

/**
 * Join channel(s).
 *
 * @param {String|Array} channels
 * @param {String|Array|Function} [keys or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.join = function (
  this: IrcClient,
  channels: string | string[],
  keys?: string | string[] | WriteCallback,
  fn?: WriteCallback,
): void {
  if ("function" == typeof keys) {
    fn = keys;
    keys = "";
  }

  this.write("JOIN " + toArray(channels).join(",") + " " + toArray(keys).join(","), fn);
};

/**
 * Leave channel(s) with optional `msg`.
 *
 * @param {String|Array} channels
 * @param {String|Function} [msg or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.part = function (
  this: IrcClient,
  channels: string | string[],
  msg?: string | WriteCallback,
  fn?: WriteCallback,
): void {
  if ("function" == typeof msg) {
    fn = msg;
    msg = "";
  }

  var part = "PART " + toArray(channels).join(",");

  if (msg) {
    part += " :" + msg;
  }

  this.write(part, fn);
};

/**
 * Set the user's away message
 *
 * @param {String} [msg = 'Talk to you later!']
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.away = function (this: IrcClient, msg?: string, fn?: WriteCallback): void {
  msg = msg || "Talk to you later!";
  this.write("AWAY :" + msg, fn);
};

/**
 * Remove user's away message
 *
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.back = function (this: IrcClient, fn?: WriteCallback): void {
  this.write("AWAY", fn);
};

/**
 * Get channel topic or set the topic to `topic`.
 *
 * @param {String} channel
 * @param {String|Function} [topic or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.topic = function (
  this: IrcClient,
  channel: string,
  topic?: string | WriteCallback,
  fn?: WriteCallback,
): void {
  if ("function" == typeof topic) {
    fn = topic;
    topic = "";
  }

  if (topic) {
    topic = " :" + topic;
  }

  this.write("TOPIC " + channel + topic, fn);
};

/**
 * Kick nick(s) from channel(s) with optional `msg`.
 *
 * @param {String|Array} channels
 * @param {String|Array} nicks
 * @param {String|Function} [msg or fn]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.kick = function (
  this: IrcClient,
  channels: string | string[],
  nicks: string | string[],
  msg?: string | WriteCallback,
  fn?: WriteCallback,
): void {
  if ("function" == typeof msg) {
    fn = msg;
    msg = "";
  }

  var kick = "KICK " + toArray(channels).join(",") + " " + toArray(nicks).join(",");

  if (msg) {
    kick += " :" + msg;
  }

  this.write(kick, fn);
};

/**
 * Disconnect from the server with `msg`.
 *
 * @param {String} [msg]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.quit = function (this: IrcClient, msg?: string, fn?: WriteCallback): void {
  msg = msg || "Bye!";
  this.write("QUIT :" + msg, fn);
};

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

Client.prototype.oper = function (
  this: IrcClient,
  name: string,
  password: string,
  fn?: WriteCallback,
): void {
  this.write("OPER " + name + " " + password, fn);
};

/**
 * Used to set a user's mode or channel's mode for a user;
 *
 * @param {String} [nick or channel]
 * @param {String} flags
 * @param {String} params [nick - if setting channel mode]
 * @param {Function} [fn]
 * @api public
 */

Client.prototype.mode = function (
  this: IrcClient,
  target: string,
  flags: string,
  params?: string | WriteCallback,
  fn?: WriteCallback,
): void {
  if ("function" === typeof params) {
    fn = params;
    params = "";
  }
  if (params) {
    this.write("MODE " + target + " " + flags + " " + params, fn);
  } else {
    this.write("MODE " + target + " " + flags, fn);
  }
};

/**
 * Use the given plugin `fn`.
 *
 * @param {Function} fn
 * @return {Client} self
 * @api public
 */

Client.prototype.use = function (this: IrcClient, fn: Plugin): IrcClient {
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

Client.prototype.onmessage = function (this: IrcClient, msg: IrcMessage): void {
  msg.command = replies[msg.command as keyof typeof replies] || msg.command;
  debug("message %s %s", msg.command, msg.string);
  this.emit("data", msg);
};

/**
 * Array helper.
 */

function toArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}
