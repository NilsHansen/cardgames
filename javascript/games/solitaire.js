/**
 * Static values
 */
 var cards = [];
 var ctypes = ["hearts","spades","clubs","diamonds"];
 var colors = {"hearts":"red","diamonds":"red","clubs":"black","spades":"black"};
 var played_deck = "blue";
 var endStack = {"hearts":1,"spades":1,"clubs":1,"diamonds":1};
 var endStackR = [];
 
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
			 if(j != col) $("#slot_1_"+col).append("<img src='images/games/deck_"+played_deck+".png' style='position:absolute;top:"+(j*10)+"px;left:0px' alt='' rel='"+act+"' />");
			 else $("#slot_1_"+col).append("<img src='images/games/"+act+".png' style='position:absolute;top:"+(j*10)+"px;left:0px' alt='' rel='"+act+"' class='draggable' />");
		 }
	 }
	 $.each(cards,function(i, v) {
		 var act = cards.pop();
		 $("#slot_0_0").append("<img src='images/games/deck_"+played_deck+".png' alt='' rel='"+act+"' style='position:absolute;top:0;left:0' />");
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
				 if(i == 0 && j >= 3)
					 div_in.addClass("forEndStack");
				 if(i == 1)
					 div_in.addClass("httk");
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
 
 var won = function() {
	 var anz = $(".forEndStack img").length;
	 if(anz == 52) {
		 $("body").css("background-color","#000");
		 $("#gamedesk").fadeOut("slow", function() {
			 $("#gamedesk")
				 .css("background-color","#000")
				 .html('<div style="margin: auto;margin-top:50px;color:#fff;width:960px"><img src="images/games/Hooray.gif" alt="" align="left" style="margin-right:20px" /><h1>Gewonnen!</h1><a href="#" onclick="document.location.reload()">Nochmal?</a></div>')
				 .fadeIn("fast");
		 });
	 }
 }
 
 var playCardFromStack = function() {
	 $(".draggable.ui-draggable").removeClass("ui-draggable").css("z-index",1);
	 $("#slot_0_1 img").css("z-index",1);
	 if($("#slot_0_0 img:first").length != 0)
		 $("#slot_0_1").append($("#slot_0_0 img:first").attr("src","images/games/"+$("#slot_0_0 img:first").attr("rel")+".png").addClass("draggable"));
	 else {
		 $("#slot_0_1 img").attr("src","images/games/deck_"+played_deck+".png").removeClass("draggable");
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
	 
	 $("#slot_0_0").click(function() {
		 playCardFromStack();
	 }).disableSelection();
 
	 $("#gamedesk").on("mouseover",".draggable", function(e) {
		 $(this).draggable({
			 revert: 'invalid',
			 start: function() {
				 $("img").css("z-index",1);
				 $(this).css("z-index",1000);
				 if($(this).parent().attr("id") != "slot_0_1")
					 $(this).nextAll().css({ "opacity":0.3 }).addClass("needsToDrag");
			 },
			 stop: function() {
				 $("img").css("z-index",1);
				 $(this).nextAll().css({ "opacity":1 }).removeClass("needsToDrag");
			 }
		 });
	 });
 
	 $("#gamedesk").on("dblclick", ".draggable", function(event) {
		 var act = $(this).attr("rel");
		 var tmp = act.split("_");
		 if(endStack[tmp[0]] == tmp[1]) {
			 // Start on a new freestack
			 if(tmp[1] == 1) {
				 endStackR.push(tmp[0]);
				 var o = $(".forEndStack:empty:first");
				 o.addClass(tmp[0]);
			 } else {
				 var o = $(".freeCardSlot."+tmp[0]);
			 }
 
			 $(this).prev().attr("src","images/games/"+$(this).prev().attr("rel")+".png").addClass("draggable");
			 o.append($(this));
			 $(this).css({"top":0, "left":0});
 
			 switch(tmp[1]) {
				 case "10":
					 var n = "J";
				 break;
				 case "J":
					 var n = "Q";
				 break;
				 case "Q":
					 var n = "K";
				 break;
				 default:
					 var n = parseInt(tmp[1])+1;
				 break;
			 }
			 endStack[tmp[0]] = n;
		 }
		 won();
		 event.preventDefault();
	 });
 
	 $("#gamedesk img").droppable({
		 accept: function(elem) {
			 var o1 = elem.attr("rel").split("_");
			 var o2 = $(this).attr("rel").split("_");
			 o1[1] = o1[1].replace(/J/,11).replace(/Q/,12).replace(/K/,13);
			 o2[1] = o2[1].replace(/J/,11).replace(/Q/,12).replace(/K/,13);
 
			 // Colors different?
			 if(colors[o1[0]] != colors[o2[0]]) {
				 // Numbers ok?
				 if((o2[1]-o1[1]) == 1) {
					 return true;
				 }
			 }
 
			 return false;
		 },
		 drop: function(event, ui) {
			 var oldTo = ui.draggable.prev();
			 var swTo = $(this).parent("div");
			 var pos = swTo.find("img:last").position();
			 var l = pos.left+"px";
			 var t = (pos.top+20)+"px";
			 ui.draggable.css({"top":t, "left":l});
			 swTo.append(ui.draggable);
			 $(".needsToDrag").each(function() {
				 var pos = swTo.find("img:last").position();
				 var l = pos.left+"px";
				 var t = (pos.top+20)+"px";
				 $(this).css({"top":t, "left":l});
				 swTo.append($(this));
			 });
			 oldTo.attr("src","images/games/"+oldTo.attr("rel")+".png").addClass("draggable").addClass("ui-droppable");
 
			 if(oldTo.parent().hasClass("forEndStack")) {
				 var tmp = ui.draggable.attr("rel").split("_");
				 var n = tmp[1];
				 endStack[tmp[0]] = n;
			 }
			 won();
		 }
	 });
 
	 $("#gamedesk .httk").droppable({
		accept: function(elem) {
			if($(this).is(":empty")) {
				var card = elem.attr("rel").split("_");
				if(card[1] == "K")
					 return true;
			}
 
			return false;
		}, drop: function(event, ui) {
			 var oldTo = ui.draggable.prev();
			 ui.draggable.css({"top":0,"left":0});
			 $(this).append(ui.draggable);
			 var swTo = $(this);
			 $(".needsToDrag").each(function() {
				 var pos = swTo.find("img:last").position();
				 var l = pos.left+"px";
				 var t = (pos.top+20)+"px";
				 $(this).css({"top":t, "left":l});
				 swTo.append($(this));
			 });
			 oldTo.attr("src","images/games/"+oldTo.attr("rel")+".png").addClass("draggable").addClass("ui-droppable");
		 }
	 });
 
	 $("#gamedesk .forEndStack").droppable({
		accept: function(elem) {
			var card = elem.attr("rel").split("_");
			if($(this).is(":empty")) {
				if(card[1] == 1)
					 return true;
			} else {
				var lStockCard = $(this).find("img:last").attr("rel").split("_");
				card[1] = card[1].replace(/J/,11).replace(/Q/,12).replace(/K/,13);
				lStockCard[1] = lStockCard[1].replace(/J/,11).replace(/Q/,12).replace(/K/,13);
				if(lStockCard[0] == card[0] && (card[1]-lStockCard[1]) == 1)
					 return true;
			}
 
			return false;
		}, drop: function(event, ui) {
			 var tmp = $(this).attr("rel").split("_");
			 if(tmp[1] == 1) {
				 endStackR.push(tmp[0]);
				 var o = $(".forEndStack:empty:first");
				 o.addClass(tmp[0]);
			 }
 
			 var oldTo = ui.draggable.parent("div").find("img:last").prev("img");
			 ui.draggable.css({"top":0,"left":0});
			 $(this).append(ui.draggable);
			 oldTo.attr("src","images/games/"+oldTo.attr("rel")+".png").addClass("draggable").addClass("ui-droppable");
 
			 switch(tmp[1]) {
				 case "10":
					 var n = "J";
					 break;
				 case "J":
					 var n = "Q";
					 break;
				 case "Q":
					 var n = "K";
					 break;
				 default:
					 var n = parseInt(tmp[1])+1;
					 break;
			 }
			 endStack[tmp[0]] = n;
			 won();
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