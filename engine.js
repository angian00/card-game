'use strict';

var fs = require("fs");
var csv = require("csv");


//var MAX_HEALTH = 10;
var MAX_HEALTH = 30;
var MAX_MANA = 10;
var MAX_DECK_SIZE = 30;
var START_HAND_SIZE = 3;

var STATUS_FINISHED = "Game finished";


var g = new GameStatus();
loadTemplates("data/card_templates.csv", function(templates) {
	//console.log(templates);	
	loadDeck("data/sample_deck.csv", templates, function(deck) {
		g.players[0].deck = deck;
		firstRound();
	});

	randomDeck(templates, function(deck) {
		g.players[1].deck = deck;
		firstRound();
	});
});


function firstRound() {
	if (g.players[0].deck.length > 0 && g.players[1].deck.length > 0) {
		for (let i=0; i < START_HAND_SIZE; i++) {
			g.drawCard(g.players[0]);
			g.drawCard(g.players[1]);
		}			

		g.nextRound();
	}
}


function GameStatus() {
	this.startTime = Date.now();
	this.players = [new Player("Player 1"), new Player("Computer")];
	this.currPlayer = this.players[0];
	this.otherPlayer = this.players[1];
	this.winner = null;
	this.nRound = 0;


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
			return { "winner": this.winner.name, "reason": "No more cards" };
		}
		
		let c = p.deck.shift();
		p.hand.push(c);

		return { "new_card": c.name };
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
			res = this.playCardRandom();
			//res = this.attackRandom();
		}

		return res;
	}

	this.playCard = function(index) {
		if (index < 0 || index >= this.currPlayer.hand.length)
			return null;

		let c = this.currPlayer.hand[index];

		if (c.cost > this.currPlayer.mana) {
			console.log("WARNING: cannot play card [" + c.name
				+ "], cost " + c.cost + " > mana " + this.currPlayer.mana);
			return null;
		}

		this.currPlayer.hand.splice(index, 1);
		this.currPlayer.board.push(new Minion(c));
		this.currPlayer.mana = this.currPlayer.mana - c.cost;
		return { "playedCard": c.name };
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
		if (attacker.hasAttacked)
			return null;

		//TODO: consider attacking the otherPlayer
		if (targetIndex < 0 || targetIndex >= this.otherPlayer.board.length)
			return null;

		console.log("attacking: " + attIndex + "-->" + targetIndex);
		let target = this.otherPlayer.board[targetIndex];

		if ("attack" in target) {
			var newAttHealth = attacker.health - target.attack;
			if (newAttHealth <= 0) {
				console.log("removing attacker " + attacker.name + " from " + this.currPlayer);
				this.currPlayer.board.splice(attIndex, 1);
			} else {
				attacker.health = newAttHealth;
			}
		}

		var newTargetHealth = target.health - attacker.attack;
		if (newTargetHealth <= 0) {
			if (target instanceof Player) {
				this.winner = this.currPlayer;
				return {"winner": this.winner.name, "reason": "killed enemy"};
			} else {
				console.log("removing target " + target + " from " + this.otherPlayer);
				this.otherPlayer.board.splice(targetIndex, 1);
			}
		} else {
			target.health = newTargetHealth;
		}

		attacker.hasAttacked = true;

		return { "attacker": attacker.name, "target": target.name };
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


function Player(name) {
	this.name = name;
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



function loadTemplates(filename, callback) {
	let templates = {};
	fs.createReadStream(filename)
		.pipe(csv.parse())
		.pipe(csv.transform(function(row) {
			//skip comment lines
			if (row[0].startsWith("#"))
				return;

			var c = CardTemplate.fromArray(row);
			//console.log("c: " + c);
			templates[c.name] = c;
	  	}))
	  	.on('finish', function() { callback(templates) });
}


function loadDeck(filename, templates, callback) {
	let deck = [];
	fs.createReadStream(filename)
		.pipe(csv.parse())
		.pipe(csv.transform(function(row) {
			//skip comment lines
			if (row[0].startsWith("#"))
				return;

			let cName = row[0];
			let count = parseInt(row[1]);
			if (!(cName in templates)) {
				console.warn("!! Unknown card:" + cName);
				return;
			}

			for (let i=0; i< count; i++) {
				deck.push(templates[cName]);
			}
		}))
		.on('finish', function() { 
			shuffleArray(deck);
			callback(deck);
		});
}

function randomDeck(templates, callback) {
	let deck = [];

	let keyList = Object.keys(templates);
	for (let i=0; i < MAX_DECK_SIZE; i++) {
		let k = randomChoice(keyList);
		deck.push(templates[k]);
	}

	callback(deck);
}


function CardTemplate(name, cost, attack, maxHealth) {
	this.name = name;
	this.cost = cost;
	this.attack = attack;
	this.maxHealth = maxHealth;

	this.toString = function() {
		return this.name + " [" + this.cost + "]: " + this.attack + "/" + this.maxHealth + "";
	}
}

CardTemplate.fromArray = function (arr) {
	return new CardTemplate(arr[0], parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]));
}



function Minion(cardTemplate) {
	this.name = cardTemplate.name;
	this.cost = cardTemplate.cost;
	this.attack = cardTemplate.attack;
	this.maxHealth = cardTemplate.maxHealth;

	this.health = cardTemplate.maxHealth;
	this.hasAttacked = true; //first turn summoning weakness


	this.toString = function() {
		return this.name + ": " + this.attack + " / "
			+ this.health + "(" + this.maxHealth + ") "
			+ (this.hasAttacked ? "*" : " ");
	}
}


function randomChoice(choices) {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function shuffleArray(arr) {
	//as per https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

module.exports.gameStatus = g;
