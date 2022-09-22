/**
 * App class that represents an entry point of the application.
 */
import { getAppType } from './components/urlUtils';

class App {

    /** Could be 'assessment' or 'survey' based on the URL structure */
    private appType;

    constructor() {
        console.log("Initializing app...");
        this.appType = getAppType(window.location.href);
        console.log(this.appType);
        // TODO: make separate UI controllers for survey and assessment
        showgame();
    }
}

const app = new App();
