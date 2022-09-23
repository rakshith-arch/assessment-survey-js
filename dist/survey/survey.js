"use strict";
//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const uiController_1 = require("../components/uiController");
class Survey {
    constructor() {
        console.log("survey initialized");
    }
    runSurvey() {
        (0, uiController_1.showGame)();
    }
}
exports.Survey = Survey;
