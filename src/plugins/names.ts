/**
 * Module dependencies.
 */

import debugModule from "debug";

import type { AnyFn, IrcClient, IrcMessage, Plugin } from "../types";

const debug = debugModule("slate-irc:names");

/**
 * NAMES plugin to emit `name event`.
 *
 * @return {Function}
 * @api public
 */

export default function namesPlugin(): Plugin {
  return function (irc: IrcClient): void {
    var map: Record<string, Array<{ name: string; mode: string }>> = {};
    irc.names = names;
    irc.nameCallbacks = {};

    irc.on("data", function (msg: IrcMessage) {
      switch (msg.command) {
        case "RPL_NAMREPLY":
          var chan = msg.params.split(/ [=@*] /)[1]!.toLowerCase();
          var names = msg.trailing.split(" ");
          var users: Array<{ name: string; mode: string }> = [];

          names.forEach(function (n: string) {
            var user = n.split(/([~&@%+])/);
            var name = user.pop()!;
            var mode = user.pop();
            users.push({ name: name, mode: mode || "" });
          });

          map[chan] = (map[chan] || []).concat(users);
          debug("add %s %j", chan, users);
          break;

        case "RPL_ENDOFNAMES":
          var chan = msg.params.split(" ")[1]!.toLowerCase();
          debug('emit "names" for %s', chan);
          var e = { channel: chan, names: map[chan] || [] };
          var cb = irc.nameCallbacks[chan];

          if (cb) cb(e);
          else irc.emit("names", e);

          delete map[chan];
          break;
      }
    });
  };
}

/**
 * Fetch names for `channel` and invoke `fn(err, names)`.
 *
 * @param {String} channel
 * @param {Function} fn
 * @api public
 */

function names(this: IrcClient, channel: string, fn?: AnyFn): void {
  channel = channel.toLowerCase();

  if (fn) {
    this.nameCallbacks[channel] = (e: { names: any[] }) => {
      delete this.nameCallbacks[channel];
      fn(null, e.names);
    };
  }

  this.write("NAMES " + channel);
}
