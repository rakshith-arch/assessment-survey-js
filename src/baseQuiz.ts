import { App } from './App';
import { sendFinished } from './components/analyticsEvents';
import { showEnd } from './components/uiController';
import { UnityBridge } from './components/unityBridge';

export abstract class BaseQuiz {
	protected app: App;
	public dataURL: string;
	public unityBridge: UnityBridge;

	public abstract Run(applink: App): void;
	public abstract TryAnswer(ans: number, elapsed: number): void;
	public abstract HasQuestionsLeft(): boolean;

	public onEnd(): void {
		sendFinished();
		showEnd();
		this.app.unityBridge.SendClose();
	}
}
