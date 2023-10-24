//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { addStar, showQuestion, readyForNext, showGame, showEnd, setButtonAction, setStartAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered, sendFinished } from '../components/analyticsEvents'
import { App } from '../App';
import { BaseQuiz } from '../baseQuiz';
import { fetchSurveyQuestions } from '../components/jsonUtils';
import { prepareAudios, playAudio } from '../components/audioLoader';
import { UnityBridge } from '../components/unityBridge';

export class Survey extends BaseQuiz {

	public questionsData: qData[];
	public currentQuestionIndex: number;

	constructor(dataURL: string, unityBridge) {
		super();
		console.log("Survey initialized");

		this.dataURL = dataURL;
		this.unityBridge = unityBridge;
		this.currentQuestionIndex = 0;
		setButtonAction(this.TryAnswer);
		setStartAction(this.startSurvey);
	}

	public async Run(app: App) {
		this.app = app;
		this.buildQuestionList().then(result => {
			this.questionsData = result;
			prepareAudios(this.questionsData, this.app.GetDataURL());
			this.unityBridge.SendLoaded();
		});
	}

	public startSurvey = () =>{
		readyForNext(this.getNextQuestion());
	}



	public onQuestionEnd = () => {
		setFeedbackVisibile(false);

		this.currentQuestionIndex += 1;

		setTimeout(() => {
			if (this.HasQuestionsLeft()) {
				readyForNext(this.getNextQuestion());
			} else {
				console.log("There are no questions left.");
				this.onEnd();
			}
		}, 500);
	}


	public tryAnswer = (ans: number, elapsed: number) => {
		sendAnswered(this.qList[this.qNum], ans, elapsed)
		setFeedbackVisibile(true);
		addStar();
		setTimeout(() => { this.onQuestionEnd() }, 2000);
	}

	public buildQuestionList = () => {
		var qs = fetchSurveyQuestions(this.aLink.dataURL);
		return qs;
	}

	public hasAnotherQueston(): boolean {
		if ((this.qList.length - 1) >= this.qNum) {
			return true;
		} else {
			return false;
		}
	}

	public getNextQuestion(): qData {
		var res = this.qList[this.qNum];
		return res;
	}
}
