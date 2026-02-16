/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, NoticeEvent, Plugin } from "../types";
import * as utils from "../utils";

/**
 * NOTICE plugin to emit "notice" events.
 *
 * @return {Function}
 */

export default function notice(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "NOTICE") return;
      const e: NoticeEvent = {
        from: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        to: msg.params.toLowerCase(),
        message: msg.trailing,
      };
      irc.emit("notice", e);
    });
  };
}
