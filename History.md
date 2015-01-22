0.8.1 / 2015-01-22
==================

 * add optional stream encoding
 * add optional kick/part message
 * add webirc command
 * fix empty names callback
 * fix empty names array

0.8.0 / 2014-12-22 
==================

 * add "npm test" script
 * add hostmask to events
 * fix whois test
 * add "invite" event
 * add kick message to event

0.7.3 / 2014-10-10
==================

  * add nick fallback

0.7.2 / 2014-10-04
==================

  * retain '&' user mode

0.7.1 / 2014-09-14
==================

  * Allow custom parsers

0.7.0 / 2014-09-03
==================

  * add ctcp function
  * update readme
  * fix topic()

0.6.0 / 2014-06-22
==================

 * add: emit 'pong' event
 * add: retain ~ and % modes
 * add: send() now accept array as argument
 * add errors plugin
 * add optional keys argument to join.
 * add action function
 * fix join. use trailing as fallback

0.5.0 / 2014-04-16
==================

 * add mode plugin
 * add motd plugin
 * add nickname to whois event
 * fix topic plugin
 * fix whois channels

0.4.0 / 2013-12-23
==================

 * add whois plugin
 * add notice plugin
 * update error handeling in whois to be consistant
 * fix away test label
 * fix handling away messages in whois
 * fix away plugin

0.3.0 / 2013-11-14
==================

 * add notice function
 * add invite function
 * add mode function
 * add oper function
 * add topic function
 * add kick function
 * add nick plugin
 * rename "nick" event to "welcome"
 * fix nick() should set client.me test (on next event loop proccess)
 * fix max listeners warning

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
