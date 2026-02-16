import type { AwayEvent, IrcClient, IrcMessage, Plugin } from "../types";

/**
 * AWAY plugin to emit "away" events.
 *
 * @return {Function}
 */

export default function away(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (
        msg.command !== "RPL_AWAY" &&
        msg.command !== "RPL_NOWAWAY" &&
        msg.command !== "RPL_UNAWAY"
      ) {
        return;
      }
      const params = msg.params.split(" ");
      const e: AwayEvent = {
        message: msg.trailing,
      };
      if (msg.command === "RPL_NOWAWAY" || msg.command === "RPL_UNAWAY") {
        e.nick = params[0];
      } else {
        e.nick = params[1];
      }
      irc.emit("away", e);
    });
  };
}
