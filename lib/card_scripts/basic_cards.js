'use strict';


module.exports = {
	// Elven Archer
	CS2_189__old: function () {
		this.handleEvent = function (event) {
			if ( (event.source == this) && (event.type == EventType.CARD_PLAYED) ) {
				console.log(this.name + ": Battlecry event triggered!");
				g.hit(event.target, 1);
			}
		}
	},

	CS2_189: {
		handler: {
			trigger: Trigger.BATTLECRY,
			command: Command.HIT,
			arguments: [Selector.USER_CHOICE, 1]
		}
	},

	CS2_189__new: {
		battlecry: {
			action: Command.HIT,
			arguments: []
		}
	},

	// Flesheating Ghoul
	tt_004: function () {
		this.handleEvent = function (event) {
			if ( (event.source.type == CardType.MINION) && (event.type == EventType.DEATH) ) {
				console.log("Event triggered!");
				alterStat(this.attack, x => x+1);
			}
		}
	},

	//Flametongue Totem
	EX1_565: function () {
		this.aura = function (target) {
			if (Math.abs(target.pos - thisCard.pos) == 1) {
				alterStat(target.attack, x => x*2); //alterStat o pushBuff ?
			}
		}
	},

	//Nightblade
	EX1_593: function () {
		this.handleEvent = function (event) {
			if ( (event.source == listener) && (event.type == EventType.CARD_PLAYED) ) {
				console.log("Battlecry event triggered!");
				hit(getOpponent(thisCard), 3);
			}
		}
	},

	//Sap
	EX1_581: function () {
		this.spell = function (target) {
			toHand(target);
		}
	},
}

function alterStat(target, func) {
	target = func(target);
}