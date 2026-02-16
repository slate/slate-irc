import type { IrcClient, IrcMessage, Plugin } from "../types";

/**
 * RPL_WELCOME plugin to set `irc.me`.
 *
 * @return {Function}
 */

export default function welcome(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("RPL_WELCOME" != msg.command) return;
      irc.me = msg.params;
      irc.emit("welcome", irc.me);
    });
  };
}
