//code for loading audios

import { qData } from './questionData';
import { bucket, bucketItem } from '../assessment/bucketData';

var allaudios = {};
var allimages = {};
var durl = "";

var fdbksnd = new Audio();
fdbksnd.src = "audio/Correct.wav";
var correctsnd = new Audio();


export async function prepareAudios(qsdata, ndurl)  {
	var qd;
	var ad;
	durl = ndurl;
	correctsnd.src = "audio/" + durl + "/answer_feedback.wav";
	for (var qn in qsdata){
		qd = qsdata[qn];
		if (qd.promptAudio != null){
			preaudio (qd.promptAudio);

		}
		if (qd.promptImg != null ){
			preimg (qd.promptImg);
		}
		for (var an in qd.answers){
			ad = qd.answers[an];
			if (ad.answerImg != null){
				preimg(ad.answerImg);
			}
		}
	}
	console.log(allaudios);
	console.log(allimages);

}

export async function preimg( newimgurl ){
	console.log("looking for " + newimgurl);
	var imgsrc = newimgurl;
	var newimg = new Image();
	newimg.src = imgsrc;
	allimages[imgsrc] = newimg;
}

export async function preaudio( newaudiourl ){
	console.log("looking for " + newaudiourl);
	var audiosource = newaudiourl;
	var newaudio = new Audio();
	newaudio.src = "audio/" + durl + "/" + audiosource;
	console.log(newaudio.src);
	allaudios[audiosource] = newaudio;
}

export async function preloadBucket(newb: bucket, ndurl){
	durl = ndurl;
	correctsnd.src = "audio/" + durl + "/answer_feedback.wav";
	for (var aa in newb.items){
		var naa = newb.items[aa];
		preaudio(naa.itemName + ".wav");
	}
}




export function getImg(name){
	return allimages[name];
}


export function playAudio(name: string, apcb?: Function){
	console.log("trying to play " + name);
	//console.log(allaudios[name].src);
	if (name.slice(-4)!=".wav"){
		name = name + ".wav";
	}


	if (typeof(apcb)!='undefined'){
		allaudios[name].addEventListener("ended", () => {
			apcb();

		})

	}
	if (name in allaudios){
		allaudios[name].play();
	}

}

export function playDing(){
	fdbksnd.play();
}

export function playCorrect(){
	correctsnd.play();
}
