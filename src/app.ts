/**
 * App class that represents an entry point of the application.
 */
import { getAppType, getUUID, getDataFile } from './components/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment'
import { UnityBridge } from './components/unityBridge'
import { setUuid, sendInit} from './components/analyticsEvents'
import {baseQuiz } from './baseQuiz';


export class App {

    /** Could be 'assessment' or 'survey' based on the data file */
    private appType;
		private dataURL;

		public unity;
		public game: baseQuiz;

    constructor(){
				this.unity = new UnityBridge();
				this.unity.sendLoaded();
        console.log("Initializing app...");
				this.dataURL = getDataFile();
        //this.appType = getAppType();

        // TODO: extract app type from datafile
				if (true){
					this.game = new Survey(this.dataURL);
				}
				else{
					this.game = new Assessment(this.dataURL);
				}
				setUuid(getUUID());
				sendInit();

        this.game.run(this);
    }
}


const app = new App();
