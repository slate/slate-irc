/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, NickEvent, Plugin } from "../types";
import * as utils from "../utils";

/**
 * NICK plugin to emit "nick" events.
 *
 * @return {Function}
 */

export default function nick(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "NICK") return;
      const e: NickEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        new: msg.trailing,
      };
      if (!e.new) e.new = msg.params;
      if (e.nick === irc.me) irc.me = e.new;
      irc.emit("nick", e);
    });
  };
}
