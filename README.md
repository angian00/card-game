# Card Game

Some experiments for a Hearthstone-like collectible card game engine.

Currently I have a web client + nodejs server architecture.

## Prerequisites
- nodejs (tested with v9.5.0; uses ES5 syntax)
- npm
- client-side: a modern Desktop browser with resolution >= 1024x768 (an iPad is good too)

Instructions:
- git clone <...>
- from project dir: npm install .
- node app.js
- Enjoy!

See (CHANGELOG.md) for history of releases.


## Milestones
AKA grand plan of future releases:
- v0.2 
	- switch to web GUI + node server architecture
	- can play a vanilla game (just minions, no mechanics) solo, ("hotseat")

- v0.3
	- correct (scraped) Hearthstone card images
	- improvements of user experience (notice messages)
	- still solo game
	- some basic minion abilities

- v0.x
	- incremental development of abilities
	- bugfixing


- v1.0
	- real-time multiplayer
		- WebSockets architecture
		- simple authentication/authorization/encryption
	- card types other than minions


- v2.0
	- full (reasonable subset of) card mechanics
	- some try at AI?

- v3.0
Extra features, like
	- deck editing
	- tournments, rating, etc.
	- integration with 3rd parties, ex. support for Kettle protocol
