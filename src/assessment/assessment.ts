//this is where the logic for handling the buckets will go
//
//once we start adding in the assessment functionality
import { addStar, showQuestion, readyForNext, showGame, showEnd, setButtonAction, setStartAction, setFeedbackVisibile } from '../components/uiController';
import { qData, answerData } from '../components/questionData';
import { sendAnswered, sendFinished } from '../components/analyticsEvents'
import { App } from '../App';
import { bucket, bucketItem } from './bucketData';
import { baseQuiz } from '../baseQuiz';
import { fetchAssessmentBuckets } from '../components/jsonUtils';
import { TNode, sortedArrayToBST } from '../components/tNode';
import {randFrom, shuffleArray } from '../components/mathUtils';
import {preloadBucket} from '../components/audioLoader';
enum searchStage {
	BinarySearch,
	LinearSearchUp,
	LinearSearchDown
}

export class Assessment extends baseQuiz {

	public curNode: TNode;
	public curQ: qData;
	public buckets: bucket[];
	public bucketArray: number[];
	public curBucket: bucket;
	public questionNum: number;
	public numBuckets: number;
	public basalBucket: number;
	public ceilingBucket: number;

	constructor(durl: string) {
		super();
		this.dataURL = durl;
		this.questionNum = 0;
		console.log("app initialized");
		setButtonAction(this.tryAnswer);
		setStartAction(this.startAssessment);
	}

	public run(applink: App): void {
		this.aLink = applink;
		this.buildBuckets().then(result => {
			console.log(this.curBucket);

		});
	}

	public startAssessment = () => {
		readyForNext(this.getNextQuestion());
	}

	public buildBuckets = () => {
		var res = fetchAssessmentBuckets(this.aLink.dataURL).then(result => {
			this.buckets = result;
			this.numBuckets = result.length;
			console.log("buckets: " + this.buckets);
			this.bucketArray = Array.from(Array(this.numBuckets), (_, i) => i+1);
			console.log("empty array " +  this.bucketArray)
			var root = sortedArrayToBST(this.buckets, 0, this.numBuckets);
			console.log(root);
			this.basalBucket = this.numBuckets + 1;
			this.ceilingBucket = -1;
			this.curNode = root;
			this.tryMoveBucket(root.data);
		});
		return res;
	}

	public initBucket = (b: bucket) => {
		this.curBucket = b;
		this.curBucket.usedItems = [];
		this.curBucket.numTried = 0;
		this.curBucket.numCorrect = 0;
		this.curBucket.numConsecutiveWrong = 0;
		this.curBucket.tested = true;
	}

	public tryAnswer = (ans: number, elapsed: number) => {

			sendAnswered(this.curQ, ans, elapsed)
			this.curBucket.numTried += 1;
			if (this.curQ.answers[ans-1].answerName == this.curQ.correct){
				this.curBucket.numCorrect += 1;
				this.curBucket.numConsecutiveWrong = 0;
				console.log("answered correctly");
			}else{
				this.curBucket.numConsecutiveWrong += 1;
				console.log("answered incorrectly, " + this.curBucket.numConsecutiveWrong);
			}
			addStar();
			setFeedbackVisibile(true);
			setTimeout(() => { this.onQuestionEnd() }, 2000);
	}

	public onQuestionEnd = () => {

		setFeedbackVisibile(false);
		setTimeout(() => {

			if (this.hasAnotherQueston()) {
				readyForNext(this.getNextQuestion());
			}
			else {
				console.log("no questions left");
				this.onEnd();
			}

		}, 500);

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

		var res = {
			qName: "question" + this.questionNum + "-" + targetItem.itemName,
			promptText: "",
			bucket: this.curBucket.bucketID,
			promptAudio: targetItem.itemName,
			correct: targetItem.itemText,
			answers: [
				{
					answerName: opts[0].itemName,
					answerText: opts[0].itemText
				},
				{
					answerName: opts[1].itemName,
					answerText: opts[1].itemText
				},
				{
					answerName: opts[2].itemName,
					answerText: opts[2].itemText
				},
				{
					answerName: opts[3].itemName,
					answerText: opts[3].itemText
				}
			]
		};

		this.curQ = res;
		this.questionNum += 1;
		return res;
	}

	public tryMoveBucket = (nbucket) => {

		console.log("new  bucket is " + nbucket.bucketID);
		preloadBucket(nbucket, this.aLink.dataURL);
		this.initBucket(nbucket);
	}

	public hasAnotherQueston = () => {
		//// TODO: check buckets, check if done
		var stillMore = true;


		if (this.curBucket.numCorrect >= 4) {
			//passed this bucket
			console.log("passed this bucket " + this.curBucket.bucketID);
			if (this.curBucket.bucketID >= this.numBuckets) {
				//passed highest bucket
				console.log("passed highest bucket");
				stillMore = false;
			}
			else {
				//moved up to next bucket
				console.log("moving up bucket");
				if (this.curNode.right != null){
					//move down to right
					console.log("moving to right node");
					this.curNode = this.curNode.right;
					this.tryMoveBucket(this.curNode.data);
				}else{
					// reached root node!!!!
						console.log("reached root node");
					// do something here
				}

			}
		}
		if (this.curBucket.numConsecutiveWrong >= 2 || this.curBucket.numTried >= 5) {
			//failed this bucket
			console.log("failed this bucket " + this.curBucket.bucketID);
			if (this.curBucket.bucketID < this.basalBucket) {
				//update basal bucket number
				this.basalBucket = this.curBucket.bucketID;
			}
			if (this.curBucket.bucketID <= 1) {
				//failed the lowest bucket
				console.log("failed lowest bucket");
				stillMore = false;
			}
			else {
				console.log("moving down bucket");
				if (this.curNode.left != null){
					//move down to left
					console.log("moving to left node");
					this.curNode = this.curNode.left;
					this.tryMoveBucket(this.curNode.data);
				}else{
					// reached root node!!!!
							console.log("reached root node");
					// do something here
				}
			}
		}

		return stillMore;

	}
}
