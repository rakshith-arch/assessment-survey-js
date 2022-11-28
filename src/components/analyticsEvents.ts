// this is where we can have the classes and functions for building the events
// to send to an analytics recorder (firebase? lrs?)

import { qData, answerData } from './questionData';
import { logEvent } from 'firebase/analytics';

var uuid: string;

var gana;
var latlong;
var croppedlat, croppedlong;

export function getLocation(){
	console.log("starting to get location");
		fetch(`https://ipinfo.io/json?token=b6268727178610`)
		.then((response) => {
			console.log("got location response");
				if(!response.ok) {
					throw Error(response.statusText);
				}
			return response.json()
		}).then((jsonResponse)  => {
			latlong = jsonResponse.loc;
			sendLocation();

				return {};
		}).catch((err) => {
			console.warn(`location failed to update! encountered error ${err.msg}`);
		});

}


export function linkAnalytics(newgana): void{
	gana = newgana;
}

export function setUuid(newUuid: string): void {
	uuid = newUuid;
}


export function sendInit(): void {
	getLocation();
	var eventString = "user " + uuid + " opened the assessment"

	console.log(eventString);

	logEvent(gana,"opened_event");

}

export function sendLocation(): void{
	var lpieces = latlong.split(",");
	var lat = parseFloat(lpieces[0]).toFixed(2);
	var lon = parseFloat(lpieces[1]).toFixed(1);
	latlong = "";
	lpieces = [];


	var eventString = "user " + uuid + " is at location " + lat + "," + lon;
	console.log(eventString);

	logEvent(gana,"user_location", {
		user: uuid,
		lat: lat,
		lon: lon
	});

}


export function sendAnswered(theQ: qData, theA: number): void {
	var ans = theQ.answers[theA - 1];
	var eventString = "user " + uuid + " ansered " + theQ.qName + " with " + ans.answerName;
	eventString += ", all answers were [";
	var opts = "";
	for (var aNum in theQ.answers) {
		eventString += theQ.answers[aNum].answerName + ",";
		opts += theQ.answers[aNum].answerName + ",";

	}
	eventString += "]";
	console.log(eventString);
	logEvent(gana,"answered_event", {
		user: uuid,
		question_name: theQ.qName,
		selected_answer: ans.answerName,
		options: opts
	});



}

export function sendFinished(): void {
	var eventString = "user " + uuid + " finished the assessment"
	console.log(eventString);
	logEvent(gana,"finished_event");
}
