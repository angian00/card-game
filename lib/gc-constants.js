'use strict';


const utils = require("gc-util");


module.exports.MAX_HEALTH = 30;
module.exports.MAX_MANA = 10;
module.exports.MAX_DECK_SIZE = 30;
module.exports.START_HAND_SIZE = 3;



module.exports.CardType = new function() {
	this.MINION = "MINION",
	this.SPELL = "SPELL",
	this.HERO = "HERO",
	this.WEAPON = "WEAPON"
}


module.exports.EventType = new function() {
	//this.CARD_PLAYED = "CARD_PLAYED",
	this.SUMMONING = "SUMMONING",
	this.HEALING = "HEALING",
	this.HIT = "HIT",
	this.DEATH = "DEATH",

	this.SPELL = "SPELL"
}

module.exports.ZoneType = new function() {
	this.DECK = "DECK",
	this.HAND = "HAND",
	this.BOARD = "BOARD"
}


// const PlayerId = new function() {
// 	this.PLAYER1 = "PLAYER1";
// 	this.PLAYER2 = "PLAYER2";
// }

module.exports.Command = new function() {
	this.HIT = "HIT",

	this.NONE = "NONE"
}
