/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, PartEvent, Plugin } from "../types";
import * as utils from "../utils";

/**
 * PART plugin to emit "part" events.
 *
 * @return {Function}
 */

export default function part(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("PART" != msg.command) return;
      var e: PartEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        channels: utils.channelList(msg.params),
        message: msg.trailing,
      };
      irc.emit("part", e);
    });
  };
}
