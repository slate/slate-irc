/**
 * Module dependencies.
 */

import type { InviteEvent, IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * INVITE plugin to emit "invite" events.
 *
 * @return {Function}
 */

export default function invite(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "INVITE") return;
      const e: InviteEvent = {
        from: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        to: msg.params.toLowerCase(),
        channel: msg.trailing,
      };
      irc.emit("invite", e);
    });
  };
}
