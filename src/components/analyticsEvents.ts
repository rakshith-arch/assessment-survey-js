// this is where we can have the classes and functions for building the events
// to send to an analytics recorder (firebase? lrs?)

import { qData, answerData } from './questionData';

var uuid: string;

export function setUuid(newUuid: string): void {
	uuid = newUuid;
}

export function sendInit(): void {
	var eventString = "user " + uuid + " opened the assessment"
	console.log(eventString);

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
}

export function sendFinished(): void {
	var eventString = "user " + uuid + " finished the assessment"
	console.log(eventString);
}
