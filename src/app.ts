/**
 * App class that represents an entry point of the application.
 */
import { getAppType, getUUID } from './components/urlUtils';
import { Survey } from './survey/survey';
import { UnityBridge } from './components/unityBridge'
import { setUuid, sendInit} from './components/analyticsEvents'


export class App {

    /** Could be 'assessment' or 'survey' based on the URL structure */
    private appType;

		public unity;

    constructor(){
				this.unity = new UnityBridge();
				this.unity.sendLoaded();
        console.log("Initializing app...");
        this.appType = getAppType();
        console.log(this.appType);
        // TODO: make separate UI controllers for survey and assessment

				setUuid(getUUID());
				sendInit();
				const surv = new Survey();
        surv.run(this);
    }
}


const app = new App();
