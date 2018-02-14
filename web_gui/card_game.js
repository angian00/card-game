"use strict";

var selected = null;


$(document).ready(function() {
    $("#togglePaletteButton").click(function() {
    	$("#commandPalette").toggleClass("hidden");
    	$("#togglePaletteButton .fa").toggleClass("fa-eye fa-eye-slash");
    });

   	$("#nextRoundcommandButton").click(nextRoundCommand);
	$(".gamecard-container").click(containerClicked);

   	$("body").keypress(function(e) {
   		if (e.key) {
   			nextRoundCommand();
   			return false;
   		} else {
   			return true;
   		}
	});

	$.get("api/status", updateStatus);
});


function updateStatus(g) {
	//populateCards("yourHand", sampleCards);
	populateCards("yourHand", g.players[0].hand);
	populateCards("yourBoard", g.players[0].board);
	populateCards("opponentBoard", g.players[1].board);

	updatePlayerStatus("yourStatus", g.players[0]);
	updatePlayerStatus("opponentStatus", g.players[1]);
}


function populateCards(containerId, cards) {
	var target = $("#" + containerId);

	if (target == null) {
		console.error("card container not found: " + containerId);
		return;
	}

	//remove old cards
	target.find(".gamecard").remove();

	for (var i in cards) {
		var c = cards[i];
		console.log("Adding card: " + c.name + "to #" + containerId);

		var cardDiv = $("<div></div>").addClass("gamecard");
		cardDiv.append("<img class='gamecard-image' src='images/sample_card_image.png'></img>");
		cardDiv.append("<div class='gamecard-title'>" + c.name + "</div>");
		if (c.features == undefined)
			c.features = "&nbsp;";
		
		cardDiv.append("<div class='gamecard-features'>" + c.features + "</div>");
		cardDiv.append("<div class='gamecard-stat-attack'><i class='fa fa-gavel'></i>" + c.attack 
			+ (c.hasAttacked ? "*" : "") + "</div>");
		
		var healthText = "";
		if (c.health == undefined) {
			healthText = c.maxHealth;
		} else {
			healthText = c.health;
		}
		var healthDiv = $("<div class='gamecard-stat-health'>" + healthText +
			"<i class='fa fa-heart'></i></div>");
		if (c.health != undefined) {
			if (c.health < c.maxHealth) {
				healthDiv.addClass("injured");
			} else {
				healthDiv.addClass("healthy");
			}
		}
		cardDiv.append(healthDiv);

		cardDiv.append("<div class='cost-container'>" + 
			"<div class='gamecard-stat-cost'>" + c.cost + "</div></div>");

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

	target.find(".player-name").text(newStatus.name);
	target.find(".player-stat-ncards span").text(newStatus.deck.length);

	var healthDiv = target.find(".player-stat-health");
	healthDiv.find("span").text(newStatus.health + "/" + newStatus.maxHealth);
	if (newStatus.health < newStatus.maxHealth) {
		healthDiv.addClass("injured").removeClass("healthy");
	} else {
		healthDiv.addClass("healthy").removeClass("injured");
	}

	target.find(".player-stat-mana span").text(newStatus.mana + "/" + newStatus.maxMana);


}


function cardClicked() {
	var index = $(this).index();
	var containerId = $(this).parent().attr("id");

	if (selected == null) {
		$(this).addClass("selected");
		selected = {"index": index, "containerId": containerId, "cardDiv": $(this)};
		return false;
	}
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

	if (selected.containerId == "yourBoard" && currContainerId == "opponentBoard") {
		attackCommand(selected.index, currIndex);
		clearSelected();
		return false;
	}

	//other combinations have no meaning
	clearSelected();
	return false;
}


function playCardCommand(index) {
	sendCommand("playCard", { "cardIndex": index });
}

function attackCommand(attIndex, targetIndex) {
	sendCommand("attack", { "attIndex": attIndex, "targetIndex": targetIndex });
}

function nextRoundCommand() {
	sendCommand("nextRound");
}

function sendCommand(cmd, reqObj) {
	$.ajax({
		url: "api/command/" + cmd, 
		data: JSON.stringify(reqObj), 
		contentType: "application/json",
		type: "POST",
		success: updateStatus
	});
}


function clearSelected() {
	selected.cardDiv.removeClass("selected");
	selected = null;
}

