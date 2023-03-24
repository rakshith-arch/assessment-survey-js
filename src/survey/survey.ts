//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { addStar, showQuestion, readyForNext, showGame, showEnd, setButtonAction, setStartAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered, sendFinished } from '../components/analyticsEvents'
import { App } from '../App';
import { baseQuiz } from '../baseQuiz';
import { fetchSurveyQuestions } from '../components/jsonUtils';
import { prepareAudios, playAudio } from '../components/audioLoader'
export class Survey extends baseQuiz {

	public qList: qData[];
	public qNum: number;

	constructor(durl: string) {
		super();
		this.dataURL = durl;
		console.log("survey initialized");
		this.qNum = 0;
		setButtonAction(this.tryAnswer);
		setStartAction(this.startSurvey);
	}

	public async run(applink: App) {
		this.aLink = applink;
		this.buildQuestionList().then(result => {
			this.qList = result;
			prepareAudios(this.qList, this.aLink.dataURL);

		});
	}

	public startSurvey = () =>{
		readyForNext(this.getNextQuestion());
	}



	public onQuestionEnd = () => {
		setFeedbackVisibile(false);

		this.qNum += 1;
		if (this.hasAnotherQueston()) {
			readyForNext(this.getNextQuestion());
		}
		else {
			console.log("no questions left");
			this.onEnd();
		}
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
