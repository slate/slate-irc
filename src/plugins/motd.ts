import type { IrcClient, IrcMessage, MotdEvent, Plugin } from "../types";

/**
 * MOTD plugin to emit "motd" events.
 *
 * @return {Function}
 */

export default function motd(): Plugin {
  return function (irc: IrcClient): void {
    var e: MotdEvent = {
      motd: [],
    };

    irc.on("data", function (msg: IrcMessage) {
      switch (msg.command) {
        case "RPL_MOTDSTART":
          e.motd.length = 0;
          e.motd.push(msg.trailing);
          break;
        case "RPL_ENDOFMOTD":
        case "RPL_MOTD":
          e.motd.push(msg.trailing);
          break;
      }

      if (msg.command == "RPL_ENDOFMOTD") {
        irc.emit("motd", e);
      }
    });
  };
}
