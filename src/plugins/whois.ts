/**
 * Module dependencies.
 */
import type { AnyFn, IrcClient, IrcMessage, Plugin } from "../types";

/**
 * WHOIS plugin to emit "whois" events.
 *
 * @return {Function}
 */

export default function whoisPlugin(): Plugin {
  return function (irc: IrcClient): void {
    var map: Record<string, Record<string, any>> = {};
    var err: string | undefined;
    irc.whois = whois;
    irc.whoisCallbacks = {};

    irc.on("data", function (msg: IrcMessage) {
      switch (msg.command) {
        case "RPL_WHOISUSER":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          map[target] = map[target] || {};
          map[target]!.nickname = params[1];
          map[target]!.username = params[2];
          map[target]!.hostname = params[3];
          map[target]!.realname = msg.trailing;
          map[target]!.channels = [];
          map[target]!.oper = false;
          break;
        case "RPL_WHOISCHANNELS":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          var channels = msg.trailing.split(" ");
          map[target]!.channels = map[target]!.channels.concat(channels);
          break;
        case "RPL_WHOISSERVER":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          map[target]!.server = params[2];
          break;
        case "RPL_AWAY":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          if (!map[target]) return;
          map[target]!.away = msg.trailing;
          break;
        case "RPL_WHOISOPERATOR":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          map[target]!.oper = true;
          break;
        case "RPL_WHOISIDLE":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          map[target]!.idle = params[2]; // new Date(now - (n * 1000))
          map[target]!.sign = params[3]; // new Date(n * 1000)
          break;
        case "RPL_ENDOFWHOIS":
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          if (!map[target]) return;
          var cb = irc.whoisCallbacks[target];
          if (cb) cb(err, map[target]);
          else irc.emit("whois", null, map[target]);
          map = {};
          break;
        case "ERR_NEEDMOREPARAMS":
          err = "Not enough parameters";
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          if (target !== "whois") return;
          var cb = irc.whoisCallbacks[target];
          if (cb) cb(err, null);
          else irc.emit("whois", err, null);
          break;
        case "ERR_NOSUCHSERVER":
          err = "No such server";
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          var cb = irc.whoisCallbacks[target];
          if (cb) cb(err, null);
          else irc.emit("whois", err, null);
          break;
        case "ERR_NOSUCHNICK":
          err = "No such nick/channel";
          var params = msg.params.split(" ");
          var target = params[1]!.toLowerCase();
          var cb = irc.whoisCallbacks[target];
          if (cb) cb(err, null);
          else irc.emit("whois", err, null);
          break;
      }
    });
  };
}

/**
 * Fetch whois data and invoke `fn(err, data)`.
 *
 * @param {String} target
 * @param {String} mask
 * @param {Function} fn
 */

function whois(this: IrcClient, target: string, mask?: string | AnyFn, fn?: AnyFn): void {
  if ("function" == typeof mask) {
    fn = mask;
    mask = "";
  }

  target = target.toLowerCase();

  if (fn) {
    this.whoisCallbacks[target] = (err: string, data: any) => {
      delete this.whoisCallbacks[target];
      fn(err, data);
    };
  }

  this.write(["WHOIS", target, mask].filter(Boolean).join(" "));
}
