//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { showQuestion, showGame, showEnd, setButtonAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';

var qfcb: Function;

export class Survey {

	public qList: qData[];
	public qNum: number;


	constructor (){
		console.log("survey initialized");
		this.qNum = 0;
		setButtonAction(this.tryAnswer);
		qfcb = this.onQuestionEnd;
	}


	public runSurvey(): void{

		this.qList = this.buildQuestionList();
		showGame();
		showQuestion(this.getNextQuestion());


	}


	public onQuestionEnd = () => {

		setFeedbackVisibile(false);
		console.log(this.qNum);

		if (this.hasAnotherQueston()){
			showQuestion(this.getNextQuestion());
		}
		else{
			console.log("no questions left");
			showEnd();
		}
	}


	public tryAnswer(ans: number) : void {
			// TODO:  send info to analytics event builder
			setFeedbackVisibile(true);


			setTimeout(feedbackOver, 2000);
	}




	public buildQuestionList(): qData[]{

		var q1: qData = {qName: "q1",promptText: "question 1 text",answers:[
			{answerName:"a1",answerText:"answer 1"},
			{answerName:"a2",answerText:"answer 2"},
			{answerName:"a3",answerText:"answer 3"},
			{answerName:"a4",answerText:"answer 4"}
		]};
		var q2: qData = {qName: "q2",promptText: "question 2 text",answers:[
			{answerName:"a1",answerText:"answer 1"},
			{answerName:"a2",answerText:"answer 2"},
			{answerName:"a3",answerText:"answer 3"},
			{answerName:"a4",answerText:"answer 4"}
		]};

		return [q1, q2];

	}


	public hasAnotherQueston(): boolean{

		if ((this.qList.length -1) >= this.qNum){
			return true;
		}
		else{
			return false;
		}

	}

	public getNextQuestion(): qData{
		var res = this.qList[this.qNum];
		this.qNum += 1;
		return res;
	}

}

function feedbackOver(): void{
	console.log("fedback over");
	qfcb();
}
