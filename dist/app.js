"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
/**
 * App class that represents an entry point of the application.
 */
const urlUtils_1 = require("./components/urlUtils");
const survey_1 = require("./survey/survey");
const analyticsEvents_1 = require("./components/analyticsEvents");
class App {
    constructor() {
        console.log("Initializing app...");
        this.appType = (0, urlUtils_1.getAppType)(window.location.href);
        console.log(this.appType);
        // TODO: make separate UI controllers for survey and assessment
        (0, analyticsEvents_1.setUuid)("testinguuid");
        (0, analyticsEvents_1.sendInit)();
        const surv = new survey_1.Survey();
        surv.runSurvey();
    }
}
exports.App = App;
const app = new App();