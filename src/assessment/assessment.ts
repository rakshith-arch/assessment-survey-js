//this is where the logic for handling the buckets will go
//
//once we start adding in the assessment functionality
import { showQuestion, showGame, showEnd, setButtonAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered, sendFinished } from '../components/analyticsEvents'
import { App } from '../App';
import {bucket, bucketItem} from './bucketData';
import { baseQuiz } from '../baseQuiz';
import {fetchAssessmentBuckets} from '../components/jsonUtils';

export class Assessment extends baseQuiz{

		public curQ: qData;
		public buckets: bucket[];
		public curBucket: bucket;


		constructor (durl: string){
			super();
			this.dataURL = durl;
			console.log("app initialized");
			setButtonAction(this.tryAnswer);

		}

		public run(applink: App): void{

					this.aLink = applink;
					this.buildBuckets().then(result => {
						console.log(this.curBucket);
						showQuestion(this.getNextQuestion());
					});

		}


		public buildBuckets = () => {
			var res = fetchAssessmentBuckets(this.aLink.dataURL).then(result=>{
				this.buckets = result;
				var middle = result[Math.floor(result.length / 2)];
				this.curBucket = middle;

			});
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

			public getNextQuestion = () => {
				var targetItem, foil1, foil2, foil3;
				do {
					targetItem = randFrom(this.curBucket.items);
				} while (this.curBucket.usedItems.includes(targetItem));
				this.curBucket.usedItems.push(targetItem);
				do {
					foil1 = randFrom(this.curBucket.items);
				} while (targetItem == foil1);
				do {
					foil2 = randFrom(this.curBucket.items);
				} while (targetItem == foil2 || foil1 == foil2);
				do {
					foil3 = randFrom(this.curBucket.items);
				} while (targetItem == foil3 || foil1 == foil3 || foil2 == foil3);



				var res = null;
					// // TODO: : build next question from buckets
					// pick target answer from bucket items, add it to used
					// pick three foil options from bucket items
				return res;
			}


		public hasAnotherQueston(): boolean{
			//// TODO: check buckets, check if done
			return true;
		}
}

function randFrom(array){
	return array[Math.floor(Math.random() * array.length)]
}
