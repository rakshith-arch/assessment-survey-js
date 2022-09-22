"use strict";
/**
 * Module that wraps Unity calls for sending messages from the webview to Unity.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnityBridge = void 0;
class UnityBridge {
    constructor() {
        if (typeof Unity !== 'undefined') {
            this.unityReference = Unity;
        }
        else {
            this.unityReference = null;
        }
    }
    SendMessage(message) {
        if (this.unityReference !== null) {
            this.unityReference.call(message);
        }
    }
}
exports.UnityBridge = UnityBridge;
