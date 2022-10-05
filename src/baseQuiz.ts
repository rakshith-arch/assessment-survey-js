import { App } from './App';
import { qData } from './components/questionData';
import { sendFinished } from './components/analyticsEvents';
import { showQuestion, showGame, showEnd, setButtonAction, setFeedbackVisibile } from './components/uiController';

export abstract class baseQuiz {
	public aLink: App;
	public dataURL: string;

	public abstract run(applink: App): void;
	public abstract tryAnswer(ans: number): void;
	public abstract hasAnotherQueston(): boolean;
	
	public onEnd(): void {
		sendFinished();
		showEnd();
		this.aLink.unity.sendClose();
	}
}
