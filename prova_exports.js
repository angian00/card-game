var cs = require("./lib/card_scripts");


Object.assign(global, require("./lib/game-constants"));
console.log(CardType.MINION);


//var aGhoul = new cs.tt_004(); //OK
//var aGhoul = new cs["tt_004"](); //OK
var aGhoul = new Card("tt_004", "Flesheating Ghoul");
aGhoul = Object.assign(aGhoul, new cs[aGhoul.id]()); //OK
//console.log(aGhoul);

thisCard = aGhoul;

e = new GameEvent();
aGhoul.listener(e);


function GameEvent() {
	this.source = { "type": "MINION" };
	this.type = "DEATH";
}

function Card(idStr, name) {
	this.id = idStr;
	this.name = name;
}

