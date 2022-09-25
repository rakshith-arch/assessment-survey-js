"use strict";
// this is where we can have the classes and functions for building the events
// to send to an analytics recorder (firebase? lrs?)
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFinished = exports.sendAnswered = exports.sendInit = exports.setUuid = void 0;
var uuid;
function setUuid(newUuid) {
    uuid = newUuid;
}
exports.setUuid = setUuid;
function sendInit() {
    var eventString = "user " + uuid + " opened the assessment";
    console.log(eventString);
}
exports.sendInit = sendInit;
function sendAnswered(theQ, theA) {
    var ans = theQ.answers[theA - 1];
    var eventString = "user " + uuid + " ansered " + theQ.qName + " with " + ans.answerName;
    console.log(eventString);
}
exports.sendAnswered = sendAnswered;
function sendFinished() {
    var eventString = "user " + uuid + " finished the assessment";
}
exports.sendFinished = sendFinished;
