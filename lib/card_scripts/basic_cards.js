'use strict';



module.exports = {
	// Flesheating Ghoul
	tt_004: function () {
		this.handleEvent = function (event) {
			if ( (event.source.type == CardType.MINION) && (event.type == EventType.DEATH) ) {
				console.log("Event triggered!");
				alterStat(thisCard.attack, x => x+1);
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
			if ( (event.source == listener) && (event.type == EventType.DEATH) ) {
				console.log("Deathrattle event triggered!");
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