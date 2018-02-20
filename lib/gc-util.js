
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


module.exports.fillArray = function(size, elem) {
	return Array.from({length: size}, () => elem);
}

