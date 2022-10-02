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
		public questionNum: number;


		constructor (durl: string){
			super();
			this.dataURL = durl;
			this.questionNum = 0;
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

				var opts = [targetItem, foil1, foil2, foil3];
				shuffleArray(opts);


				var res = {qName: "question" + this.questionNum + "-" + targetItem.itemName,
				promptText: targetItem.itemText,
				answers: [
					{answerName:opts[0].itemName,
					answerText:opts[0].itemText},
					{answerName:opts[1].itemName,
					answerText:opts[1].itemText},
					{answerName:opts[2].itemName,
					answerText:opts[2].itemText},
					{answerName:opts[3].itemName,
					answerText:opts[3].itemText}
				]
				};
					// // TODO: : build next question from buckets
					// pick target answer from bucket items, add it to used
					// pick three foil options from bucket items
				this.curQ = res;
				this.questionNum += 1;
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
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
