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

export interface WhoisData {
  nickname?: string;
  username?: string;
  hostname?: string;
  realname?: string;
  channels: string[];
  oper: boolean;
  server?: string;
  away?: string;
  idle?: string;
  sign?: string;
}

export type AnyFn = (...args: any[]) => void;

export type WriteCallback = (err?: Error | null) => void;

export type IrcStream = Duplex & {
  setTimeout?: (ms: number) => void;
};

export type IrcClient = EventEmitter & {
  stream: IrcStream;
  parser: Parser;
  me?: string;
  names: (channel: string, fn?: AnyFn) => void;
  whois: (target: string, mask?: string | AnyFn, fn?: AnyFn) => void;
  nameCallbacks: Record<string, AnyFn | undefined>;
  whoisCallbacks: Record<string, AnyFn | undefined>;
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
  join: (channels: string | string[], keys?: string | string[] | AnyFn, fn?: WriteCallback) => void;
  part: (channels: string | string[], msg?: string | AnyFn, fn?: WriteCallback) => void;
  away: (msg?: string, fn?: WriteCallback) => void;
  back: (fn?: WriteCallback) => void;
  topic: (channel: string, topic?: string | AnyFn, fn?: WriteCallback) => void;
  kick: (
    channels: string | string[],
    nicks: string | string[],
    msg?: string | AnyFn,
    fn?: WriteCallback,
  ) => void;
  quit: (msg?: string, fn?: WriteCallback) => void;
  oper: (name: string, password: string, fn?: WriteCallback) => void;
  mode: (target: string, flags: string, params?: string | AnyFn, fn?: WriteCallback) => void;
  use: (fn: Plugin) => IrcClient;
  onmessage: (msg: IrcMessage) => void;
};

export type Plugin = (irc: IrcClient) => void;
export type PluginFactory = () => Plugin;
