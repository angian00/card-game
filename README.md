# Card Game

Some experiments for a Hearthstone-like collectible card game engine.

Currently I have a web client + nodejs server architecture.

## Prerequisites
- nodejs (tested with v5.6.0 and v9.5.0; uses ES5 syntax)
- npm
- for running tools scripts: Python3, imagemagick
- client-side: a modern Desktop browser with resolution >= 1024x768 (an iPad is good too)

Instructions:
- download this GitHub project: `git clone prj-url`
- from project dir, install node dependencies: `npm install .`
- install python scripts dependencies: `pip3 install -r requirements.txt`
- edit `tools/filter_cards.py` to set your subset of cards, and run it
- download card images by scraping `hearthstone.gamepedia.com`: `tools/scrape_images.py`
- run image format conversion script: `tools/convert_images.sh`

Finally, to run the thing:
- Launch server app: `node app.js`
- point your browser to `http://<your ip addr>:8081/index.html`
- Enjoy!

See [CHANGELOG](/CHANGELOG.md) for history of releases.

Look down here for plan of future releases.


## Milestones

- v0.4
	- incremental development of game mechanics
	- bugfixing

- v0.5
	- introduction of WebSockets for multiplayer


- v1.0
	- finalization of real-time multiplayer
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
