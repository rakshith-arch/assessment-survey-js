// this is where we can have the classes and functions for building the events
// to send to an analytics recorder (firebase? lrs?)

import { qData, answerData } from './questionData';
import { logEvent } from 'firebase/analytics';


var uuid: string;
var userSource: string;
var clat, clon;
var gana;
var latlong;
var croppedlat, croppedlong;
var city, region, country;
var apptype;

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
			console.log(jsonResponse);
			latlong = jsonResponse.loc;
			city = jsonResponse.city;
			region = jsonResponse.region;
			country = jsonResponse.country;
			sendLocation();

				return {};
		}).catch((err) => {
			console.warn(`location failed to update! encountered error ${err.msg}`);
		});

}


export function linkAnalytics(newgana, dataurl): void{
	gana = newgana;
	apptype = dataurl;
}

export function setUuid(newUuid: string, newUserSource: string): void {
	uuid = newUuid;
	userSource = newUserSource;
}


export function sendInit(): void {
	getLocation();
	var eventString = "user " + uuid + " opened the assessment"

	console.log(eventString);

	logEvent(gana,"opened", {

	});

}

export function sendLocation(): void{
	var lpieces = latlong.split(",");
	var lat = parseFloat(lpieces[0]).toFixed(2);
	var lon = parseFloat(lpieces[1]).toFixed(1);
	clat = lat;
	clon = lon;
	latlong = "";
	lpieces = [];


	var eventString = "user " + uuid + " is at location " + lat + "," + lon;
	console.log(eventString);

	logEvent(gana,"user_location", {
		user: uuid,
		app: apptype,
		lat: lat,
		lon: lon
	});

	logEvent(gana,"initialized", {
		type: "initialized",
		clUserId: uuid,
		userSource: userSource,
		lat: clat,
		lon: clon,
		city: city,
		region: region,
		country: country
	});

}


export function sendAnswered(theQ: qData, theA: number, elapsed: number): void {
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
	logEvent(gana,"answered", {
		type: "answered",
		clUserId: uuid,
		userSource: userSource,
		lat: clat,
		lon: clon,
		city: city,
		region: region,
		country: country,
		app: apptype,
		dt: elapsed,
		question_name: theQ.qName,
		question: theQ.promptText,
		selected_answer: ans.answerName,
		options: opts

	});

}

export function sendFinished(): void {
	var eventString = "user " + uuid + " finished the assessment"
	console.log(eventString);
	logEvent(gana,"completed", {
		type: "completed",
		clUserId: uuid,
		userSource: userSource,
		lat: clat,
		lon: clon,
		city: city,
		region: region,
		country: country
	});
}
