var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(express.static('web_gui'));
app.use(bodyParser.json());


var engine = require('./engine.js');
var g = engine.gameStatus;


app.get('/api/status', function (req, res) {
	console.log("Got a GET request for /status");
	//console.log("gameStatus:");
	//console.log(engine.gameStatus);
	return res.json(engine.sanitize(g));
})


app.post('/api/command/:commandStr', function (req, res) {
	let cmd = req.params.commandStr;
	let cmdOk = false;

	if (cmd == "restartGame") {
		console.log("restartGame command");
		g.restart();
		cmdOk = true;

	} else if (cmd == "nextRound") {
		console.log("nextRound command");
		g.nextRound();
		cmdOk = true;

	} else if (cmd == "playCard") {
		console.log("playCard command: " + JSON.stringify(req.body));
		g.playCard(req.body.cardIndex);
		cmdOk = true;

	} else if (cmd == "attack") {
		console.log("attack command: " + JSON.stringify(req.body));
		g.attack(req.body.attIndex, req.body.targetIndex);
		cmdOk = true;

	} else {
		console.log("Unknown command: " + cmd);
		// or maybe just 400?
		res.status(404).send("Unknown command: " + cmd);
	}

	if (cmdOk) {
		//console.log("new gameStatus:");
		//console.log(engine.gameStatus);
		return res.json(engine.sanitize(g));
		//res.send(req.params);
	}
})



var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Card Game engine app listening at http://%s:%s", host, port);
})

