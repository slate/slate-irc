/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * JOIN plugin to emit "join" events.
 *
 * @return {Function}
 */

export default function join(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("JOIN" != msg.command) return;
      var e: Record<string, any> = {};
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channel = (msg.params || msg.trailing).toLowerCase();
      irc.emit("join", e);
    });
  };
}
