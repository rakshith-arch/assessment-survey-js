"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * App class that represents an entry point of the application.
 */
const urlUtils_1 = require("./components/urlUtils");
const uiController_1 = require("./components/uiController");
class App {
    constructor() {
        console.log("Initializing app...");
        this.appType = (0, urlUtils_1.getAppType)(window.location.href);
        console.log(this.appType);
        // TODO: make separate UI controllers for survey and assessment
        (0, uiController_1.showGame)();
    }
}
const app = new App();
