//code for loading audios

import { qData } from './questionData';

var allaudios = {};
var allimages = {};
var durl = "";

export async function prepareAudios(qsdata, ndurl)  {
	var qd;
	var ad;
	durl = ndurl;
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
	allaudios[audiosource] = newaudio;
}

export async function preloadBucket(){

}

export function getImg(name){
	return allimages[name];
}


export function playAudio(name){
	console.log("trying to play " + name);
	console.log(allaudios[name].src);
	allaudios[name].play();
}
