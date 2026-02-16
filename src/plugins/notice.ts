/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * NOTICE plugin to emit "notice" events.
 *
 * @return {Function}
 * @api public
 */

export default function notice(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("NOTICE" != msg.command) return;
      var e: Record<string, any> = {};
      e.from = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.to = msg.params.toLowerCase();
      e.message = msg.trailing;
      irc.emit("notice", e);
    });
  };
}
