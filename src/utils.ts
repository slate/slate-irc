import type { Hostmask, IrcMessage } from "./types";

/**
 * Parse channel list `str`.
 *
 * @param {String} str
 * @return {Array}
 */

export function channelList(str: string): string[] {
  return str.split(",").map(function (chan: string) {
    return chan.toLowerCase();
  });
}

/**
 * Parse nick from `msg`.
 *
 * @param {Object} msg
 * @return {String}
 */

export function nick(msg: IrcMessage): string {
  return msg.prefix.split("!")[0]!;
}

/**
 * Parse hostmask from `msg`.
 *
 * @param {Object} msg
 * @return {Object}
 */

export function hostmask(msg: IrcMessage): Hostmask {
  var hostmask: Hostmask = {
    nick: "",
    string: msg.prefix,
  };
  var parts = msg.prefix.split("!");
  hostmask.nick = parts[0]!;

  try {
    parts = parts[1]!.split("@");
    hostmask.username = parts[0]!;
    hostmask.hostname = parts[1]!;
  } catch {
    // ..
  }

  return hostmask;
}

/**
 * Merge the contents of two objects together into the first object.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */

export function extend<A extends Record<string, unknown>, B extends Record<string, unknown>>(
  a: A,
  b: B,
): A & B {
  for (var prop in b) {
    (a as Record<string, unknown>)[prop] = b[prop];
  }
  return a as A & B;
}
