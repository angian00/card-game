'use strict';



module.exports.MAX_HEALTH = 30;
module.exports.MAX_MANA = 10;
module.exports.MAX_DECK_SIZE = 30;
module.exports.START_HAND_SIZE = 3;



const CardType = new function() {
	this.MINION = "MINION",
	this.SPELL = "SPELL",
	this.HERO = "HERO",
	this.WEAPON = "WEAPON"
}


const EventType = new function() {
	this.CARD_PLAYED = "CARD_PLAYED",
	this.DEATH = "DEATH"
}

const ZoneType = new function() {
	this.DECK = "DECK",
	this.HAND = "HAND",
	this.BOARD = "BOARD"
}

const PlayerId = new function() {
	this.PLAYER1 = "PLAYER1";
	this.PLAYER2 = "PLAYER2";
}


module.exports.CardType = CardType;
module.exports.EventType = EventType;
module.exports.ZoneType = ZoneType;
module.exports.PlayerId = PlayerId;
