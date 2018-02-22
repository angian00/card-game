function GameEvent(type, source) {
	this.type = type;
	this.source = source;

	this.toString = function() {
		return this.type + " from " + this.source.name;
	}
}


function EventManager() {
	this.queue = [];
	this.listeners = {};

	this.addEvent = function(e) {
		//console.log(e);
		this.queue.push(e);
	}

	this.addListener = function(lKey, lis) {
		this.listeners[lKey] = lis;
	}

	this.removeListener = function(lKey) {
		delete this.listeners[lKey];
	}

	this.processQueue = function() {
		while (this.queue.length > 0) {
			let e = this.queue.shift();

			for (lKey in this.listeners) {
				this.processEventCard(e, this.listeners[lKey]);
			}
		}
	}

	this.processEventCard = function(e, c) {
		let hh = c.eventHandlers;
		if ((hh != undefined) && (hh != null)) {
			console.log("Processing event " + e + " for " + c.name);
			for (let i=0; i < hh.length; i++) {
				let h = hh[i];

				if (!h.trigger(e, c))
					continue;

				console.log("Event handler triggered");

				let aa = [];
				let ss = null;
				let j = 0;
				if (h.arguments != null && h.arguments.length > 0) {
					if (h.arguments[0] instanceof Card) {
						ss = [ Selector.makeForCard(h.arguments[0]) ];
						j++;

					} else if (isSelector(h.arguments[0])) {
						ss = [ h.arguments[0] ];
						j++;

					} else if (h.arguments[0] instanceof Array) {
						ss = h.arguments[0];
						j++;
					}
				}


				while (j < h.arguments.length) {
					aa.push(h.arguments[j]);
					j++;
				}

				if (ss == null) {
					//invoke command without targets
					gameStatus.invokeCommand(h.command, aa);

				} else {
					let tt = [];

					//apply filter selectors to potential targets
					let allChars = gameStatus.getAllCharacters();
					for (let iChar=0; iChar < allChars.length; iChar++) {
						let ch = allChars[iChar];

						let isCharOk = true;
						//if not all filter selectors are ok, exclude this char
						for (let iSel=0; iSel < ss.length-1; iSel++) {
							let s = ss[iSel];
							if (!s(ch)) {
								isCharOk = false;
								break;
							}
						}

						if (isCharOk)
							tt.push(ch);
					}

					//apply final selector to potential targets
					tt = ss[ss.length-1](tt);

					//invoke command towards all targets
					for (let iTarget=0; iTarget < tt.length; iTarget++) {
						let t = tt[iTarget];
						console.log("aa");
						console.log(aa);
						gameStatus.invokeCommand(h.command, t, aa);
					}
				}
			}
		}
	}

}


function Trigger() {}

Trigger.BATTLECRY = function(event, card) {
	console.log("inside BATTLECRY");
	//console.log(card);
	return ( (event.source == card) && 
		(event.type == EventType.CARD_PLAYED) );
}

Trigger.DEATHRATTLE = function(event) {
	return ( (event.source == card) && 
		(event.type == EventType.DEATH) );
}



function Selector() {}

Selector.RANDOM = function(arr) {
	return [ randomChoice(arr) ];
}

Selector.ALL = function(arr) {
	return arr;
}

Selector.USER_CHOICE = function(arr) {
	//TODO: Selector.USER_CHOICE
	return [ gameStatus.otherPlayer ];

	if (arr.includes(userChoice))
		return [ userChoice ];
	else
		return null;
}

Selector.makeForCard = function(c) {
	this.isSelector = true;

	return function(arr) {
		if (arr.includes(c))
			return [ c ];
		else
			return null;
	}
}


function isSelector(obj) {
	//TODO: isSelector
	return (true);
}



module.exports.GameEvent = GameEvent;
module.exports.Trigger = Trigger;
module.exports.Selector = Selector;
module.exports.EventManager = new EventManager();
