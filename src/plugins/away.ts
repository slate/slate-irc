import type { AwayEvent, IrcClient, IrcMessage, Plugin } from "../types";

/**
 * AWAY plugin to emit "away" events.
 *
 * @return {Function}
 */

export default function away(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("RPL_AWAY" != msg.command && "RPL_NOWAWAY" != msg.command && "RPL_UNAWAY" != msg.command)
        return;
      var params = msg.params.split(" ");
      var e: AwayEvent = {
        message: msg.trailing,
      };
      if ("RPL_NOWAWAY" == msg.command || "RPL_UNAWAY" == msg.command) {
        e.nick = params[0];
      } else {
        e.nick = params[1];
      }
      irc.emit("away", e);
    });
  };
}
