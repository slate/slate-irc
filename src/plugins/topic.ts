/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin, TopicEvent } from "../types";
import * as utils from "../utils";

/**
 * TOPIC plugin to emit "topic" events.
 *
 * @return {Function}
 */

export default function topic(): Plugin {
  return (irc: IrcClient): void => {
    let channel: string | undefined;
    irc.on("data", (msg: IrcMessage) => {
      switch (msg.command) {
        case "RPL_NOTOPIC":
        case "RPL_TOPIC":
          channel = msg.params.split(" ")[1]!;
          break;

        case "TOPIC":
          channel = msg.params;
          break;

        default:
          return;
      }

      const e: TopicEvent = {
        hostmask: utils.hostmask(msg),
        channel: channel!.toLowerCase(),
        topic: msg.trailing,
      };
      if (msg.command === "TOPIC") e.nick = utils.nick(msg);
      irc.emit("topic", e);
    });
  };
}
