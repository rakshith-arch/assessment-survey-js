// this is where we can have the classes and functions for building the events
// to send to an analytics recorder (firebase? lrs?)

import { qData, answerData } from './questionData';
import { logEvent } from 'firebase/analytics';

var uuid: string;

var gana;

export function linkAnalytics(newgana): void{
	gana = newgana;
}

export function setUuid(newUuid: string): void {
	uuid = newUuid;
}

export function sendInit(): void {
	var eventString = "user " + uuid + " opened the assessment"
	console.log(eventString);
	logEvent(gana,"opened_event");

}

export function sendAnswered(theQ: qData, theA: number): void {
	var ans = theQ.answers[theA - 1];
	var eventString = "user " + uuid + " ansered " + theQ.qName + " with " + ans.answerName;
	eventString += ", all answers were [";
	for (var aNum in theQ.answers) {
		eventString += theQ.answers[aNum].answerName + ",";
	}
	eventString += "]";
	console.log(eventString);
	logEvent(gana,"answered_event");


}

export function sendFinished(): void {
	var eventString = "user " + uuid + " finished the assessment"
	console.log(eventString);
	logEvent(gana,"finished_event");
}
