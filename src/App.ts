/**
 * App class that represents an entry point of the application.
 */

import { getUUID, getDataFile } from './components/urlUtils';
import { Survey } from './survey/survey';
import { Assessment } from './assessment/assessment'
import { UnityBridge } from './components/unityBridge'
import { setUuid, linkAnalytics, sendInit } from './components/analyticsEvents'
import { baseQuiz } from './baseQuiz';
import { fetchAppType } from './components/jsonUtils';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

export class App {

	/** Could be 'assessment' or 'survey' based on the data file */
	private appType;
	public dataURL: string;

	public unity;
	public analytics;
	public game: baseQuiz;

	constructor() {
		this.unity = new UnityBridge();
		this.unity.sendLoaded();
		console.log("Initializing app...");
		this.dataURL = getDataFile();




		const firebaseConfig = {
		  apiKey: "AIzaSyBZod6Ekp6llcLDLykNx3gkMs5lbqzX6kE",
		  authDomain: "assessmentandsurvey.firebaseapp.com",
		  projectId: "assessmentandsurvey",
		  storageBucket: "assessmentandsurvey.appspot.com",
		  messagingSenderId: "826357355718",
		  appId: "1:826357355718:web:18c4128782084eec3c33c7",
		  measurementId: "G-DGTWM534Z4"
		};
		const fapp = initializeApp(firebaseConfig);
		const fanalytics = getAnalytics(fapp);
		this.analytics = fanalytics;
		logEvent(fanalytics, 'notification_received');
		logEvent(fanalytics,"test initialization event",{});
		console.log("firebase initialized");

	}

	public async spinUp() {
		fetchAppType(this.dataURL).then(result => {
			console.log("spinning up");
			console.log(result);
			if (result == "survey") {
				this.game = new Survey(this.dataURL);
			}
			if (result == "assessment") {
				this.game = new Assessment(this.dataURL);
			}
			setUuid(getUUID());
			linkAnalytics(this.analytics);
			sendInit();

			this.game.run(this);
		});
	}
}


const app = new App();
app.spinUp();
