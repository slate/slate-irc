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
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "PRIVMSG") return;
      const e: PrivmsgEvent = {
        from: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        to: msg.params.toLowerCase(),
        message: msg.trailing,
      };
      irc.emit("message", e);
    });
  };
}
