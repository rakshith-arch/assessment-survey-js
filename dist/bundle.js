var Bundle = (() => {
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
    // this is where we can define the format of the data for a
    // question, the correct answer, and the foil answers
    define("components/questionData", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
    });
    define("components/uiController", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.setButtonAction = exports.setFeedbackVisibile = exports.showEnd = exports.showGame = exports.showLanding = exports.showQuestion = void 0;
        const landingCont = document.getElementById("landWrap");
        const gameCont = document.getElementById("gameWrap");
        const endCont = document.getElementById("endWrap");
        const qT = document.getElementById("qWrap");
        const fT = document.getElementById("feedbackWrap");
        const b1 = document.getElementById("answerButton1");
        const b2 = document.getElementById("answerButton2");
        const b3 = document.getElementById("answerButton3");
        const b4 = document.getElementById("answerButton4");
        const buttons = [b1, b2, b3, b4];
        var bCallback;
        var buttonsActive = true;
        //add button listeners
        b1.addEventListener("click", function () {
            buttonPress(1);
        });
        b2.addEventListener("click", function () {
            buttonPress(2);
        });
        b3.addEventListener("click", function () {
            buttonPress(3);
        });
        b4.addEventListener("click", function () {
            buttonPress(4);
        });
        landingCont.addEventListener("click", function () {
            showGame();
        });
        //function to display a new question
        function showQuestion(newQ) {
            qT.innerHTML = newQ.promptText;
            //showing the answers on each button
            for (var aNum in newQ.answers) {
                let curAnswer = newQ.answers[aNum];
                let answerCode = "";
                if ('answerText' in curAnswer) {
                    answerCode += curAnswer.answerText;
                }
                else if ('answerImg' in curAnswer) {
                    answerCode += "<img src='" + curAnswer.answerImg + "'";
                }
                buttons[aNum].innerHTML = answerCode;
            }
        }
        exports.showQuestion = showQuestion;
        //functions to show/hide the different containers
        function showLanding() {
            landingCont.style.display = "block";
            gameCont.style.display = "none";
            endCont.style.display = "none";
        }
        exports.showLanding = showLanding;
        function showGame() {
            landingCont.style.display = "none";
            gameCont.style.display = "block";
            endCont.style.display = "none";
        }
        exports.showGame = showGame;
        function showEnd() {
            landingCont.style.display = "none";
            gameCont.style.display = "none";
            endCont.style.display = "block";
        }
        exports.showEnd = showEnd;
        function setFeedbackVisibile(b) {
            if (b) {
                fT.style.visibility = "visible";
                buttonsActive = false;
            }
            else {
                fT.style.visibility = "hidden";
                buttonsActive = true;
            }
        }
        exports.setFeedbackVisibile = setFeedbackVisibile;
        //handle button press
        function setButtonAction(callback) {
            bCallback = callback;
        }
        exports.setButtonAction = setButtonAction;
        function buttonPress(num) {
            if (buttonsActive) {
                console.log(num);
                bCallback(num);
            }
        }
    });
    // this is where we can have the classes and functions for building the events
    // to send to an analytics recorder (firebase? lrs?)
    define("components/analyticsEvents", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.sendFinished = exports.sendAnswered = exports.sendInit = exports.setUuid = void 0;
        var uuid;
        function setUuid(newUuid) {
            uuid = newUuid;
        }
        exports.setUuid = setUuid;
        function sendInit() {
            var eventString = "user " + uuid + " opened the assessment";
            console.log(eventString);
        }
        exports.sendInit = sendInit;
        function sendAnswered(theQ, theA) {
            var ans = theQ.answers[theA - 1];
            var eventString = "user " + uuid + " ansered " + theQ.qName + " with " + ans.answerName;
            console.log(eventString);
        }
        exports.sendAnswered = sendAnswered;
        function sendFinished() {
            var eventString = "user " + uuid + " finished the assessment";
        }
        exports.sendFinished = sendFinished;
    });
    //this is where the code will go for linearly iterating through the
    //questions in a data.json file that identifies itself as a survey
    define("survey/survey", ["require", "exports", "components/uiController", "components/analyticsEvents"], function (require, exports, uiController_1, analyticsEvents_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Survey = void 0;
        class Survey {
            constructor() {
                this.onQuestionEnd = () => {
                    (0, uiController_1.setFeedbackVisibile)(false);
                    this.qNum += 1;
                    if (this.hasAnotherQueston()) {
                        (0, uiController_1.showQuestion)(this.getNextQuestion());
                    }
                    else {
                        console.log("no questions left");
                        (0, uiController_1.showEnd)();
                    }
                };
                this.tryAnswer = (ans) => {
                    (0, analyticsEvents_1.sendAnswered)(this.qList[this.qNum], ans);
                    (0, uiController_1.setFeedbackVisibile)(true);
                    setTimeout(() => { this.onQuestionEnd(); }, 2000);
                };
                console.log("survey initialized");
                this.qNum = 0;
                (0, uiController_1.setButtonAction)(this.tryAnswer);
            }
            runSurvey() {
                this.qList = this.buildQuestionList();
                (0, uiController_1.showQuestion)(this.getNextQuestion());
            }
            buildQuestionList() {
                //hard-coded test data for right now
                var q1 = { qName: "q1", promptText: "question 1 text", answers: [
                        { answerName: "a1", answerText: "answer 1" },
                        { answerName: "a2", answerText: "answer 2" },
                        { answerName: "a3", answerText: "answer 3" },
                        { answerName: "a4", answerText: "answer 4" }
                    ] };
                var q2 = { qName: "q2", promptText: "question 2 text", answers: [
                        { answerName: "a1", answerText: "answer 1" },
                        { answerName: "a2", answerText: "slightly different answer 2" },
                        { answerName: "a3", answerText: "completley new answer 3" },
                        { answerName: "a4", answerText: "answer 4" }
                    ] };
                var q3 = { qName: "q3", promptText: "the last question", answers: [
                        { answerName: "a1", answerText: "ahhh" },
                        { answerName: "a2", answerText: "almost done" },
                        { answerName: "a3", answerText: "yay" },
                        { answerName: "a4", answerText: "woohoo" }
                    ] };
                // TODO: import this from a data.json file instead
                return [q1, q2, q3];
            }
            hasAnotherQueston() {
                if ((this.qList.length - 1) >= this.qNum) {
                    return true;
                }
                else {
                    return false;
                }
            }
            getNextQuestion() {
                var res = this.qList[this.qNum];
                return res;
            }
        }
        exports.Survey = Survey;
    });
    define("App", ["require", "exports", "components/urlUtils", "survey/survey", "components/analyticsEvents"], function (require, exports, urlUtils_1, survey_1, analyticsEvents_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.App = void 0;
        class App {
            constructor() {
                console.log("Initializing app...");
                this.appType = (0, urlUtils_1.getAppType)(window.location.href);
                console.log(this.appType);
                // TODO: make separate UI controllers for survey and assessment
                (0, analyticsEvents_2.setUuid)("testinguuid");
                (0, analyticsEvents_2.sendInit)();
                const surv = new survey_1.Survey();
                surv.runSurvey();
            }
        }
        exports.App = App;
        const app = new App();
    });
    //this is where the logic for handling the buckets will go
    //
    //once we start adding in the assessment functionality
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
        return resolve("App");
    }
})();