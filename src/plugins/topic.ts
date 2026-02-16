/**
 * Module dependencies.
 */

import type { IrcClient, IrcMessage, Plugin } from "../types";
import * as utils from "../utils";

/**
 * TOPIC plugin to emit "topic" events.
 *
 * @return {Function}
 * @api public
 */

export default function topic(): Plugin {
  return function (irc: IrcClient): void {
    var channel: string | undefined;
    irc.on("data", function (msg: IrcMessage) {
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

      var e: Record<string, any> = {};
      if ("TOPIC" == msg.command) e.nick = utils.nick(msg);
      e.hostmask = utils.hostmask(msg);
      e.channel = channel!.toLowerCase();
      e.topic = msg.trailing;
      irc.emit("topic", e);
    });
  };
}
