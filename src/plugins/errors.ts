import type { ErrorEvent, IrcClient, IrcMessage, Plugin } from "../types";

/**
 * ERRORS plugin to emit "errors" events.
 *
 * List of possible errors:
 * https://github.com/williamwicks/irc-replies/blob/master/replies.json#L113-L170
 *
 * @return {Function}
 */

export default function errors(): Plugin {
  return function (irc: IrcClient): void {
    irc.on("data", function (msg: IrcMessage) {
      if (msg.command.indexOf("ERR_") !== 0) return;
      var e: ErrorEvent = {
        cmd: msg.command,
        message: msg.trailing,
      };
      irc.emit("errors", e);
    });
  };
}
