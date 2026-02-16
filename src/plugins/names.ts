/**
 * Module dependencies.
 */

import debugModule from "debug";

import type {
  IrcClient,
  IrcMessage,
  NamesEvent,
  NamesQueryCallback,
  NamesUser,
  Plugin,
} from "../types";

const debug = debugModule("slate-irc:names");

/**
 * NAMES plugin to emit `name event`.
 *
 * @return {Function}
 */

export default function namesPlugin(): Plugin {
  return (irc: IrcClient): void => {
    const map: Record<string, NamesUser[]> = {};
    irc.names = names;
    irc.nameCallbacks = {};

    irc.on("data", (msg: IrcMessage) => {
      switch (msg.command) {
        case "RPL_NAMREPLY": {
          const chan = msg.params.split(/ [=@*] /)[1]!.toLowerCase();
          const names = msg.trailing.split(" ");
          const users: NamesUser[] = [];

          names.forEach((n: string) => {
            const user = n.split(/([~&@%+])/);
            const name = user.pop()!;
            const mode = user.pop();
            users.push({ name, mode: mode || "" });
          });

          map[chan] = (map[chan] || []).concat(users);
          debug("add %s %j", chan, users);
          break;
        }

        case "RPL_ENDOFNAMES": {
          const chan = msg.params.split(" ")[1]!.toLowerCase();
          debug('emit "names" for %s', chan);
          const e: NamesEvent = { channel: chan, names: map[chan] || [] };
          const cb = irc.nameCallbacks[chan];

          if (cb) cb(e);
          else irc.emit("names", e);

          delete map[chan];
          break;
        }
      }
    });
  };
}

/**
 * Fetch names for `channel` and invoke `fn(err, names)`.
 *
 * @param {String} channel
 * @param {Function} fn
 */

function names(this: IrcClient, channel: string, fn?: NamesQueryCallback): void {
  channel = channel.toLowerCase();

  if (fn) {
    this.nameCallbacks[channel] = (e: NamesEvent) => {
      delete this.nameCallbacks[channel];
      fn(null, e.names);
    };
  }

  this.write(`NAMES ${channel}`);
}
