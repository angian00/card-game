
/** Remove private information **/
module.exports.sanitize = function (gameStatus) {
	//shortcut for deep copy
	let gNew = JSON.parse(JSON.stringify(gameStatus));

	//remove sensitive data
	delete gNew.players;
	gNew.currPlayer.deckSize = gNew.currPlayer.deck.length;
	delete gNew.currPlayer.deck;
	gNew.otherPlayer.deckSize = gNew.otherPlayer.deck.length;
	delete gNew.otherPlayer.deck;
	gNew.otherPlayer.handSize = gNew.otherPlayer.hand.length;
	delete gNew.otherPlayer.hand;

	return gNew;
}


module.exports.randomChoice = function(choices) {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

module.exports.shuffleArray = function(arr) {
	//as per https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

