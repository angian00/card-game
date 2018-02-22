var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(express.static('web_gui'));
app.use("/card_images", express.static(__dirname + "/card_images"));
app.use(bodyParser.json());


Object.assign(global, require("gc-constants"));
Object.assign(global, require("gc-util"));
Object.assign(global, require("gc-entities"));
Object.assign(global, require("gc-events"));
Object.assign(global, require("gc-engine"));


app.get('/api/status', function (req, res) {
	console.log("Got a GET request for /status");
	//console.log(g);
	return res.json(gameStatus.cloneForOutput());
})


app.post('/api/command/:commandStr', function (req, res) {
	let cmd = req.params.commandStr;
	let cmdOk = false;

	if (cmd == "restartGame") {
		console.log("restartGame command");
		gameStatus.restart();
		cmdOk = true;

	} else if (cmd == "nextRound") {
		console.log("nextRound command");
		gameStatus.nextRound();
		cmdOk = true;

	} else if (cmd == "playCard") {
		console.log("playCard command: " + JSON.stringify(req.body));
		gameStatus.playCard(req.body.cardIndex);
		cmdOk = true;

	} else if (cmd == "attack") {
		console.log("attack command: " + JSON.stringify(req.body));
		gameStatus.attack(req.body.attIndex, req.body.targetIndex);
		cmdOk = true;

	} else {
		console.log("Unknown command: " + cmd);
		// or maybe just 400?
		res.status(404).send("Unknown command: " + cmd);
	}

	if (cmdOk) {
		//console.log("new gameStatus:");
		//console.log(engine.gameStatus);
		return res.json(gameStatus.cloneForOutput());
	}
})



var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Card Game engine app listening at http://%s:%s", host, port);
})

