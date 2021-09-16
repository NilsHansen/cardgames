/**
 * Static values
 */
var cards = [];
var ctypes = ["hearts","spades","clubs","diamonds"];
var colors = {"hearts":"red","diamonds":"red","clubs":"black","spades":"black"};
var startStack = [];
var played_deck = "red";

/**
 * Functions
 */
var init = function() {
	$.each(ctypes, function(i, v) {
		for(var i=1;i<=10;i++) {
			cards.push(v+"_"+i);
		}
		cards.push(v+"_J");
		cards.push(v+"_Q");
		cards.push(v+"_K");
	});
	cards.shuffle();
	fillCardStacks();
}

var fillCardStacks = function() {	
	// Start filling the stockings
	for(var i=7;i>=1;i--) {
		var col = (i-1);
		for(var j=0;j<=col;j++) {
			var act = cards.pop();
			if(j != col) $("#slot_1_"+col).append("<img src='images/deck_"+played_deck+".png' style='position:absolute;top:"+(j*10)+"px;left:0px' alt='' rel='"+act+"' />");
			else $("#slot_1_"+col).append("<img src='images/"+act+".png' style='position:absolute;top:"+(j*10)+"px;left:0px' alt='' rel='"+act+"' class='draggable' />");
		}
	}
	$.each(cards,function(i, v) {
		var act = cards.pop();
		$("#slot_0_0").append("<img src='images/deck_"+played_deck+".png' alt='' rel='"+act+"' style='position:absolute;top:0;left:0' />");
	});
}

var makeLayout = function() {
	var tmpl = $("<table style='margin:auto;margin-top:50px' />").attr("cellpadding","5");
	for(var i=0;i<2;i++) {
		var tr = $("<tr />");
		for(var j=0;j<7;j++) {
			var td = $("<td />");
			if(!(j==2 && i==0)) {
				var div_in = $("<div />").addClass("freeCardSlot").attr("id","slot_"+i+"_"+j);
				td.append(div_in);
			}
			tr.append(td);
		}
		tmpl.append(tr);
	}
	$("#gamedesk").append(tmpl);
	
	$(".freeCardSlot").css({
		"background-color":"#556B54",
		"border-radius":"5px",
		"position":"relative"
	}).width(72).height(96);
}

var playCardFromStack = function() {
	if($("#slot_0_0 img:first").length != 0)
		$("#slot_0_1").append($("#slot_0_0 img:first").attr("src","images/"+$("#slot_0_0 img:first").attr("rel")+".png").addClass("draggable"));
	else {
		$("#slot_0_1 img").attr("src","images/deck_"+played_deck+".png").removeClass("draggable");
		$("#slot_0_0").append($("#slot_0_1 img"));
	}
}

/**
 * Events
 */
$(document).ready(function() {
	$("#gamedesk").css({
		"background-color":"#577F56"
	});
	makeLayout();
	init();
	
	$("img").css("z-index","1");
	
	$("#slot_0_0").click(function() {
		playCardFromStack();
	}).disableSelection();
	
	$(".draggable").live("mouseover",function() {
		$(this).draggable();
		$(this).css("z-index","100000");
	});
	
	$("img").droppable({
		drop: function(event, ui) {
			console.log($(this).attr("rel"));
		}
	});
});

/**
 * Helper functions
 */
// Shuffle an array
Array.prototype.shuffle = (function () {
	this.sort(function () {
	return (0.5 - Math.random());
	});
});
