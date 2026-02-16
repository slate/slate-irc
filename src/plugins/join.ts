/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, JoinEvent, Plugin } from "../types";
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
      var e: JoinEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        channel: (msg.params || msg.trailing).toLowerCase(),
      };
      irc.emit("join", e);
    });
  };
}
