// configuration du jeu
var Snake_YCases = 50 // hauteur en cases 
var Snake_XCases = 50; // largeur en cases 
var Snake_Length = 6; // longueur de départ

// globales
var Snake_Case_Width = 15;
var Snake_Case_Height = 15;
var Snake_Width = Snake_Case_Width * Snake_XCases;
var Snake_Height =  Snake_Case_Height * Snake_YCases;
var Snake_Table;
var Snake_Move_X;
var Snake_Move_Y;
var Snake_Direction;
var timer;
var Start_TM;
var score;
var FruitX;
var FruitY;
var Grandi = false;
var ajouter_vitesse = false;
var interval_speed = 100;

// les DIVS
// header
document.write('<div id="HEAD" class="Snake_Header" style="width:'+(Snake_Width-1)+'px;">F2 pour commencer.</div>');
var header = document.getElementById("HEAD");
// jeu
document.write('<div id="SnakeCanvas" class="Snake_Game" style="width:'+Snake_Width+'px;height:'+Snake_Height+'px;"></div>');
var SnakeCanvas = document.getElementById("SnakeCanvas");
// le panneau de contrôle
document.write('<div id="SnakeControles" class="Snake_Controles" style="width:'+(Snake_Width-1)+'px;">'
			   +'<input id="Snake_bouton_jouer" type="button" class="Snake_bouton_jouer" value="nouveau jeu (F2)" onClick="StartGame();">'
			   +'</div>');
var bouton_jouer = document.getElementById("Snake_bouton_jouer");

// Inserer la feuille de style
document.write('<link rel="stylesheet" type="text/css" href="css/style.css" >');

// outil graphique
var jg = new jsGraphics("SnakeCanvas");

// initialisation du jeu
function init() {
	Snake_Table = new Array(Snake_Length);
	Xpos = Math.round(Snake_XCases/2);
	Ypos = Math.round(Snake_YCases/2);
	for (i=0; i<Snake_Table.length; i++) {
		Snake_Table[i] = new Array(2);
		Snake_Table[i][0] = Xpos;
		Snake_Table[i][1] = Ypos;
		Xpos++;
	}
	FruitX = FruitY = - 999999999;
	Snake_Move_X = -1;
	Snake_Move_Y = 0;
	score = 0;
	Snake_Direction = "G";
}

// dessiner l'écran de jeu
function Draw() {
	jg.clear();
	
	// le serpent
	// corp
	
	for (point=1; point<Snake_Table.length; point ++) {
		if (point % 2 == 0)
			jg.setColor("#006600");
		else
			jg.setColor("#FFFFFF");
		x = Snake_Table[point][0] * Snake_Case_Width + 1;
		y = Snake_Table[point][1] * Snake_Case_Height + 1;
		jg.fillRect(x, y, Snake_Case_Width - 2, Snake_Case_Height - 2);
	}
	// tete
	jg.setColor("#FFFFFF");
	x = Snake_Table[0][0] * Snake_Case_Width + 1;
	y = Snake_Table[0][1] * Snake_Case_Height + 1;
	jg.fillEllipse(x, y, Snake_Case_Width - 2, Snake_Case_Height - 2);
	
	// le repas
	jg.setColor("#ff0000");
	x = FruitX * Snake_Case_Width - 1;
	y = FruitY * Snake_Case_Height - 1;
	jg.drawEllipse(x, y, Snake_Case_Width + 1, Snake_Case_Height + 1);

	jg.paint();
}


// avancer le serpent
function Move() {
		DerniereCase = new Array(2);
		DerniereCase[0] = Snake_Table[Snake_Table.length-1][0];
		DerniereCase[1] = Snake_Table[Snake_Table.length-1][1];
		
		for (point=Snake_Table.length-1; point>=1; point--) {
			Snake_Table[point][0] = Snake_Table[point - 1][0];
			Snake_Table[point][1] = Snake_Table[point - 1][1];
		}
		Snake_Table[0][0] = Snake_Table[0][0] + Snake_Move_X;
		Snake_Table[0][1] = Snake_Table[0][1] + Snake_Move_Y;
		
		if (Grandi){// agrandir le tableau du serpent d'une case
			new_table = new Array(Snake_Table.length + 1);
			for (i=0; i<Snake_Table.length; i++) {
				new_table[i]=new Array(2);
				new_table[i] = Snake_Table[i];
			}
			new_table[new_table.length-1] = new Array(2);
			new_table[new_table.length-1] = DerniereCase;
			Snake_Table = new_table;
			Grandi = false;
		}

		if(ajouter_vitesse){
			interval_speed -= 2;
			setVitesse();
			ajouter_vitesse = false;
		}
		
		checkSnake();
		Draw();
		if (Snake_Move_X == 1)
			Snake_Direction = "D";
		if (Snake_Move_X == -1)
			Snake_Direction = "G";
		if (Snake_Move_Y == 1)
			Snake_Direction = "B";
		if (Snake_Move_Y == -1)
			Snake_Direction = "H";
}

