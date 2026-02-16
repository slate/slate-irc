import type { IrcClient, IrcMessage, Plugin } from "../types";

/**
 * PONG plugin to reply to PING events.
 *
 * @return {Function}
 */

export default function pong(): Plugin {
  return (irc: IrcClient): void => {
    irc.on("data", (msg: IrcMessage) => {
      if (msg.command === "PONG") irc.emit("pong", msg.trailing);
      if (msg.command !== "PING") return;
      irc.write(`PONG :${msg.trailing}`);
    });
  };
}
