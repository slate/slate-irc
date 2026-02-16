import type { IrcClient, IrcMessage, Plugin } from "../types";

/**
 * PONG plugin to reply to PING events.
 *
 * @return {Function}
 */

export default function pong(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if ("PONG" == msg.command) irc.emit("pong", msg.trailing);
      if ("PING" != msg.command) return;
      irc.write("PONG :" + msg.trailing);
    });
  };
}
