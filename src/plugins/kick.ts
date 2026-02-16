/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, KickEvent, Plugin } from "../types";
import * as utils from "../utils";

/**
 * KICK plugin to emit "kick" events.
 *
 * @return {Function}
 */

export default function kick(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "KICK") return;
      const params = msg.params.split(" ");
      const e: KickEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        channel: params[0]!.toLowerCase(),
        client: params[1]!,
        message: msg.trailing,
      };
      irc.emit("kick", e);
    });
  };
}
