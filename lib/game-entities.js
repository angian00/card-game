

function CardTemplate(name, cost, attack, maxHealth, text) {
	this.name = name;
	this.cost = cost;
	this.attack = attack;
	this.maxHealth = maxHealth;
	this.text = text;

	this.toString = function() {
		return this.name + " [" + this.cost + "]: " + this.attack + "/" + this.maxHealth + "";
	}
}

CardTemplate.fromArray = function (arr) {
	return new CardTemplate(arr[0], parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]));
}

CardTemplate.fromJson = function (jsonStr) {
	var jsonObj = JSON.parse(jsonStr);
	return new CardTemplate(jsonObj.name, jsonObj.cost, jsonObj.attack, jsonObj.health, jsonObj.text);
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


function GameEvent(type, source, target) {
	this.type = type;
	this.source = source;
	this.target = target;
}

