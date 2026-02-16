/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * PRIVMSG plugin to emit "message" events.
 *
 * @return {Function}
 * @api public
 */

export default function privmsg(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("PRIVMSG" != msg.command) return;
      var e: Record<string, any> = {};
      e.from = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.to = msg.params.toLowerCase();
      e.message = msg.trailing;
      irc.emit("message", e);
    });
  };
}
