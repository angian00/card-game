'use strict';

const fs = require("fs");
const csv = require("csv");
const readline = require('readline');



function loadCsvTemplates(filename, callback) {
	let templates = {};
	fs.createReadStream(filename)
		.pipe(csv.parse())
		.pipe(csv.transform(function(row) {
			//skip comment lines
			if (row[0].startsWith("#"))
				return;

			var c = CardTemplate.fromArray(row);
			//console.log("c: " + c);
			templates[c.name] = c;
	  	}))
	  	.on('finish', function() { callback(templates) });
}


function loadJsonTemplates(filename, callback) {
	let templates = {};

	readline.createInterface({
		input: fs.createReadStream(filename)
	}).on('line', (line) => {
		let c = CardTemplate.fromJson(line);
		//console.log("c: " + c);
		templates[c.name] = c;
	}).on('close', function() { callback(templates) });
}


function loadDeck(filename, templates, callback) {
	let deck = [];
	fs.createReadStream(filename)
		.pipe(csv.parse())
		.pipe(csv.transform(function(row) {
			//skip comment lines
			if (row[0].startsWith("#"))
				return;

			let cName = row[0];
			let count = parseInt(row[1]);
			if (!(cName in templates)) {
				console.warn("!! Unknown card:" + cName);
				return;
			}

			for (let i=0; i< count; i++) {
				deck.push(templates[cName]);
			}
		}))
		.on('finish', function() { 
			shuffleArray(deck);
			callback(deck);
		});
}

function randomDeck(templates, callback) {
	let deck = [];

	let keyList = Object.keys(templates);
	for (let i=0; i < MAX_DECK_SIZE; i++) {
		let k = randomChoice(keyList);
		deck.push(templates[k]);
	}

	callback(deck);
}

