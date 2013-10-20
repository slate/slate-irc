
0.2.3 / 2013-10-20 
==================

 * fix casing of privmsg target

0.2.2 / 2013-10-20 
==================

 * fix missing case normalization causing names to provide undefined

0.2.1 / 2013-10-20 
==================

 * fix casing normalization in names plugin method
 * fix casing normalization in names plugin

0.2.0 / 2013-10-20 
==================

 * add utils and lowercasing of channel names
 * add quit plugin
 * use dot reporter

0.1.2 / 2013-10-20 
==================

 * add ignoring of @ / + in names plugin for now
 * refactor `.names(channel, fn)` so that it does not collide with "names" events

0.1.1 / 2013-10-20 
==================

 * add test for emitting "names"
 * change "names" event to pass an object

0.1.0 / 2013-10-19 
==================

 * add away plugin
 * add topic plugin
 * add privmsg plugin
 * add kick plugin
 * add part plugin
 * add join plugin
 * rename "message" event to "data"
 * rename .leave() to .part()
 * rename .say() to .send()

0.0.2 / 2013-10-18 
==================

 * fix missing slate-irc-parser dep
