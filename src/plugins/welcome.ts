import type { IrcClient, IrcMessage, Plugin } from "../types";

/**
 * RPL_WELCOME plugin to set `irc.me`.
 *
 * @return {Function}
 */

export default function welcome(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command !== "RPL_WELCOME") return;
      irc.me = msg.params;
      irc.emit("welcome", irc.me);
    });
  };
}
