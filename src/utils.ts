import type { Hostmask, IrcMessage } from "./types";

/**
 * Parse channel list `str`.
 *
 * @param {String} str
 * @return {Array}
 */

export function channelList(str: string): string[] {
  return str.split(",").map((chan: string) => chan.toLowerCase());
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
  const mask: Hostmask = {
    nick: "",
    string: msg.prefix,
  };
  let parts = msg.prefix.split("!");
  mask.nick = parts[0]!;

  try {
    parts = parts[1]!.split("@");
    mask.username = parts[0]!;
    mask.hostname = parts[1]!;
  } catch {
    // ..
  }

  return mask;
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
  for (const prop in b) {
    (a as Record<string, unknown>)[prop] = b[prop];
  }
  return a as A & B;
}
