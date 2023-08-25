//code for loading audios

import { qData } from './questionData';
import { bucket, bucketItem } from '../assessment/bucketData';


var imgtocache = [];
var wavtocache = [];


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
	var fdsnd =  "audio/" + durl + "/answer_feedback.wav";
	wavtocache.push(fdsnd);
	correctsnd.src = fdsnd;


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

export async function preaudio( newAudioURL ){
	console.log("looking for " + newAudioURL);
	let mp3File = newAudioURL + ".mp3";
	let wavFile = newAudioURL + ".wav";
	let newAudio = new Audio();
	// try {
	// 	const response: Response = await fetch("/audio/" + durl + "/" + mp3File);
	// 	if (response?.ok) {
	// 		newAudio.src = "audio/" + durl + "/" + mp3File;
	// 		allaudios[mp3File] = newAudio;
	// 	} else {
	// 		throw new Error("The .mp3 file doesn't exist, let's try to fetch the .wav file");
	// 	}
	// } catch (error) {
	// 	try {
	// 		const response: Response = await fetch("/audio/" + durl + "/" + wavFile);
	// 		if (response?.ok) {
	// 			newAudio.src = "audio/" + durl + "/" + wavFile;
	// 			allaudios[wavFile] = newAudio;
	// 		}
	// 	} catch (error) {
	// 		console.log('Neither .mp3 nor .wav file exists for ' + newAudioURL);
	// 	}
	// }
	await fetch("/audio/" + durl + "/" + mp3File, { method: 'HEAD'}).then(response => {
		if (response.ok) {
			newAudio.src = "audio/" + durl + "/" + mp3File;
			allaudios[newAudioURL] = newAudio;
			return response.ok;
		} else {
			throw new Error("The .mp3 file doesn't exist, let's try to fetch the .wav file");

			// The .mp3 file doesn't exist, let's try to fetch the .wav file
		}
	})
	.catch(error => {
		console.log('Error checking .mp3 file:', error);

		fetch("/audio/" + durl + "/" + wavFile, { method: 'HEAD'}).then(response => {
			if (response.ok) {
				newAudio.src = "audio/" + durl + "/" + wavFile;
				allaudios[newAudioURL] = newAudio;
				return response.ok;
			} else {
				throw new Error("Neither .mp3 nor .wav file exists for " + newAudioURL);
			}
		})
		.catch(error => {
			console.log('Error checking .wav file:', error);
		});
	});
	console.log(newAudio.src);
}

export async function preloadBucket(newb: bucket, ndurl){
	durl = ndurl;
	correctsnd.src = "audio/" + durl + "/answer_feedback.wav";
	for (var aa in newb.items){
		var naa = newb.items[aa];
		preaudio(naa.itemName);
	}
}

export function playAudio(name: string, apcb?: Function){
	console.log("trying to play " + name);
	
	if (name.includes(".mp3")){
		if (name.slice(-4) != ".mp3"){
			name = name + ".mp3";
		}
	} else if (name.includes(".wav")){
		if (name.slice(-4) != ".wav"){
			name = name + ".wav";
		}
	}

	console.log(allaudios);

	if (typeof(apcb)!='undefined'){
		allaudios[name].addEventListener("ended", () => {
			apcb();
		})
	}

	if (name in allaudios){
		allaudios[name].play();
	}
}

export function getImg(name){
	return allimages[name];
}

export function playDing(){
	fdbksnd.play();
}

export function playCorrect(){
	correctsnd.play();
}
