/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * PART plugin to emit "part" events.
 *
 * @return {Function}
 * @api public
 */

export default function part(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("PART" != msg.command) return;
      var e: Record<string, any> = {};
      e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channels = utils.channelList(msg.params);
      e.message = msg.trailing;
      irc.emit("part", e);
    });
  };
}
