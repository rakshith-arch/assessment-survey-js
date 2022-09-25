//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { showQuestion, showGame, showEnd, setButtonAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered, sendFinished } from '../components/analyticsEvents'
import { App } from '../App';


export class Survey {

	public qList: qData[];
	public qNum: number;
	public aLink: App;


	constructor (){
		console.log("survey initialized");
		this.qNum = 0;
		setButtonAction(this.tryAnswer);

	}


	public run(applink: App): void{

		this.aLink = applink;
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
			this.onEnd();
		}
	}

	public onEnd(){
			sendFinished();
			showEnd();
			this.aLink.unity.sendClose();
	}


	public tryAnswer = (ans: number) => {

			sendAnswered(this.qList[this.qNum], ans)

			setFeedbackVisibile(true);
			setTimeout(() =>{this.onQuestionEnd()}, 2000);
	}




	public buildQuestionList(): qData[]{

 		//hard-coded test data for right now
		var q1: qData = {qName: "q1",promptText: "question 1 text",answers:[
			{answerName:"q1a1",answerText:"answer 1"},
			{answerName:"q1a2",answerText:"answer 2"},
			{answerName:"q1a3",answerText:"answer 3"},
			{answerName:"q1a4",answerText:"answer 4"}
		]};
		var q2: qData = {qName: "q2",promptText: "question 2 text, with an image", promptImg:"img/hill_v01.png",answers:[
			{answerName:"q2a1",answerText:"answer 1"},
			{answerName:"q2a2",answerText:"slightly different answer 2"},
			{answerName:"q2a3",answerText:"completley new answer 3"},
			{answerName:"q2a4",answerText:"answer 4"}
		]};
		var q3: qData = {qName: "q3",promptText: "the last question",answers:[
			{answerName:"q3a1",answerText:"ahhh an image", answerImg:"img/hill_v01.png"},
			{answerName:"q3a2",answerText:"almost done"},
			{answerName:"q3a3",answerText:"yay"},
			{answerName:"q3a4",answerText:"woohoo"}
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
