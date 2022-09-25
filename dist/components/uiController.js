"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setButtonAction = exports.setFeedbackVisibile = exports.showEnd = exports.showGame = exports.showLanding = exports.showQuestion = void 0;
const landingCont = document.getElementById("landWrap");
const gameCont = document.getElementById("gameWrap");
const endCont = document.getElementById("endWrap");
const qT = document.getElementById("qWrap");
const fT = document.getElementById("feedbackWrap");
const b1 = document.getElementById("answerButton1");
const b2 = document.getElementById("answerButton2");
const b3 = document.getElementById("answerButton3");
const b4 = document.getElementById("answerButton4");
const buttons = [b1, b2, b3, b4];
var bCallback;
var buttonsActive = true;
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
landingCont.addEventListener("click", function () {
    showGame();
});
//function to display a new question
function showQuestion(newQ) {
    qT.innerHTML = newQ.promptText;
    //showing the answers on each button
    for (var aNum in newQ.answers) {
        let curAnswer = newQ.answers[aNum];
        let answerCode = "";
        if ('answerText' in curAnswer) {
            answerCode += curAnswer.answerText;
        }
        else if ('answerImg' in curAnswer) {
            answerCode += "<img src='" + curAnswer.answerImg + "'";
        }
        buttons[aNum].innerHTML = answerCode;
    }
}
exports.showQuestion = showQuestion;
//functions to show/hide the different containers
function showLanding() {
    landingCont.style.display = "block";
    gameCont.style.display = "none";
    endCont.style.display = "none";
}
exports.showLanding = showLanding;
function showGame() {
    landingCont.style.display = "none";
    gameCont.style.display = "block";
    endCont.style.display = "none";
}
exports.showGame = showGame;
function showEnd() {
    landingCont.style.display = "none";
    gameCont.style.display = "none";
    endCont.style.display = "block";
}
exports.showEnd = showEnd;
function setFeedbackVisibile(b) {
    if (b) {
        fT.style.visibility = "visible";
        buttonsActive = false;
    }
    else {
        fT.style.visibility = "hidden";
        buttonsActive = true;
    }
}
exports.setFeedbackVisibile = setFeedbackVisibile;
//handle button press
function setButtonAction(callback) {
    bCallback = callback;
}
exports.setButtonAction = setButtonAction;
function buttonPress(num) {
    if (buttonsActive) {
        console.log(num);
        bCallback(num);
    }
}
