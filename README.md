# Card Game

Some experiments for a Hearthstone-like collectible card game engine.

Currently I have a web client + nodejs server architecture.

## Prerequisites
- nodejs (tested with v5.6.0 and v9.5.0; uses ES5 syntax)
- npm
- client-side: a modern Desktop browser with resolution >= 1024x768 (an iPad is good too)

Instructions:
- git clone prj-url
- from project dir: npm install .
- node app.js
- point your browser to `http://<your ip addr>:8081/index.html`
- Enjoy!

See [CHANGELOG](/CHANGELOG.md) for history of past releases.

See here for plan of future releases.


## Milestones

- v0.3
	v correct (scraped) Hearthstone card images
	v improvements of user experience
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
	- hero and hero powers


- v2.0
	- full (reasonable subset of) card mechanics
	- some try at AI?

- v3.0
	- deck editing
	- tournments, rating, etc.
	- integration with 3rd parties, ex. support for Kettle protocol


## Acknowledgements
Hearthstone card data courtesy of https://hearthstonejson.com.
