//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { showQuestion, showGame, showEnd, setButtonAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered } from '../components/analyticsEvents'



export class Survey {

	public qList: qData[];
	public qNum: number;


	constructor (){
		console.log("survey initialized");
		this.qNum = 0;
		setButtonAction(this.tryAnswer);

	}


	public runSurvey(): void{

		this.qList = this.buildQuestionList();

		showQuestion(this.getNextQuestion());

	}


	public onQuestionEnd = () => {

		setFeedbackVisibile(false);

		this.qNum += 1;
		if (this.hasAnotherQueston()){
			showQuestion(this.getNextQuestion());
		}
		else{
			console.log("no questions left");
			showEnd();
		}
	}


	public tryAnswer = (ans: number) => {

			sendAnswered(this.qList[this.qNum], ans)

			setFeedbackVisibile(true);
			setTimeout(() =>{this.onQuestionEnd()}, 2000);
	}




	public buildQuestionList(): qData[]{

 		//hard-coded test data for right now
		var q1: qData = {qName: "q1",promptText: "question 1 text",answers:[
			{answerName:"a1",answerText:"answer 1"},
			{answerName:"a2",answerText:"answer 2"},
			{answerName:"a3",answerText:"answer 3"},
			{answerName:"a4",answerText:"answer 4"}
		]};
		var q2: qData = {qName: "q2",promptText: "question 2 text", promptImg:"img/hill_v01.png",answers:[
			{answerName:"a1",answerText:"answer 1"},
			{answerName:"a2",answerText:"slightly different answer 2"},
			{answerName:"a3",answerText:"completley new answer 3"},
			{answerName:"a4",answerText:"answer 4"}
		]};
		var q3: qData = {qName: "q3",promptText: "the last question",answers:[
			{answerName:"a1",answerText:"ahhh"},
			{answerName:"a2",answerText:"almost done"},
			{answerName:"a3",answerText:"yay"},
			{answerName:"a4",answerText:"woohoo"}
		]};

		// TODO: import this from a data.json file instead

		return [q1, q2, q3];

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

		return res;
	}

}
