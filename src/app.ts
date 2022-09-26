/**
 * App class that represents an entry point of the application.
 */
import { getUUID, getDataFile } from './components/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment'
import { UnityBridge } from './components/unityBridge'
import { setUuid, sendInit} from './components/analyticsEvents'
import {baseQuiz } from './baseQuiz';
import {fetchAppType} from './components/jsonUtils';


export class App {

    /** Could be 'assessment' or 'survey' based on the data file */
    private appType;
		public dataURL: string;

		public unity;
		public game: baseQuiz;

    constructor(){
				this.unity = new UnityBridge();
				this.unity.sendLoaded();
        console.log("Initializing app...");
				this.dataURL = getDataFile();
				if (this.dataURL == undefined){
					console.log("default data file");
					this.dataURL = "default";
				}

    }



		public async spinUp(){
			fetchAppType(this.dataURL).then(result => {
				console.log("spinning up");
				console.log (result);
				if (result == "survey"){
					this.game = new Survey(this.dataURL);
				}
				if (result == "assessment"){
					this.game = new Assessment(this.dataURL);
				}
				setUuid(getUUID());
				sendInit();

			 this.game.run(this);

			});

		//	console.log("apptype" + apptype);

      // TODO: extract app type from datafile

		}
}


const app = new App();
app.spinUp();
