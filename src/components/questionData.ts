// this is where we can define the format of the data for a
// question, the correct answer, and the foil answers

export type qData = {
	qName: string; //for analytics event
	promptText: string; //for display
	promptImg?: string;
	promptAudio?: string;
	answers: answerData[];
	correct?: string;
}

export type answerData = {
	answerName: string; //for analytics event
	answerText?: string; //for display
	answerImg?: string;
}
