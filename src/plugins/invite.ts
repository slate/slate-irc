/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * INVITE plugin to emit "invite" events.
 *
 * @return {Function}
 */

export default function invite(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("INVITE" != msg.command) return;
      var e: Record<string, any> = {};
      e.from = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.to = msg.params.toLowerCase();
      e.channel = msg.trailing;
      irc.emit("invite", e);
    });
  };
}
