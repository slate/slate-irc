/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * QUIT plugin to emit "quit" events.
 *
 * @return {Function}
 * @api public
 */

export default function quit(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("QUIT" != msg.command) return;
      var e: Record<string, any> = {};
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.message = msg.trailing;
      irc.emit("quit", e);
    });
  };
}
