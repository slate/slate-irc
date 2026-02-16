import type { EventEmitter } from "node:events";
import type { Duplex } from "node:stream";

import type Parser from "slate-irc-parser";

export interface IrcMessage {
  prefix: string;
  command: string;
  params: string;
  trailing: string;
  string: string;
  [key: string]: unknown;
}

export interface Hostmask {
  nick: string;
  username?: string;
  hostname?: string;
  string: string;
}

export interface NamesUser {
  name: string;
  mode: string;
}

export interface AwayEvent {
  nick?: string | undefined;
  message: string;
}

export interface ErrorEvent {
  cmd: string;
  message: string;
}

export interface InviteEvent {
  from: string;
  hostmask: Hostmask;
  to: string;
  channel: string;
}

export interface JoinEvent {
  nick: string;
  hostmask: Hostmask;
  channel: string;
}

export interface KickEvent {
  nick: string;
  hostmask: Hostmask;
  channel: string;
  client: string;
  message: string;
}

export interface ModeEvent {
  nick: string;
  target?: string | undefined;
  mode: string;
  client?: string | undefined;
}

export interface MotdEvent {
  motd: string[];
}

export interface NamesEvent {
  channel: string;
  names: NamesUser[];
}

export interface NickEvent {
  nick: string;
  hostmask: Hostmask;
  new: string;
}

export interface NoticeEvent {
  from: string;
  hostmask: Hostmask;
  to: string;
  message: string;
}

export interface PartEvent {
  nick: string;
  hostmask: Hostmask;
  channels: string[];
  message: string;
}

export interface PrivmsgEvent {
  from: string;
  hostmask: Hostmask;
  to: string;
  message: string;
}

export interface QuitEvent {
  nick: string;
  hostmask: Hostmask;
  message: string;
}

export interface TopicEvent {
  nick?: string | undefined;
  hostmask: Hostmask;
  channel: string;
  topic: string;
}

export interface WhoisData {
  nickname?: string | undefined;
  username?: string | undefined;
  hostname?: string | undefined;
  realname?: string | undefined;
  channels: string[];
  oper: boolean;
  server?: string | undefined;
  away?: string | undefined;
  idle?: string | undefined;
  sign?: string | undefined;
}

export type AnyFn = (...args: unknown[]) => void;

export type NamesQueryCallback = (err: null, names: NamesUser[]) => void;

export type WhoisQueryCallback = (err: string | null | undefined, data: WhoisData | null) => void;

export type WriteCallback = (err?: Error | null) => void;

export type IrcStream = Duplex & {
  setTimeout?: (ms: number) => void;
};

export type IrcClient = EventEmitter & {
  stream: IrcStream;
  parser: Parser;
  me?: string;
  names: (channel: string, fn?: NamesQueryCallback) => void;
  whois: (target: string, mask?: string | WhoisQueryCallback, fn?: WhoisQueryCallback) => void;
  nameCallbacks: Record<string, ((event: NamesEvent) => void) | undefined>;
  whoisCallbacks: Record<string, WhoisQueryCallback | undefined>;
  writeUnsafe: (str: string, fn?: WriteCallback) => void;
  write: (str: string, fn?: WriteCallback) => void;
  pass: (pass: string, fn?: WriteCallback) => void;
  webirc: (
    password: string,
    username: string,
    hostname: string,
    ip: string,
    fn?: WriteCallback,
  ) => void;
  nick: (nick: string, fn?: WriteCallback) => void;
  user: (username: string, realname: string, fn?: WriteCallback) => void;
  invite: (name: string, channel: string, fn?: WriteCallback) => void;
  send: (target: string | string[], msg: string, fn?: WriteCallback) => void;
  action: (target: string, msg: string, fn?: WriteCallback) => void;
  notice: (target: string, msg: string, fn?: WriteCallback) => void;
  ctcp: (target: string, msg: string, fn?: WriteCallback) => void;
  join: (
    channels: string | string[],
    keys?: string | string[] | WriteCallback,
    fn?: WriteCallback,
  ) => void;
  part: (channels: string | string[], msg?: string | WriteCallback, fn?: WriteCallback) => void;
  away: (msg?: string, fn?: WriteCallback) => void;
  back: (fn?: WriteCallback) => void;
  topic: (channel: string, topic?: string | WriteCallback, fn?: WriteCallback) => void;
  kick: (
    channels: string | string[],
    nicks: string | string[],
    msg?: string | WriteCallback,
    fn?: WriteCallback,
  ) => void;
  quit: (msg?: string, fn?: WriteCallback) => void;
  oper: (name: string, password: string, fn?: WriteCallback) => void;
  mode: (
    target: string,
    flags: string,
    params?: string | WriteCallback,
    fn?: WriteCallback,
  ) => void;
  use: (fn: Plugin) => IrcClient;
  onmessage: (msg: IrcMessage) => void;
};

export type Plugin = (irc: IrcClient) => void;
export type PluginFactory = () => Plugin;
