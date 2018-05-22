/* Based on https://github.com/wanasit/chrono  */

//console.log("dateToCalendar imported");

/*$( document ).ready(function() {   
    console.log( "document ready!" );
});*/

injectPopinInDom();

//GLOBAL VARIABLES
var selectedText;
var daysLabelsFr=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var monthLabelsFr=["janvier","fevrier","mars","avril","mai","juin","juillet", "aout", "septembre", "octobre","novembre","décembre"];
//****************

// Workaround without onBeforeShow for Firefox < 60
// https://bugzilla.mozilla.org/show_bug.cgi?id=1215376
// valorisation d'une variable globale lors de la séléction de texte
document.addEventListener("selectionchange", function() {
	selectedText = window.getSelection().toString().trim();
});

//déclenchement lors du relachement du clic 
document.addEventListener("mouseup", function() {
	
	var foundedDates = chrono.fr.parse(selectedText);
	var foundedDates = foundedDates[0]; // seulement la première plage de date est récupérée

	var beginDate = foundedDates.start.date();
	var endDate = null;

	if(foundedDates.end != null){
	 	endDate = foundedDates.end.date();
	}

	//console.log("debut : " + beginDate);
	//console.log("fin : " + endDate);

	if(beginDate != null) {

		var formatedBeginDate = formatDateForGoogleAgenda(beginDate);
		var formatedEndDate;
		var messageToDisplay;

		if(endDate != null){
			var formatedEndDate =  formatDateForGoogleAgenda(endDate);
			messageToDisplay = "du " + formatDateForDisplay(beginDate) + " au " + formatDateForDisplay(endDate);

		}else{
			//si il n'y a pas de date de fin, la date de fin est la date de début (all day event)
			formatedEndDate = formatedBeginDate;
			//la popin de notif ne contient que la date de début
			messageToDisplay = formatDateForDisplay(beginDate);
		}

		redirectUrl = generateAdEventGoogleAgendaUrl(formatedBeginDate , formatedEndDate);

		pop(messageToDisplay , redirectUrl);
	}
});

document.getElementById("btnClosePopinDate").addEventListener("click", function(){
    hidePopup();
});



function pop(value , url) {
	document.getElementById("pop1-date").innerHTML = value; // populate founded date
	document.getElementById("pop1-url-google-calendar").href = url; // populate url to link
	document.getElementById("pop1").style.display='block'; //show popin
	return false;
}

function hidePopup() {
	//console.log("hide popup !");
	document.getElementById("pop1").style.display='none';
	return false;
}

function injectPopinInDom(){
	$("body").append("<div id='pop1' class='element'><button id='btnClosePopinDate'>X</button> | <span id='pop1-date'></span> | <a id='pop1-url-google-calendar' href='#'>ajouter</a></div>");
	hidePopup();
}

function formatDateForDisplay(date){
	var day = date.getDate();
	var year = date.getFullYear();

	return (daysLabelsFr[date.getDay()] + ' ' + day +' ' + monthLabelsFr[date.getMonth()] + ' '  + year);
}

function formatDateForGoogleAgenda(date){
	//20181114T120000Z
	//20140127T224000Z
	var day = date.getDate();
	var monthIndex = date.getMonth() + 1;
	var year = date.getFullYear();
	var hours = date.getHours();
	var mins = date.getMinutes();

	//set day and month on two caracters for URL
	day = twoCharacterNumber(day);
	monthIndex = twoCharacterNumber(monthIndex);

	//TODO gérer heures

	return year +''+ monthIndex +''+ day + 'T'+ '00' +'' + '00' + '00' + 'Z';
}

function generateAdEventGoogleAgendaUrl(startDate, endDate){
	var redirectUrl = "http://www.google.com/calendar/event?";
	redirectUrl = redirectUrl.concat("action=TEMPLATE");
	redirectUrl = redirectUrl.concat("&text=event-title");
	//redirectUrl = redirectUrl.concat("&dates=20140127T224000Z/20140320T221500Z");
	redirectUrl = redirectUrl.concat("&dates="+startDate+"/"+endDate);
	redirectUrl = redirectUrl.concat("&details=description");
	redirectUrl = redirectUrl.concat("&output=xml");

	return redirectUrl;
}

function twoCharacterNumber(number){
	number = number.toString();

	if(number == null || number.length ==0){
		return '00';
	}else if(number.length == 1){
		return '0'+number;
	}else{
		return number;
	}
}




