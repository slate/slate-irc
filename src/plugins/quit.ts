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
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "QUIT") return;
      const e: QuitEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        message: msg.trailing,
      };
      irc.emit("quit", e);
    });
  };
}
