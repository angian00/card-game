'use strict';

const fs = require("fs");
const csv = require("csv");
const readline = require("readline");

const utils = require("gc-util");
const cs = require("card_scripts");




function Deck(owner, zone) {
	this.owner = owner;
	this.zone = zone;
	this.cards = [];

	this.addCard = function(cKey) {
		let c = null;
		if ((cKey instanceof Card) || (cKey instanceof Minion)) {
			c = cKey;
		} else {
			c = Deck.cardCatalog[cKey];
			if (c == undefined || c == null) {
				console.error("Card not found for id: " + cKey);
				return;
			}
		}

		c.owner = this.owner;
		c.zone = this.zone;
		this.cards.push(c);

		this.refreshPos();
	}

	this.removeCard = function(arg=0) {
		let pos = null;

		if ( (arg instanceof Card) || (arg instanceof Minion) ) {
			pos = arg.pos;
		} else {
			pos = arg;
		}

		if (this.cards.length < pos)
			return null;
		else {
			let c = this.cards.splice(pos, 1)[0];
			this.refreshPos();

			return c;
		}
	}

	this.refreshPos = function() {
		for (let i=0; i < this.cards.length; i++) {
			this.cards[i].pos = i;
		}
	}

}


function loadCatalog(filename) {
	let cards = {};

	var lines = require('fs').readFileSync(filename, 'utf-8').split('\n');
	for (let i in lines) {
		let line = lines[i];
		if (line.trim() == "")
			continue;

		let c = new Card(line);
		cards[c.id] = c;

		loadScripts(c);
	}

	console.log("#" + Object.keys(cards).length +" cards loaded in catalog");
	//console.log(cards);
	return cards;
}


Deck.randomDeck = function(owner) {
	let deck = new Deck(owner, ZoneType.DECK);

	let keyList = Object.keys(Deck.cardCatalog);
	for (let i=0; i < MAX_DECK_SIZE; i++) {
		let k = utils.randomChoice(keyList);
		deck.addCard(k);
	}

	return deck;
}


Deck.testDeck1 = function(owner) {
	let deck = new Deck(owner, ZoneType.DECK);

	let keyList = utils.fillArray(20, 'CS2_189');
	for (let i=0; i < keyList.length; i++) {
		let k = keyList[i];
		deck.addCard(k);
	}

	return deck;
}

/** Test special chars in card name */
Deck.testDeck2 = function(owner) {
	let deck = new Deck(owner, ZoneType.DECK);

	let keyList = utils.fillArray(20, 'CS2_234');
	for (let i=0; i < keyList.length; i++) {
		let k = keyList[i];
		deck.addCard(k);
	}

	return deck;
}


function loadScripts(c) {

	if (! (c.id in cs)) 
		return;

 	console.log("Loading scripts for card [" + c.id + "]");
	var scripts = cs[c.id];
	let handlers = [];

	if ("handlers" in scripts) {
		handlers = handlers.concat(scripts["handlers"]);
	}

	if ("handler" in scripts) {
		handlers.push(scripts["handler"]);
	}

	if ("battlecry" in scripts) {
		//TODO: translate to handler
	}

	c.eventHandlers = handlers;
}


Deck.cardCatalog = loadCatalog("./data/cards.filtered.json");

module.exports.Deck = Deck;
