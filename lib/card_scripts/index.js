

var submodules = []
submodules.push(require("./basic_cards.js"));



for (i in submodules) {
	submodule = submodules[i];

	for (funcName in submodule) {
		var func = submodule[funcName];
		module.exports[funcName] = func;
	}
}
