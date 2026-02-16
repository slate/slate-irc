/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * MODE plugin to emit "mode" events.
 *
 * @return {Function}
 */

export default function mode(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("MODE" != msg.command) return;
      var params = msg.params.split(" ");
      var e: Record<string, any> = {};
      e.nick = utils.nick(msg);
      e.target = params[0];
      e.mode = params[1] || msg.trailing;
      e.client = params[2];
      irc.emit("mode", e);
    });
  };
}
