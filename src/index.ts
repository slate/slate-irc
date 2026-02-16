/**
 * Module dependencies.
 */

import { EventEmitter as Emitter } from "events";

import debugModule from "debug";
import replies from "irc-replies";
import Parser from "slate-irc-parser";

import type { IrcClient, IrcMessage, IrcStream, Plugin, WriteCallback } from "./types";
export type {
  AwayEvent,
  AnyFn,
  ErrorEvent,
  Hostmask,
  IrcClient,
  IrcMessage,
  IrcStream,
  InviteEvent,
  JoinEvent,
  KickEvent,
  ModeEvent,
  MotdEvent,
  NamesEvent,
  NamesQueryCallback,
  NamesUser,
  NickEvent,
  NoticeEvent,
  PartEvent,
  Plugin,
  PluginFactory,
  PrivmsgEvent,
  QuitEvent,
  TopicEvent,
  WhoisData,
  WhoisQueryCallback,
  WriteCallback,
} from "./types";

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
 */

export type ClientFactory = (
  stream: IrcStream,
  parser?: Parser,
  encoding?: BufferEncoding,
) => IrcClient;

class ClientImpl extends Emitter {
  private static readonly debug = debugModule("slate-irc");

  stream!: IrcStream;
  parser!: Parser;
  me?: string;
  names!: IrcClient["names"];
  whois!: IrcClient["whois"];
  nameCallbacks!: IrcClient["nameCallbacks"];
  whoisCallbacks!: IrcClient["whoisCallbacks"];

  constructor(stream: IrcStream, parser?: Parser, encoding?: BufferEncoding) {
    super();
    stream.setEncoding(encoding || "utf8");
    this.stream = stream;
    this.parser = parser || new Parser();
    this.parser.on("message", this.onmessage.bind(this));
    stream.pipe(this.parser as unknown as NodeJS.WritableStream);
    this.setMaxListeners(100);
    this.use(away());
    this.use(disconnect());
    this.use(errors());
    this.use(invite());
    this.use(join());
    this.use(kick());
    this.use(mode());
    this.use(motd());
    this.use(names());
    this.use(nick());
    this.use(notice());
    this.use(part());
    this.use(pong());
    this.use(privmsg());
    this.use(quit());
    this.use(topic());
    this.use(welcome());
    this.use(whois());
  }

  writeUnsafe(str: string, fn?: WriteCallback): void {
    this.stream.write(`${str}\r\n`, fn);
  }

  write(str: string, fn?: WriteCallback): void {
    if (str.includes("\n") || str.includes("\r")) {
      if (fn) fn(new Error("The parameter to write() must not contain any '\\n' or '\\r'."));
      return;
    }
    this.writeUnsafe(str, fn);
  }

  pass(pass: string, fn?: WriteCallback): void {
    this.write(`PASS ${pass}`, fn);
  }

  webirc(
    password: string,
    username: string,
    hostname: string,
    ip: string,
    fn?: WriteCallback,
  ): void {
    const message = [password, username, hostname, ip].join(" ");
    this.write(`WEBIRC ${message}`, fn);
  }

  nick(nick: string, fn?: WriteCallback): void {
    this.write(`NICK ${nick}`, fn);
  }

  user(username: string, realname: string, fn?: WriteCallback): void {
    this.write(`USER ${username} 0 * :${realname}`, fn);
  }

  invite(name: string, channel: string, fn?: WriteCallback): void {
    this.write(`INVITE ${name} ${channel}`, fn);
  }

  send(target: string | string[], msg: string, fn?: WriteCallback): void {
    this.write(`PRIVMSG ${toArray(target).join(",")} :${msg}`, fn);
  }

  action(target: string, msg: string, fn?: WriteCallback): void {
    this.send(target, `\u0001ACTION ${msg}\u0001`, fn);
  }

  notice(target: string, msg: string, fn?: WriteCallback): void {
    this.write(`NOTICE ${target} :${msg}`, fn);
  }

  ctcp(target: string, msg: string, fn?: WriteCallback): void {
    this.notice(target, `\x01${msg}\x01`, fn);
  }

  join(
    channels: string | string[],
    keys?: string | string[] | WriteCallback,
    fn?: WriteCallback,
  ): void {
    if (typeof keys === "function") {
      fn = keys;
      keys = "";
    }

    this.write(`JOIN ${toArray(channels).join(",")} ${toArray(keys).join(",")}`, fn);
  }

  part(channels: string | string[], msg?: string | WriteCallback, fn?: WriteCallback): void {
    if (typeof msg === "function") {
      fn = msg;
      msg = "";
    }

    let part = `PART ${toArray(channels).join(",")}`;
    if (msg) {
      part += ` :${msg}`;
    }
    this.write(part, fn);
  }

  away(msg?: string, fn?: WriteCallback): void {
    const awayMessage = msg || "Talk to you later!";
    this.write(`AWAY :${awayMessage}`, fn);
  }

  back(fn?: WriteCallback): void {
    this.write("AWAY", fn);
  }

  topic(channel: string, topic?: string | WriteCallback, fn?: WriteCallback): void {
    if (typeof topic === "function") {
      fn = topic;
      topic = "";
    }

    if (topic) {
      topic = ` :${topic}`;
    }

    this.write(`TOPIC ${channel}${topic}`, fn);
  }

  kick(
    channels: string | string[],
    nicks: string | string[],
    msg?: string | WriteCallback,
    fn?: WriteCallback,
  ): void {
    if (typeof msg === "function") {
      fn = msg;
      msg = "";
    }

    let kick = `KICK ${toArray(channels).join(",")} ${toArray(nicks).join(",")}`;
    if (msg) {
      kick += ` :${msg}`;
    }
    this.write(kick, fn);
  }

  quit(msg?: string, fn?: WriteCallback): void {
    const quitMessage = msg || "Bye!";
    this.write(`QUIT :${quitMessage}`, fn);
  }

  oper(name: string, password: string, fn?: WriteCallback): void {
    this.write(`OPER ${name} ${password}`, fn);
  }

  mode(target: string, flags: string, params?: string | WriteCallback, fn?: WriteCallback): void {
    if (typeof params === "function") {
      fn = params;
      params = "";
    }

    if (params) {
      this.write(`MODE ${target} ${flags} ${params}`, fn);
    } else {
      this.write(`MODE ${target} ${flags}`, fn);
    }
  }

  use(fn: Plugin): IrcClient {
    fn(this as unknown as IrcClient);
    return this as unknown as IrcClient;
  }

  onmessage(msg: IrcMessage): void {
    msg.command = replies[msg.command as keyof typeof replies] || msg.command;
    ClientImpl.debug("message %s %s", msg.command, msg.string);
    this.emit("data", msg);
  }
}

function Client(stream: IrcStream, parser?: Parser, encoding?: BufferEncoding): IrcClient {
  return new ClientImpl(stream, parser, encoding) as unknown as IrcClient;
}

export default Client;

/**
 * Array helper.
 */

function toArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}
