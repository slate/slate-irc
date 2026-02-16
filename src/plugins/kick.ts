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
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("KICK" != msg.command) return;
      var params = msg.params.split(" ");
      var e: KickEvent = {
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
