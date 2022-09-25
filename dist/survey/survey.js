"use strict";
//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const uiController_1 = require("../components/uiController");
const analyticsEvents_1 = require("../components/analyticsEvents");
class Survey {
    constructor() {
        this.onQuestionEnd = () => {
            (0, uiController_1.setFeedbackVisibile)(false);
            this.qNum += 1;
            if (this.hasAnotherQueston()) {
                (0, uiController_1.showQuestion)(this.getNextQuestion());
            }
            else {
                console.log("no questions left");
                (0, uiController_1.showEnd)();
            }
        };
        this.tryAnswer = (ans) => {
            (0, analyticsEvents_1.sendAnswered)(this.qList[this.qNum], ans);
            (0, uiController_1.setFeedbackVisibile)(true);
            setTimeout(() => { this.onQuestionEnd(); }, 2000);
        };
        console.log("survey initialized");
        this.qNum = 0;
        (0, uiController_1.setButtonAction)(this.tryAnswer);
    }
    runSurvey() {
        this.qList = this.buildQuestionList();
        (0, uiController_1.showQuestion)(this.getNextQuestion());
    }
    buildQuestionList() {
        //hard-coded test data for right now
        var q1 = { qName: "q1", promptText: "question 1 text", answers: [
                { answerName: "a1", answerText: "answer 1" },
                { answerName: "a2", answerText: "answer 2" },
                { answerName: "a3", answerText: "answer 3" },
                { answerName: "a4", answerText: "answer 4" }
            ] };
        var q2 = { qName: "q2", promptText: "question 2 text", promptImg: "img/hill_v01.png", answers: [
                { answerName: "a1", answerText: "answer 1" },
                { answerName: "a2", answerText: "slightly different answer 2" },
                { answerName: "a3", answerText: "completley new answer 3" },
                { answerName: "a4", answerText: "answer 4" }
            ] };
        var q3 = { qName: "q3", promptText: "the last question", answers: [
                { answerName: "a1", answerText: "ahhh" },
                { answerName: "a2", answerText: "almost done" },
                { answerName: "a3", answerText: "yay" },
                { answerName: "a4", answerText: "woohoo" }
            ] };
        // TODO: import this from a data.json file instead
        return [q1, q2, q3];
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
        return res;
    }
}
exports.Survey = Survey;
