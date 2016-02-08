/**
 * RPL_SASLSUCCESS plugin to emit "saslsuccess" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if ('903' != msg.command && 'RPL_SASLSUCCESS' != msg.command) return;
            var e = {};
            e.message = msg.trailing;
            irc.emit('saslsuccess', e);
        });
    }
};
