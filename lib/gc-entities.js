

function Card(jsonStr) {
	let jsonObj = JSON.parse(jsonStr);

	this.id = jsonObj.id;
	this.name = jsonObj.name;
	this.cost = jsonObj.cost;
	this.attack = jsonObj.attack;
	this.maxHealth = jsonObj.health;
	this.text = jsonObj.text;
	this.type = jsonObj.type;

	this.owner = null;
	this.zone = null;

	this.toString = function() {
		return this.id + "-" + this.name + " [" + this.cost + "]: " + this.attack + "/" + this.maxHealth + "";
	}

	this.cloneForOutput = function() {
		return { 
			id: this.id,
			name: this.name,
			cost: this.cost,
			attack: this.attack,
			maxHealth: this.maxHealth,
			text: this.text,
			type: this.type,
			zone: this.zone
		};
	}
}

function Minion(card) {
	Object.assign(this, card);

	this.health = card.maxHealth;
	this.hasAttacked = true; //first turn summoning weakness

	this.toString = function() {
		return this.name + ": " + this.attack + " / "
			+ this.health + "(" + this.maxHealth + ") "
			+ (this.hasAttacked ? "*" : " ");
	}

	this.cloneForOutput = function() {
		return { 
			id: this.id,
			name: this.name,
			cost: this.cost,
			attack: this.attack,
			maxHealth: this.maxHealth,
			text: this.text,
			type: this.type,
			zone: this.zone,

			health: this.health,
			hasAttacked: this.hasAttacked
		};
	}
}




module.exports.Card = Card
module.exports.Minion = Minion
