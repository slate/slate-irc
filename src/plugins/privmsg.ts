/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin, PrivmsgEvent } from "../types";
import * as utils from "../utils";

/**
 * PRIVMSG plugin to emit "message" events.
 *
 * @return {Function}
 */

export default function privmsg(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("PRIVMSG" != msg.command) return;
      var e: PrivmsgEvent = {
        from: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        to: msg.params.toLowerCase(),
        message: msg.trailing,
      };
      irc.emit("message", e);
    });
  };
}
