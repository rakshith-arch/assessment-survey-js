import { qData, answerData } from './questionData';
import { playAudio, playDing, playCorrect, getImg} from './audioLoader';
import { randFrom, shuffleArray } from '../components/mathUtils';


const landingCont = document.getElementById("landWrap");
const gameCont = document.getElementById("gameWrap");
const endCont = document.getElementById("endWrap");
const sD = document.getElementById("starWrapper");
const qT = document.getElementById("qWrap");
const pB = document.getElementById("pbutton");
const fT = document.getElementById("feedbackWrap");
const aC = document.getElementById("aWrap");
const b1 = document.getElementById("answerButton1");
const b2 = document.getElementById("answerButton2");
const b3 = document.getElementById("answerButton3");
const b4 = document.getElementById("answerButton4");
const b5 = document.getElementById("answerButton5");
const b6 = document.getElementById("answerButton6");

var nextquest = null;

var qstart;
var allstart;
var shown = false;
var allstars = [];
var qansnum = 0;

for (var xi = 0; xi < 20; xi += 1){
	const newstar = document.createElement("img");
	newstar.src = "img/star.png";
	newstar.id = "star" + xi;
	newstar.classList.add("topstarh");


	sD.appendChild(newstar);
	sD.innerHTML += "";
	if (xi == 9){
		sD.innerHTML += "<br>";
	}
allstars.push(xi)
}

shuffleArray(allstars);


const buttons = [b1, b2, b3, b4, b5, b6];
var bCallback: Function;
var sCallback: Function;
var buttonsActive: boolean = true;



//add button listeners

b1.addEventListener("click", function () {
	buttonPress(1);
});

b2.addEventListener("click", function () {
	buttonPress(2);
});

b3.addEventListener("click", function () {
	buttonPress(3);
});

b4.addEventListener("click", function () {
	buttonPress(4);
});

b5.addEventListener("click", function () {
	buttonPress(5);
});

b6.addEventListener("click", function () {
	buttonPress(6);
});

landingCont.addEventListener("click", function () {
	showGame();
})


export function readyForNext(newQ: qData): void {
	console.log("ready for next!");
	aC.style.display = "none";
	shown = false;
	nextquest = newQ;
	qT.innerHTML = "";
	pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
	var nqb = document.getElementById("nextqButton");
	nqb.addEventListener("click", function (){
		showQuestion();
		
		//playquestionaudio
		playAudio(newQ.promptAudio, showOptions);
	})
}





//function to display a new question

export function showQuestion(newQ?: qData): void {

	pB.innerHTML = "<button id='nextqButton'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 18L15 12L9 6V18Z' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></svg></button>";
	var nqb = document.getElementById("nextqButton");
	nqb.addEventListener("click", function (){
		if ('promptAudio' in newQ){
			playAudio(newQ.promptAudio);
		}
	})

	aC.style.display = "grid";

	let qCode = "";
	qT.innerHTML = "";
	if (typeof(newQ)=='undefined'){
		newQ = nextquest;
	}

	if ('promptImg' in newQ) {
		var tmpimg = getImg(newQ.promptImg);
		qT.appendChild(tmpimg);
	}
	qCode += newQ.promptText;

qCode += "<BR>";

	qT.innerHTML += qCode;


	for (var b in buttons){
		buttons[b].style.display = "none";
	}



}


export function showOptions(): void{
if (!shown){
	var newQ = nextquest;


			if (newQ.answers.length >= 1){
				b1.style.display = "block"
			}
			if (newQ.answers.length >= 2){
				b2.style.display = "block";
			}
			if (newQ.answers.length >= 3){
				b3.style.display = "block";
			}
			if (newQ.answers.length >= 4){
				b4.style.display = "block"
			}
			if (newQ.answers.length >= 5){
				b5.style.display = "block";
			}
			if (newQ.answers.length >= 6){

				b6.style.display = "block";
			}


				//showing the answers on each button
				for (var aNum in newQ.answers) {
					let curAnswer = newQ.answers[aNum];
					let answerCode = "";
					if ('answerText' in curAnswer) {
						answerCode += curAnswer.answerText;
					}
					buttons[aNum].innerHTML = answerCode;
					if ('answerImg' in curAnswer) {
						var tmpimg = getImg(curAnswer.answerImg);
						buttons[aNum].appendChild(tmpimg);
					}

				}

			qstart = Date.now();
}

}

export function setFeedbackText(nt: string): void{
	console.log("feedback text set to " + nt);
	fT.innerHTML = nt;
}

//functions to show/hide the different containers
export function showLanding(): void {
	landingCont.style.display = "block";
	gameCont.style.display = "none";
	endCont.style.display = "none";
}

export function showGame(): void {
	landingCont.style.display = "none";
	gameCont.style.display = "block";
	endCont.style.display = "none";
	allstart = Date.now();
	sCallback();
}

export function showEnd(): void {
	
	landingCont.style.display = "none";
	gameCont.style.display = "none";
	endCont.style.display = "block";
}

export function setFeedbackVisibile(b: boolean) {
	if (b) {
		fT.classList.remove("hidden");
		fT.classList.add("visible");
		playCorrect();

		buttonsActive = false;
	} else {
		fT.classList.remove("visible");
		fT.classList.add("hidden");

		buttonsActive = true;
	}
}

// add a star on question answer

export function addStar(): void {

	var startoshow = document.getElementById("star" + allstars[qansnum]);
	startoshow.classList.add("topstarv");
	startoshow.classList.remove("topstarh");
	qansnum += 1;
}

//handle button press

export function setStartAction(callback: Function): void{
	sCallback = callback;
}


export function setButtonAction(callback: Function): void {
	bCallback = callback;
}

function buttonPress(num: number) {
	if (buttonsActive) {
		playDing();
		var npressed = Date.now();
		var dtime = npressed - qstart;
		console.log("answered in " + dtime)
		bCallback(num, dtime);
	}
}
