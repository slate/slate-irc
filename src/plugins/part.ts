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
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "PART") return;
      const e: PartEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        channels: utils.channelList(msg.params),
        message: msg.trailing,
      };
      irc.emit("part", e);
    });
  };
}
