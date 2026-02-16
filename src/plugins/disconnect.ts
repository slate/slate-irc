import type { IrcClient, Plugin } from "../types";

/**
 * DISCONNECT plugin to emit "disconnect" events.
 *
 * @return {Function}
 */

export default function disconnect(): Plugin {
  return (irc: IrcClient): void => {
    const stream = irc.stream;
    const ms = 60 * 1000;

    stream.on("close", () => {
      irc.emit("disconnect");
    });

    // Do nothing when given stream cannot perform setTimeout() operation
    if (stream.setTimeout === undefined || stream.setTimeout === null) {
      return;
    }

    stream.setTimeout(ms);

    stream.on("timeout", () => {
      let timeout = true;
      const time = Date.now();

      irc.write(`PING :${time}`);

      irc.once("pong", (res: string | number) => {
        if (String(res) === String(time)) {
          timeout = false;
        }
      });

      setTimeout(() => {
        if (timeout) {
          stream.destroy();
        }
      }, 5000);
    });
  };
}
