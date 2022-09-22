(() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    /**
     * Contains utils for working with URL strings.
     */
    define("components/urlUtils", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getAppType = void 0;
        function getAppType(url) {
            const pathname = getPathName(url);
            const pathParts = pathname.split('/');
            return pathParts[1];
        }
        exports.getAppType = getAppType;
        function getPathName(url) {
            const urlRef = new URL(url);
            return urlRef.pathname;
        }
    });
    define("app", ["require", "exports", "components/urlUtils"], function (require, exports, urlUtils_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class App {
            constructor() {
                console.log("Initializing app...");
                this.appType = (0, urlUtils_1.getAppType)(window.location.href);
                console.log(this.appType);
                // TODO: make separate UI controllers for survey and assessment
                showGame();
            }
        }
        const app = new App();
    });
    //functions to show/hide the different containers
    const landingCont = document.getElementById("landWrap");
    const gameCont = document.getElementById("gameWrap");
    const endCont = document.getElementById("endWrap");
    function showLanding() {
        landingCont.style.display = "block";
        gameCont.style.display = "none";
        endCont.style.display = "none";
    }
    function showGame() {
        landingCont.style.display = "none";
        gameCont.style.display = "block";
        endCont.style.display = "none";
    }
    function showEnd() {
        landingCont.style.display = "none";
        gameCont.style.display = "none";
        endCont.style.display = "block";
    }
    //add button listeners
    document.getElementById("answerButton1").addEventListener("click", function () {
        buttonPress(1);
    });
    document.getElementById("answerButton2").addEventListener("click", function () {
        buttonPress(2);
    });
    document.getElementById("answerButton3").addEventListener("click", function () {
        buttonPress(3);
    });
    document.getElementById("answerButton4").addEventListener("click", function () {
        buttonPress(4);
    });
    function buttonPress(num) {
        console.log(num);
    }
    //this is where the logic for handling the buckets will go
    //
    //once we start adding in the assessment functionality
    // this is where we can have the classes and functions for building the events
    // to send to an analytics recorder (firebase? lrs?)
    // this is where we can define the format of the data for a
    // question, the correct answer, and the foil answers
    /**
     * Module that wraps Unity calls for sending messages from the webview to Unity.
     */
    define("components/unityBridge", ["require", "exports"], function (require, exports) {
        "use strict";
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
    });
    //this is where the code will go for linearly iterating through the
    //questions in a data.json file that identifies itself as a survey
    showGame();
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        if (typeof define.factory !== 'function') {
            return define.factory;
        }
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();