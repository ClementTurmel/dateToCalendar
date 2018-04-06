/*
Based on https://github.com/wanasit/chrono 
*/

console.log("dateToCalendar imported");

//todo appel à l'api calendrier
function addEventDate(id){
	//console.log(id);

	var element = dateMap.get(id);

	var start = element.start.date();
	 var end;
	 if(element.end != null){
	 	end = element.end.date();
	 }

	console.log(start + " --- " + end); 
}


//permet d'inserer une chaine de caractère à un index donné
String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


//liste de mots exclus, pour ne pas générer des boutons à ces mots seuls 
var excludedWordsDate=["hier","demain","lun","mar","mer","jeu","ven","sam","dim",
					   "yesterday","tomorrow","mon","tue","wed","fri","sat","sun",
					   "january","february","march","april","may","june","july","august","september","october","november","december",
					   "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

var dateMap = new Map();

//nombre de caractère ajouter au body pour gérer le décalage de l'index
var nbNcharAdded = 0;

$( document ).ready(function() {
    
    console.log( "document ready!" );
    
    //récupération du body
    var body = $("body").html();

	//récupération des dates du body
	var results = chrono.parse(body);


	//pour chacune des dates
	results.forEach(function(element, index) {

		 //si la date n'est pas un mot parmis la liste des exclusions
		 if(!excludedWordsDate.includes(element.text.toLowerCase().trim())){

		 	console.log("texte :" + element.text);

		 	//ajout dans la map clé/valeur
		 	dateMap.set(index,element);
		 
			//création du bouton avec identifiant
			var btn = "<input type='button' value='add' onclick='addEventDate("+ index +")'/>";
			 
			//ajout du bouton au body, juste après la date trouvée
			body = body.splice(element.index + element.text.length +  nbNcharAdded, 0, btn);

			//incrémentation du nombre de caractère pour l'index
			nbNcharAdded = nbNcharAdded + btn.length;
		 }
	 
	});

	//reécritude du body 
	$("body").html(body);

});





