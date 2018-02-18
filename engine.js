

const g = new GameStatus();
const el = new EventListener();


function GameStatus() {

	this.restart = function() {
		this.startTime = Date.now();
		this.players = [new Player("Player 1", 1), new Player("Computer", 2)];
		this.currPlayer = this.players[0];
		this.otherPlayer = this.players[1];
		this.winner = null;
		this.nRound = 0;
		this.message = "Welcome!";

		loadTemplatesSync(this);
		//console.log(this);
	}

	this.restart();


	this.drawCard = function(p) {
		if (p == undefined || p == null) {
			p = this.currPlayer;
		}

		let o = null;
		if (p == this.currPlayer) {
			o = this.otherPlayer;
		} else {
			o = this.currPlayer;
		}

		if (p.deck.length == 0) {
			this.winner = o;
			this.message = "Game over";
			return;
		}
		
		let c = p.deck.shift();
		p.hand.push(c);
	}


	this.nextRound = function() {
		if (this.nRound > 0) {
			//switch players
			if (this.currPlayer == this.players[0]) {
				this.currPlayer  = this.players[1];
				this.otherPlayer = this.players[0];
			} else {
				this.currPlayer  = this.players[0];
				this.otherPlayer = this.players[1];
			}
		}

		let p = this.currPlayer;

		if (p.maxMana < MAX_MANA) {
			p.maxMana = p.maxMana + 1;
		}
		p.mana = p.maxMana;

		for (let i in p.board) {
			p.board[i].hasAttacked = false;
		}

		this.nRound = this.nRound + 1;
		
		let res = this.drawCard()
		
		//DEBUG AI
		if (this.currPlayer.name == "Computer") {
			//res = this.playCardRandom();
			//res = this.attackRandom();
		}

		this.message = "New round";

		return res;
	}

	this.playCard = function(index) {
		if (index < 0 || index >= this.currPlayer.hand.length)
			return;

		let c = this.currPlayer.hand[index];

		if (c.cost > this.currPlayer.mana) {
			this.message = "cannot play card [" + c.name
				+ "], cost " + c.cost + " > mana " + this.currPlayer.mana;

			return;
		}

		this.currPlayer.hand.splice(index, 1);
		var m = new Minion(c);
		this.currPlayer.board.push(m);
		this.currPlayer.mana = this.currPlayer.mana - c.cost;

		this.message = "card [" + c.name + "] played";

		el.addListener(m);
		el.addEvent(new GameEvent(EventType.CARD_PLAYED, m, this.currPlayer.board));
		el.processEvents();
	}

	this.playCardRandom = function() {
   		let h = this.currPlayer.hand;
   		if (h.length == 0) {
   			return null;
   		}

   		//c = h[Math.random.randint(0, len(h)-1)]
   		let randomIndex = Math.floor(Math.random() * h.length);
   		return this.playCard(randomIndex);
	}


	this.attack = function(attIndex, targetIndex) {
		if (attIndex < 0 || attIndex >= this.currPlayer.board.length)
			return null;

		let attacker = this.currPlayer.board[attIndex];
		if (attacker.hasAttacked) {
			this.message = attacker.name + " cannot attack";
			return null;
		}


		if (targetIndex < -1 || targetIndex >= this.otherPlayer.board.length)
			return null;

		let target = null;
		if (targetIndex == -1) {
			target = this.otherPlayer;
		} else {
			target = this.otherPlayer.board[targetIndex];
		}

		console.log("attacking: " + attacker.name + "-->" + target.name);
		this.message = attacker.name + " attacks " + target.name;

		if ("attack" in target) {
			var newAttHealth = attacker.health - target.attack;
			if (newAttHealth <= 0) {
				console.log("removing attacker " + attacker.name + " from " + this.currPlayer);
				this.currPlayer.board.splice(attIndex, 1);
	
				this.message += ", " + attacker.name + " dies";
			} else {
				attacker.health = newAttHealth;
			}
		}

		var newTargetHealth = target.health - attacker.attack;
		if (newTargetHealth <= 0) {
			if (target instanceof Player) {
				this.winner = this.currPlayer;
			} else {
				console.log("removing target " + target + " from " + this.otherPlayer);
				this.otherPlayer.board.splice(targetIndex, 1);
			}
			this.message += ", " + target.name + " dies";

		} else {
			target.health = newTargetHealth;
		}

		attacker.hasAttacked = true;
	}


	this.attackRandom = function() {
		if (this.currPlayer.board.length == 0) {
			return null;
		}

		var b = this.currPlayer.board;
		var attackerIndex = b[Math.floor(Math.random() * b.length)];
		
		b = this.otherPlayer.board;
		var targetIndex = b[Math.floor(Math.random() * b.length)];

		return this.attack(attIndex, targetIndex);
	}
}


function Player(name, index) {
	this.name = name;
	this.index = index;
	this.maxHealth = MAX_HEALTH;
	this.health = this.maxHealth;
	this.maxMana = 0;
	this.mana = this.maxMana;

	this.deck = [];
	this.hand = [];
	this.board = [];

	this.toString = function() {
		return this.name;
	}
}


function loadTemplatesSync(gs) {
	//loadCsvTemplates("data/card_templates.csv", function(templates) {
	loadJsonTemplates("data/cards.filtered.json", function(templates) {
		console.log("loaded templates");

		randomDeck(templates, function(deck) {
			console.log("randomized deck");
			gs.players[0].deck = deck;
			firstRound(gs);
		});

		// loadDeck("data/sample_deck.csv", templates, function(deck) {
		// 	console.log("loaded deck");
		// 	//console.log(deck);
		// 	gs.players[0].deck = deck;
		// 	firstRound(gs);
		// });

		randomDeck(templates, function(deck) {
			console.log("randomized deck");
			gs.players[1].deck = deck;
			firstRound(gs);
		});

		// loadDeck("data/sample_deck.csv", templates, function(deck) {
		// 	console.log("loaded deck");
		// 	gs.players[1].deck = deck;
		// 	firstRound(gs);
		// });
	});


}



function firstRound(g) {
	if (g.players[0].deck.length > 0 && g.players[1].deck.length > 0) {
		for (let i=0; i < START_HAND_SIZE; i++) {
			g.drawCard(g.players[0]);
			g.drawCard(g.players[1]);
		}			

		g.nextRound();
	}
}


function EventManager() {
	this.queue = [];
	this.listeners = {};

	this.addEvent = function(e) {
		console.log(e);
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

			for (lKey in listeners) {
				let listener = listeners[lKey];
				if ((lis.handleEvent != undefined) && (l.handleEvent != null)) {
					listener.handleEvent(e);
				}
		}
	}
}

module.exports.gameStatus = g;
