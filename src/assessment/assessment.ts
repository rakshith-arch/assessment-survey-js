//this is where the logic for handling the buckets will go
//
//once we start adding in the assessment functionality
import { showQuestion, showGame, showEnd, setButtonAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered, sendFinished } from '../components/analyticsEvents'
import { App } from '../App';
import {bucket, bucketItem} from './bucketData';
import { baseQuiz } from '../baseQuiz';

export class Assessment extends baseQuiz{

		public curQ: qData;
		public buckets: bucket[];
			public aLink: App;

		constructor (durl: string){
			super();
			this.dataURL = durl;
			console.log("app initialized");
			setButtonAction(this.tryAnswer);

		}

		public run(applink: App): void{

					this.aLink = applink;
					this.buckets = this.buildBuckets();
					showQuestion(this.getFirstQuestion());
		}


		public buildBuckets(): bucket[]{
			var res = null;
			return res;
		}


			public tryAnswer = (ans: number) => {

					sendAnswered(this.curQ, ans)

					setFeedbackVisibile(true);
					setTimeout(() =>{this.onQuestionEnd()}, 2000);
			}


			public onQuestionEnd = () => {

				setFeedbackVisibile(false);

				if (this.hasAnotherQueston()){
					showQuestion(this.getNextQuestion());
				}
				else{
					console.log("no questions left");
					this.onEnd();
				}

			}



					public getNextQuestion(): qData{
						var res = null;
							// // TODO: : build next question from buckets
						return res;
					}

					public getFirstQuestion(): qData{
						var res = null;
							// // TODO: : build first question from buckets
						return res;
					}

				public hasAnotherQueston(): boolean{
					//// TODO: check buckets, check if done
					return true;
				}
}
