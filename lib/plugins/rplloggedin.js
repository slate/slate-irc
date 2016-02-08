/**
 * RPL_LOGGEDIN plugin to emit "loggedin" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if ('900' != msg.command && 'RPL_LOGGEDIN' != msg.command) return;
            var e = {};
            e.message = msg.trailing;
            irc.emit('loggedin', e);
        });
    }
};
