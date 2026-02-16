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
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "JOIN") return;
      const e: JoinEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        channel: (msg.params || msg.trailing).toLowerCase(),
      };
      irc.emit("join", e);
    });
  };
}