// Réception de l'évenement de touche appuyée
function KeyDown(e){
	var keyCode;
	if (document.all) { // internet explorer
		keyCode = event.keyCode;
	}
	else { // autres navigateurs
		keyCode = e.which;
	}
	if (keyCode)
		ActionTouche(keyCode);
}

// diriger le serpent en fonction de la touche appuyée
function ActionTouche(touche) {
	switch (touche) {
		case 40: case 83: // bas
			if (Snake_Direction != "H") {
				Snake_Move_X = 0;
				Snake_Move_Y = 1;
			}
			break;
		case 38: case 90: // haut
			if (Snake_Direction != "B") {
				Snake_Move_X = 0;
				Snake_Move_Y = -1;
			}
			break;
		case 37: case 81: // gauche
			if (Snake_Direction != "D") {
				Snake_Move_X = -1;
				Snake_Move_Y = 0;
			}
			break;
		case 39: case 68: // droite
			if (Snake_Direction != "G") {
				Snake_Move_X = 1;
				Snake_Move_Y = 0;
			} 
			break;
		case 113 : // Nouvelle partie F2
			StartGame();
			break;
		default:
			//alert(touche);
			break;
	}
}

// vitesse du jeu
function setVitesse() {
	timer = setInterval(Move, interval_speed);
}

// vérifier collision ou mange
function checkSnake() {
	result = true;
	
	// vérifier bordure
	Xtete = Snake_Table[0][0];
	Ytete = Snake_Table[0][1];
	if (Xtete <= 0 || Xtete >= Snake_XCases - 1 || Ytete <= 0 || Ytete >= Snake_YCases - 1) {
		result = false;
		GameOver();
	}
	
	// vérifier si le serpent se mort la queue
	xyTete = Xtete + "," + Ytete;
	mort_la_queue = false;
	for (i=1; i<Snake_Table.length; i++) {
		xyPoint = Snake_Table[i][0] + "," + Snake_Table[i][1];
		if (xyTete == xyPoint) {
			mort_la_queue = true;
			GameOver();
			break;
		}
	}
	if (mort_la_queue) {
		result = false;
		GameOver();
	}
	
	// mange un fruit
	if (xyTete == FruitX + "," + FruitY) {
		NouveauRepas(); // générer un nouvel oeuf
		score += 5 * Snake_Speed; // augmenter le score
		header.innerHTML = "SCORE: "+GetStringScore(); // afficher le score
		Grandi = true; // agrandir au prochain move
		ajouter_vitesse = true;
	}
		
	return result;
}

// afficher un message de jeu
function GameMessage(message) {
	header.innerHTML = message;
}

// GAME OVER
function GameOver() {
	
	interval_speed = 100;
	clearInterval(timer);
	GameMessage("<font color='red'>Game Over : "+GetStringScore()+"</font>");
    timer = setInterval(Move, interval_speed);
    StartGame()
}

// remplir le score avec des 0
function GetStringScore() {
	chaine = "";
	for (i=0; i<6 - score.toString().length; i++) {
		chaine += "0";
	}
	chaine += score;
	return chaine;
}

// générer un nouvel oeuf
function NouveauRepas() {
	// laboucle OK sert a empecher qu'un oeuf apparaisse sur le serpent ou contre un bord
	var OK;
	while (!OK) {
		FruitX = Math.round(Math.random() * (Snake_XCases - 1));
		FruitY = Math.round(Math.random() * (Snake_YCases - 1));
		OK = true;
		for (i=0; i<Snake_Table.length; i++) {
			if (FruitX+","+FruitY == Snake_Table[i][0]+","+Snake_Table[i][1])
				OK = false;
		}
		if (FruitX == 0 || FruitX == Snake_XCases - 1 || FruitY == 0 || FruitY == Snake_YCases - 1)
			OK = false;
	}
}

// Démarrer une partie
function StartGame() {
	clearInterval(timer);
	clearTimeout(Start_TM);
	Affiche_Aide = false;
	init();
	NouveauRepas();
	Draw();	
	Snake_Speed = 10;
	GameMessage("Attrapez les oeufs rouges !")
	Start_TM = setTimeout("setVitesse();", 2000);
}


document.onkeydown = KeyDown;