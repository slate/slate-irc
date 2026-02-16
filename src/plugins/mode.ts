/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, ModeEvent, Plugin } from "../types";
import * as utils from "../utils";

/**
 * MODE plugin to emit "mode" events.
 *
 * @return {Function}
 */

export default function mode(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "MODE") return;
      const params = msg.params.split(" ");
      const e: ModeEvent = {
        nick: utils.nick(msg),
        target: params[0],
        mode: params[1] || msg.trailing,
        client: params[2],
      };
      irc.emit("mode", e);
    });
  };
}
