//this is where the code will go for linearly iterating through the
//questions in a data.json file that identifies itself as a survey

import { showGame } from '../components/uiController';

export class Survey {

	constructor (){
		console.log("survey initialized");
	}


	public runSurvey(): void{
		showGame();


	}

}
