
const d = require("deck");

const g = new GameStatus();
g.restart();

const em = new EventManager();


function GameStatus() {

	this.restart = function() {
		this.startTime = Date.now();
		this.players = [new Player("Player 1", 1), new Player("Computer", 2)];
		this.currPlayer = this.players[0];
		this.otherPlayer = this.players[1];
		this.winner = null;
		this.nRound = 0;
		this.message = "Welcome!";

		this.players[0].deck = d.testDeck1();
		this.players[0].deck.owner = this.players[0];
		this.players[1].deck = d.randomDeck();
		this.players[1].deck.owner = this.players[1];

		for (let i=0; i < START_HAND_SIZE; i++) {
			this.drawCard(this.players[0]);
			this.drawCard(this.players[1]);
		}

		this.nextRound();
	}


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
		
		let c = p.deck.getCard();
		c.zone = ZoneType.HAND;
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
		m.zone = ZoneType.BOARD;
		m.pos = 0;
		this.currPlayer.board.push(m);
		this.currPlayer.mana = this.currPlayer.mana - c.cost;

		this.message = "card [" + c.name + "] played";

		em.addListener(m.id, m);
		//TODO: GUI to choose target
		em.addEvent(new GameEvent(EventType.CARD_PLAYED, m, this.otherPlayer));
		em.processQueue();
	}

	this.playCardRandom = function() {
   		let h = this.currPlayer.hand;
   		if (h.length == 0) {
   			return null;
   		}

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
		this.addMessage(attacker.name + " attacks " + target.name);

		if ("attack" in target) {
			this.hit(attacker, target.attack);
		}

		this.hit(target, attacker.attack);
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


	this.hit = function(target, attack) {
		var newTargetHealth = target.health - attack;
		target.health = newTargetHealth;

		if (newTargetHealth <= 0) {
			if (target instanceof Player) {
				this.winner = this.currPlayer;
			} else {
				this.dies(target);
			}
		}

	}

	this.dies = function(target) {
		console.log("removing target " + target + " from " + target.owner);
		this.owner.board.splice(target.pos, 1);
		for (let i=0; i < this.owner.board.length; i++) {
			this.owner.board[i].pos = i;
		}

		this.addMessage(target.name + " dies");
	}

	this.cloneForOutput = function() {
		return { 
			startTime: this.startTime,
			winner: this.winner,
			nRound: this.nRound,
			message: this.message,
			currPlayer: this.currPlayer.cloneForOutput(),
			otherPlayer: this.otherPlayer.cloneForOutput(true)
		};
	}

	this.addMessage = function(msg) {
		this.message += " " + msg;
	}
}


function Player(name, index) {
	this.name = name;
	this.index = index;
	this.maxHealth = MAX_HEALTH;
	this.health = this.maxHealth;
	this.maxMana = 0;
	this.mana = this.maxMana;

	this.deck = null;
	this.hand = [];
	this.board = [];

	this.toString = function() {
		return this.name;
	}

	this.cloneForOutput = function(publicFieldsOnly=false) {
		let obj = {
			name: this.name,
			index: this.index,
			health: this.health,
			maxHealth: this.maxHealth,
			mana: this.mana,
			maxMana: this.maxMana,
			board: this.board,
			handSize: this.hand.length,
			deckSize: (this.deck == null ? 0 : this.deck.cards.length)
		};

		if (!publicFieldsOnly) {
			obj.hand = this.hand;
			obj.deck = (this.deck == null ? [] : this.deck.cards);
		}

		return obj;
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
				let thisCard = this.listeners[lKey];
				console.log("Processing event " + e + " with " + thisCard);
				if ((thisCard.handleEvent != undefined) && (thisCard.handleEvent != null)) {
					thisCard.handleEvent(e);
				}
			}
		}
	}
}

module.exports.gameStatus = g;
