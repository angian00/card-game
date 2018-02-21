'use strict';

const fs = require("fs");
const csv = require("csv");
const readline = require("readline");

const utils = require("gc-util");
const cs = require("card_scripts");




function Deck() {
	this.owner = null;
	this.cards = [];

	this.addCard = function(cKey) {
		let c = null;
		if (cKey instanceof Card) {
			c = cKey;
		} else {
			c = Deck.cardCatalog[cKey];
			if (c == undefined || c == null) {
				console.error("Card not found for id: " + cKey);
				return;
			}
		}

		c.owner = this.owner;
		c.zone = ZoneType.DECK;
		this.cards.push(c);
	}

	this.getCard = function() {
		if (this.cards.length == 0)
			return null;
		else
			return this.cards.shift();
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

		//load card scripts
		if (c.id in cs) {
			console.log("Loading scripts for card [" + c.id + "]");
			Object.assign(c, new cs[c.id]());
		}
	}

	console.log("#" + Object.keys(cards).length +" cards loaded in catalog");
	//console.log(cards);
	return cards;
}


Deck.randomDeck = function() {
	let deck = new Deck();

	let keyList = Object.keys(Deck.cardCatalog);
	for (let i=0; i < MAX_DECK_SIZE; i++) {
		let k = utils.randomChoice(keyList);
		deck.addCard(k);
	}

	return deck;
}


Deck.testDeck1 = function() {
	let deck = new Deck();

	let keyList = utils.fillArray(20, 'CS2_189');
	for (let i=0; i < keyList.length; i++) {
		let k = keyList[i];
		deck.addCard(k);
	}

	return deck;
}


Deck.cardCatalog = loadCatalog("./data/cards.filtered.json");
module.exports = Deck;