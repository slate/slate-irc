/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
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
      var e: Record<string, any> = {};
      var params = msg.params.split(" ");
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channel = params[0]!.toLowerCase();
      e.client = params[1]!;
      e.message = msg.trailing;
      irc.emit("kick", e);
    });
  };
}
