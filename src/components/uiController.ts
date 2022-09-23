import { qData, answerData } from './questionData';


const landingCont = document.getElementById("landWrap");
const gameCont = document.getElementById("gameWrap");
const endCont = document.getElementById("endWrap");

const b1 = document.getElementById("answerButton1");
const b2 = document.getElementById("answerButton2");
const b3 = document.getElementById("answerButton3");
const b4 = document.getElementById("answerButton4");

const buttons = [b1, b2, b3, b4];


//add button listeners

b1.addEventListener("click", function() {
	buttonPress(1);
});

b2.addEventListener("click", function() {
	buttonPress(2);
});

b3.addEventListener("click", function() {
	buttonPress(3);
});

b4.addEventListener("click", function() {
	buttonPress(4);
});


//function to display a new question
export function showQuestion(newQ: qData): void{


	//// TODO: show the question prompt

		//showing the answers on each button
		for (var aNum in newQ.answers){
			let curAnswer = newQ.answers[aNum];
			let answerCode = "";
			if ('answerText' in curAnswer){
				answerCode += curAnswer.answerText;
			}
			else if ('answerImg' in curAnswer){
				answerCode += "<img src='" + curAnswer.answerImg + "'";
			}
			buttons[aNum].innerHTML = answerCode;
		}

}



//functions to show/hide the different containers

export function showLanding(): void{
	landingCont.style.display = "block";
	gameCont.style.display = "none";
	endCont.style.display = "none";
}

export function showGame(): void{
	landingCont.style.display = "none";
	gameCont.style.display = "block";
	endCont.style.display = "none";
}

export function showEnd(): void{
	landingCont.style.display = "none";
	gameCont.style.display = "none";
	endCont.style.display = "block";
}

//handle button press

function buttonPress(num: number){
	console.log(num);
}
