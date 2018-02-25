

function Card(jsonStr) {
	let jsonObj = JSON.parse(jsonStr);

	this.id = jsonObj.id;
	this.type = jsonObj.type;
	this.name = jsonObj.name;
	this.cost = jsonObj.cost;
	this.attack = jsonObj.attack;
	this.maxHealth = jsonObj.health;
	this.text = textCleanup(jsonObj.text);

	this.mechanics = jsonObj.mechanics;
	this.playRequirements = jsonObj.playRequirements;

	this.owner = null;
	this.zone = null;


	this.hasMechanics = function(mm) {
		return ( (this.mechanics != null) && (this.mechanics.includes(mm)) );
	}


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

	{
		Object.assign(this, card);

		this.health = this.maxHealth;
		if (this.hasMechanics(Mechanics.WINDFURY)) {
			this.numMaxAttacks = 2;
		} else {
			this.numMaxAttacks = 1;
		}

		if (this.hasMechanics(Mechanics.CHARGE)) {
			this.numRemAttacks = this.numMaxAttacks;
		} else {
			// summoning weakness
			this.numRemAttacks = 0;
		}
	}


	this.resetAttacks = function() {
		if (this.isFrozen) {
			delete this.isFrozen;
		} else {
			this.numRemAttacks = this.numMaxAttacks;
		}
	}

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
			numRemAttacks: this.numRemAttacks		};
	}
}




module.exports.Card = Card
module.exports.Minion = Minion
