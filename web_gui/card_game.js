"use strict";

var selected = null;


$(document).ready(function() {
    $("#togglePaletteButton").click(function() {
    	$("#commandPalette").toggleClass("hidden");
    	$("#togglePaletteButton .fa").toggleClass("fa-eye fa-eye-slash");
    });

   	$("#nextRoundCommandButton").click(nextRoundCommand);
   	$("#restartGameCommandButton").click(confirmRestartGame);

   	$(".player-status").click(playerClicked);
	$(".gamecard-container").click(containerClicked);

   	$("body").keypress(function(e) {
   		if (String.fromCharCode(e.which) == 'n') {
   			nextRoundCommand();
   			return false;

		} else if (String.fromCharCode(e.which) == 'r') {
   			confirmRestartGame();
   			return true;
   			//return false;

   		} else {
   			return true;
   		}
	});

	requestStatus();
});


function requestStatus() {
	$.get("api/status", updateStatus);
}

function updateStatus(g) {
	console.log("updateStatus");
	console.log(g);

	populateCards("yourHand", g.currPlayer.hand, g.currPlayer.index);
	populateCards("yourBoard", g.currPlayer.board, g.currPlayer.index);
	populateCards("opponentBoard", g.otherPlayer.board, g.otherPlayer.index);

	updatePlayerStatus("yourStatus", g.currPlayer);
	updatePlayerStatus("opponentStatus", g.otherPlayer);

	updateMessage(g.message);

	if (g.winner) {
		if (confirm("Game over: congratulations, " + g.winner.name 
			+ "! \nDo you want to play another game?")) {
			restartGameCommand();
		}
	}
}

function confirmRestartGame() {
	if (confirm("Do you really want to abort current game?")) 
		restartGameCommand();
}


function populateCards(containerId, cards, playerIndex) {
	var target = $("#" + containerId);

	if (target == null) {
		console.error("card container not found: " + containerId);
		return;
	}

	//remove old cards
	target.find(".gamecard").remove();

	for (var i in cards) {
		var c = cards[i];
		//console.log("Adding card: " + c.name + "to #" + containerId);

		var cardDiv = $("<div></div>").addClass("gamecard").addClass("player" + playerIndex);
		cardDiv.append("<img class='gamecard-image' src='card_images/" + cleanUrl(c.name) + ".png'></img>");
		cardDiv.append("<div class='gamecard-title'>" + c.name + "</div>");
		if (c.text == undefined)
			c.text = "&nbsp;";
		
		cardDiv.append("<div class='gamecard-text'>" + c.text + "</div>");
		

		if (c.type == "MINION") {
			cardDiv.append("<div class='gamecard-stat-attack'><i class='fa fa-gavel'></i>" + c.attack 
				+ (c.numRemAttacks == 0 ? "*" : "") + "</div>");
			
			var healthText = "";
			if (c.zone == "BOARD") {
				//healthText = c.health + "/" + c.maxHealth;
				healthText = c.health;
			} else {
				healthText = c.maxHealth;
			}

			var healthDiv = $("<div class='gamecard-stat-health'>" + healthText +
				"<i class='fa fa-heart'></i></div>");
			if (c.type == "MINION" && c.zone == "BOARD") {
				if (c.health < c.maxHealth) {
					healthDiv.addClass("injured");
				} else {
					healthDiv.addClass("healthy");
				}
			}
			cardDiv.append(healthDiv);
		}

		if (c.zone == "HAND") {
			cardDiv.append("<div class='cost-container'>" + 
				"<div class='gamecard-stat-cost'>" + c.cost + "</div></div>");
		}

		cardDiv.click(cardClicked);
		target.append(cardDiv);
	}

	if (cards.length == 0) {
		var cardDiv = $("<div></div>").addClass("gamecard placeholder");
		target.append(cardDiv);
	}

	//move from top to bottom of child list
	var label = target.find(".gamecard-container-label").detach();
	target.append(label);
}

function updatePlayerStatus(statusId, newStatus) {
	var target = $("#" + statusId);

	if (target == null) {
		console.error("status component not found: " + statusId);
		return;
	}

	target.addClass("player" + newStatus.index).removeClass("player" + (3-newStatus.index));

	target.find(".player-name").text(newStatus.name);
	target.find(".player-stat-ncards span").text(newStatus.deckSize);

	var healthDiv = target.find(".player-stat-health");
	healthDiv.find("span").text(newStatus.health + "/" + newStatus.maxHealth);
	if (newStatus.health < newStatus.maxHealth) {
		healthDiv.addClass("injured").removeClass("healthy");
	} else {
		healthDiv.addClass("healthy").removeClass("injured");
	}

	target.find(".player-stat-mana span").text(newStatus.mana + "/" + newStatus.maxMana);
}


function updateMessage(str) {
	if (str == null)
		str = "";

	$("#infoMessage").stop(true, true)
		.text(str)
		.fadeIn(100)
		.fadeOut(3000);
}

function cardClicked() {
	var index = $(this).index();
	var containerId = $(this).parent().attr("id");

	if (selected == null) {
		$(this).addClass("selected");
		selected = {"index": index, "containerId": containerId, "cardDiv": $(this)};
		return false;
	}

	if (selected.containerId == "yourBoard" && containerId == "opponentBoard") {
		attackCommand(selected.index, index);
		clearSelected();
		return false;
	}

	//other combinations have no meaning
	clearSelected();
	return false;
}

function playerClicked() {
	if (selected == null)
		return false;

	if (selected.containerId == "yourBoard") {
		attackCommand(selected.index, -1);
		clearSelected();
		return false;
	}

	//other combinations have no meaning
	clearSelected();
	return false;
}


function containerClicked() {
	var currIndex = $(this).index();
	var currContainerId = $(this).attr("id");

	if (selected == null)
		return false;

	if (currContainerId == "yourHand") {
		clearSelected();
		return false;
	}

	if (selected.containerId == "yourHand" && currContainerId == "yourBoard") {
		playCardCommand(selected.index);
		clearSelected();
		return false;
	}

	if (selected.containerId == "yourBoard") {
		attackCommand(selected.index, -1);
		clearSelected();
		return false;
	}

	//other combinations have no meaning
	clearSelected();
	return false;
}


function nextRoundCommand() {
	sendCommand("nextRound");
}

function restartGameCommand() {
	sendCommand("restartGame", null, false);
	//async problems on engine restart: returned status in not up-to-date
	setTimeout(function() { requestStatus(); }, 500);
}

function playCardCommand(index) {
	sendCommand("playCard", { "cardIndex": index });
}

function attackCommand(attIndex, targetIndex) {
	sendCommand("attack", { "attIndex": attIndex, "targetIndex": targetIndex });
}


function sendCommand(cmd, reqObj, callUpdateStatus=true) {
	var reqBody = (reqObj == null ? "" : JSON.stringify(reqObj));

	console.log("sending command:" + cmd + " " + reqBody);

	$.ajax({
		url: "api/command/" + cmd, 
		data: reqBody, 
		contentType: "application/json",
		type: "POST",
		success: (callUpdateStatus ? updateStatus : null)
	});
}


function clearSelected() {
	selected.cardDiv.removeClass("selected");
	selected = null;
}


function cleanUrl(str) {
	return encodeURI(str.replace(/[\ |\:]/g, "_")).replace(/'/g ,"%27");
}
