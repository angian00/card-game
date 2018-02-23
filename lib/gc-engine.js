
const g = new GameStatus();
g.restart();



function GameStatus() {

	this.restart = function() {
		this.startTime = Date.now();
		this.players = [new Player("Player 1", 1), new Player("Computer", 2)];
		this.currPlayer = this.players[0];
		this.otherPlayer = this.players[1];
		this.winner = null;
		this.nRound = 0;
		this.message = "Welcome!";

		this.players[0].deck = Deck.testDeck1(this);
		//this.players[0].deck = Deck.testDeck2(this);
		this.players[1].deck = Deck.randomDeck(this);

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
		
		let c = p.deck.removeCard();
		p.hand.addCard(c);
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

		for (let i in p.board.cards) {
			p.board.cards[i].hasAttacked = false;
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

		let c = this.currPlayer.hand.cards[index];

		if (c.cost > this.currPlayer.mana) {
			this.message = "cannot play card [" + c.name
				+ "], cost " + c.cost + " > mana " + this.currPlayer.mana;

			return;
		}

		this.currPlayer.hand.removeCard(index);
		this.currPlayer.mana = this.currPlayer.mana - c.cost;
		this.message = "card [" + c.name + "] played";

		if (c.type == CardType.MINION) {
			var m = new Minion(c);
			this.currPlayer.board.addCard(m);

			eventManager.addListener(m.id, m);
			//TODO: GUI to choose target
			eventManager.addEvent(new GameEvent(EventType.SUMMONING, m));

		} else if (c.type == CardType.SPELL) {
			//TODO: process spell
			eventManager.addEvent(new GameEvent(EventType.SPELL, c));
		}

		eventManager.processQueue();
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
		if (attIndex < 0 || attIndex >= this.currPlayer.board.cards.length)
			return null;

		let attacker = this.currPlayer.board.cards[attIndex];
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
			target = this.otherPlayer.board.cards[targetIndex];
		}

		this.message = "";
		console.log("attacking: " + attacker.name + "-->" + target.name);
		this.addMessage(attacker.name + " attacks " + target.name);

		if ("attack" in target) {
			this.hit(attacker, target.attack);
		}

		this.hit(target, attacker.attack);
		attacker.hasAttacked = true;
	}


	this.attackRandom = function() {
		if (this.currPlayer.board.cards.length == 0) {
			return null;
		}

		var bb = this.currPlayer.board.cards;
		var attackerIndex = bb[Math.floor(Math.random() * bb.length)];
		
		bb = this.otherPlayer.board.cards;
		var targetIndex = bb[Math.floor(Math.random() * bb.length)];

		return this.attack(attIndex, targetIndex);
	}


	this.hit = function(target, points) {
		console.log("hit: " + target.name + "(" + points + ")");
		let newTargetHealth = target.health - points;
		target.health = newTargetHealth;

		if (newTargetHealth <= 0) {
			if (target instanceof Player) {
				this.winner = this.currPlayer;
			} else {
				this.die(target);
			}
		}

	}

	this.die = function(target) {
		console.log("removing target " + target + " from " + target.owner);
		target.owner.board.removeCard(target.pos);

		this.addMessage(target.name + " dies");
	}

	this.heal = function(target, points) {
		if (target.health == target.maxHealth)
			return;

		console.log("heal: " + target.name + "(" + points + ")");
		target.health = Math.min(target.health + points, target.maxHealth);

		eventManager.addEvent(new GameEvent(EventType.HEALING, target));
	}

	this.giveHealth = function(target, points) {
		console.log("giveHealth: " + target.name + "(" + points + ")");

		target.health = target.health + points;
		if (target.maxHealth < target.health)
			target.maxHealth = target.health;

		eventManager.addEvent(new GameEvent(EventType.HEALING, target));
	}

	this.discard = function(target) {
		console.log("discard: " + target);

		target.owner.hand.removeCard(target);

		//eventManager.addEvent(new GameEvent(EventType.HEALING, target));
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

	this.invokeCommand = function() {
		if (arguments.length == 0) {
			console.error("Called invokeCommand without a command");
			return;
		}

		let cmdStr = arguments[0];
		console.info("Invoking command: " + cmdStr);

		//flatten arguments
		let args = [];
		if (arguments.length >= 2) {
			if (arguments[1] instanceof Array)
				args = args.concat(arguments[1]);
			else
				args.push(arguments[1]);
		}

		if	(arguments.length >= 3) {
			args = args.concat(arguments[2]);
		}


		//invoke command, finally!
		if (cmdStr == Command.HIT) {
			this.hit(args[0], args[1]);
		}
	}

	
	this.getAllCharacters = function() {
		let res = [];

		res = this.otherPlayer.board.cards.concat(this.currPlayer.board.cards);
		res.push(this.currPlayer);
		res.push(this.otherPlayer);

		return res;
	}
}


function Player(name, index) {
	this.name = name;
	this.index = index;
	this.maxHealth = MAX_HEALTH;
	this.health = this.maxHealth;
	this.maxMana = 0;
	this.mana = this.maxMana;

	this.deck = new Deck(this, ZoneType.DECK);
	this.hand = new Deck(this, ZoneType.HAND);
	this.board = new Deck(this, ZoneType.BOARD);

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
			handSize: this.hand.cards.length,
			deckSize: this.deck.cards.length,
			board: [],
			hand: [],
			deck: []
		};

		for (let i=0; i < this.board.cards.length; i++) {
			obj.board.push(this.board.cards[i].cloneForOutput());
		}
		

		if (!publicFieldsOnly) {
			for (let i=0; i < this.hand.cards.length; i++) {
				obj.hand.push(this.hand.cards[i].cloneForOutput());
			}
		}

		return obj;
	}
}


module.exports.gameStatus = g;
