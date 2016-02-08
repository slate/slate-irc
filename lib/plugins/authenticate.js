/**
 * AUTHENTICATE plugin to emit "authenticate" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if ('AUTHENTICATE' != msg.command) return;
            var e = {};
            e.message = msg.params;
            irc.emit('authenticate', e);
        });
    }
};
