import { qData, answerData } from './questionData';



const landingCont = document.getElementById("landWrap");
const gameCont = document.getElementById("gameWrap");
const endCont = document.getElementById("endWrap");

const qT = document.getElementById("qWrap");
const fT = document.getElementById("feedbackWrap");

const b1 = document.getElementById("answerButton1");
const b2 = document.getElementById("answerButton2");
const b3 = document.getElementById("answerButton3");
const b4 = document.getElementById("answerButton4");
const b5 = document.getElementById("answerButton5");
const b6 = document.getElementById("answerButton6");


const buttons = [b1, b2, b3, b4, b5, b6];
var bCallback: Function;
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

//function to display a new question
export function showQuestion(newQ: qData): void {
	let qCode = "";

	if ('promptImg' in newQ) {
		qCode += "<img src='" + newQ.promptImg + "'></img><BR>";
	}
	qCode += newQ.promptText;

	qT.innerHTML = qCode;

	if (newQ.answers.length <= 4){
	b5.style.display = "none";
	b6.style.display = "none";
	}
	if (newQ.answers.length == 5){
		b5.style.display = "block";
		b6.style.display = "nones";
	}
	if (newQ.answers.length == 6){
		b5.style.display = "block";
		b6.style.display = "block";
	}

	//showing the answers on each button
	for (var aNum in newQ.answers) {
		let curAnswer = newQ.answers[aNum];
		let answerCode = "";
		if ('answerText' in curAnswer) {
			answerCode += curAnswer.answerText;
		}
		if ('answerImg' in curAnswer) {
			answerCode += "<BR><img src='" + curAnswer.answerImg + "'></img>";
		}
		buttons[aNum].innerHTML = answerCode;
	}
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

		buttonsActive = false;
	} else {
		fT.classList.remove("visible");
		fT.classList.add("hidden");

		buttonsActive = true;
	}
}

//handle button press
export function setButtonAction(callback: Function): void {
	bCallback = callback;
}

function buttonPress(num: number) {
	if (buttonsActive) {
		bCallback(num);
	}
}
