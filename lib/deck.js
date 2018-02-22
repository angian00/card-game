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

	this.setOwner = function(owner) {
		this.owner = owner;

		for (let i=0; i < this.cards.length; i++) {
			this.cards[i].owner = owner;
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
module.exports = Deck;