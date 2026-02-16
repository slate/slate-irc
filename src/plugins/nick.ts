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
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("NICK" != msg.command) return;
      var e: NickEvent = {
        nick: utils.nick(msg),
        hostmask: utils.hostmask(msg),
        new: msg.trailing,
      };
      if (!e.new) e.new = msg.params;
      if (e.nick == irc.me) irc.me = e.new;
      irc.emit("nick", e);
    });
  };
}
