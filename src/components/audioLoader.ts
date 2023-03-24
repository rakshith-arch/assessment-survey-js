//code for loading audios

import { qData } from './questionData';

var allaudios = {};
var allimages = {};

export async function prepareAudios(qsdata, durl)  {
	var qd;
	var ad;
	for (var qn in qsdata){
		qd = qsdata[qn];
		if (qd.promptAudio != null){
			console.log("looking for " + qd.promptAudio);
			var audiosource = qd.promptAudio;
			var newaudio = new Audio();
			newaudio.src = "audio/" + durl + "/" + audiosource;
			allaudios[audiosource] = newaudio;

		}
		if (qd.promptImg != null ){
			console.log("looking for " + qd.promptImg);
			var imgsrc = qd.promptImg;
			var newimg = new Image();
			newimg.src = imgsrc;
			allimages[imgsrc] = newimg;
		}
		for (var an in qd.answers){
			ad = qd.answers[an];
			if (ad.answerImg != null){
				console.log("looking for " + ad.answerImg);
				var imgsrc = ad.answerImg;
				var newimg = new Image();
				newimg.src = imgsrc;
				allimages[imgsrc] = newimg;
			}
		}
	}
	console.log(allaudios);
	console.log(allimages);

}

export function getImg(name){
	return allimages[name];
}


export function playAudio(name){
	console.log("trying to play " + name);
	console.log(allaudios[name].src);
	allaudios[name].play();
}
