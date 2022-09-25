"use strict";
//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const uiController_1 = require("../components/uiController");
var qfcb;
class Survey {
    constructor() {
        this.onQuestionEnd = () => {
            (0, uiController_1.setFeedbackVisibile)(false);
            console.log(this.qNum);
            if (this.hasAnotherQueston()) {
                (0, uiController_1.showQuestion)(this.getNextQuestion());
            }
            else {
                console.log("no questions left");
                (0, uiController_1.showEnd)();
            }
        };
        console.log("survey initialized");
        this.qNum = 0;
        (0, uiController_1.setButtonAction)(this.tryAnswer);
        qfcb = this.onQuestionEnd;
    }
    runSurvey() {
        this.qList = this.buildQuestionList();
        (0, uiController_1.showGame)();
        (0, uiController_1.showQuestion)(this.getNextQuestion());
    }
    tryAnswer(ans) {
        // TODO:  send info to analytics event builder
        (0, uiController_1.setFeedbackVisibile)(true);
        setTimeout(feedbackOver, 2000);
    }
    buildQuestionList() {
        var q1 = { qName: "q1", promptText: "question 1 text", answers: [
                { answerName: "a1", answerText: "answer 1" },
                { answerName: "a2", answerText: "answer 2" },
                { answerName: "a3", answerText: "answer 3" },
                { answerName: "a4", answerText: "answer 4" }
            ] };
        var q2 = { qName: "q2", promptText: "question 2 text", answers: [
                { answerName: "a1", answerText: "answer 1" },
                { answerName: "a2", answerText: "answer 2" },
                { answerName: "a3", answerText: "answer 3" },
                { answerName: "a4", answerText: "answer 4" }
            ] };
        return [q1, q2];
    }
    hasAnotherQueston() {
        if ((this.qList.length - 1) >= this.qNum) {
            return true;
        }
        else {
            return false;
        }
    }
    getNextQuestion() {
        var res = this.qList[this.qNum];
        this.qNum += 1;
        return res;
    }
}
exports.Survey = Survey;
function feedbackOver() {
    console.log("fedback over");
    qfcb();
}
