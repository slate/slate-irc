/**
 * CAP plugin to emit "cap" events.
 *
 * @return {Function}
 * @api public
 */

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if ('CAP' != msg.command) return;
            var params = msg.params.split(' ');
            var e = {};
            e.nick = params[0];
            e.command = params[1];
            e.capabilities = msg.trailing.split(' ');
            irc.emit('cap', e);
        });
    }
};
