/**
 * App class that represents an entry point of the application.
 */
import { getAppType, getUUID } from './components/urlUtils';
import { Survey } from './survey/survey';
import { setUuid, sendInit} from './components/analyticsEvents'


export class App {

    /** Could be 'assessment' or 'survey' based on the URL structure */
    private appType;

    constructor() {
        console.log("Initializing app...");
        this.appType = getAppType();
        console.log(this.appType);
        // TODO: make separate UI controllers for survey and assessment

				setUuid(getUUID());
				sendInit();
				const surv = new Survey();
        surv.runSurvey();
    }
}


const app = new App();
