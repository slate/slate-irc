/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin, QuitEvent } from "../types";
import * as utils from "../utils";

/**
 * QUIT plugin to emit "quit" events.
 *
 * @return {Function}
 */

export default function quit(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("QUIT" != msg.command) return;
      var e: QuitEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        message: msg.trailing,
      };
      irc.emit("quit", e);
    });
  };
}
