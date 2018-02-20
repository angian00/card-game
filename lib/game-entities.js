

function Card(idStr, name, cost, attack, maxHealth, text) {
	this.id = idStr;
	this.owner = null;
	this.zone = null;

	this.name = name;
	this.cost = cost;
	this.attack = attack;
	this.maxHealth = maxHealth;
	this.text = text;

	this.toString = function() {
		return this.id + "-" + this.name + " [" + this.cost + "]: " + this.attack + "/" + this.maxHealth + "";
	}
}

// Card.fromArray = function (arr) {
// 	return new Card(arr[0], parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]));
// }

Card.fromJson = function (jsonStr) {
	var jsonObj = JSON.parse(jsonStr);
	return new Card(jsonObj.id, jsonObj.name, jsonObj.cost, jsonObj.attack, jsonObj.health, jsonObj.text);
}



function Minion(card) {
	this.name = card.name;
	this.cost = card.cost;
	this.attack = card.attack;
	this.maxHealth = card.maxHealth;
	this.handleEvent = card.handleEvent;

	this.health = card.maxHealth;
	this.hasAttacked = true; //first turn summoning weakness

	this.toString = function() {
		return this.name + ": " + this.attack + " / "
			+ this.health + "(" + this.maxHealth + ") "
			+ (this.hasAttacked ? "*" : " ");
	}
}


function GameEvent(type, source, target) {
	this.type = type;
	this.source = source;
	this.target = target;
}



module.exports.Card = Card
module.exports.Minion = Minion
module.exports.GameEvent = GameEvent
