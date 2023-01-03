//code for loading audios

import { qData } from './questionData';

var allaudios = {};

export async function prepareAudios(qsdata)  {
	var qd;
	for (var qn in qsdata){
		qd = qsdata[qn];
		if (qd.promptAudio != null){
			console.log("looking for " + qd.promptAudio);
			var audiosource = qd.promptAudio;
			var newaudio = new Audio();
			newaudio.src = "data/audio/" + audiosource;
			allaudios[audiosource] = newaudio;

		}
	}
	console.log(allaudios);

}


export function playAudio(name){
	console.log("trying to play " + name);
	allaudios[name].play();
}
