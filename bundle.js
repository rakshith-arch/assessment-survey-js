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
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    define("components/urlUtils", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getDataFile = exports.getUUID = exports.getAppType = void 0;
        function getAppType() {
            const pathParams = getPathName();
            const appType = pathParams.get('appType');
            return appType;
        }
        exports.getAppType = getAppType;
        function getUUID() {
            const pathParams = getPathName();
            var nuuid = pathParams.get('uuid');
            if (nuuid == undefined) {
                console.log("no uuid provided");
                nuuid = "WebUserNoID";
            }
            return nuuid;
        }
        exports.getUUID = getUUID;
        function getDataFile() {
            const pathParams = getPathName();
            var data = pathParams.get('data');
            if (data == undefined) {
                console.log("default data file");
                data = "default";
            }
            return data;
        }
        exports.getDataFile = getDataFile;
        function getPathName() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            return urlParams;
        }
    });
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
        function showQuestion(newQ) {
            let qCode = "";
            if ('promptImg' in newQ) {
                qCode += "<img src='" + newQ.promptImg + "'></img><BR>";
            }
            qCode += newQ.promptText;
            qT.innerHTML = qCode;
            for (var aNum in newQ.answers) {
                let curAnswer = newQ.answers[aNum];
                let answerCode = "";
                if ('answerText' in curAnswer) {
                    answerCode += curAnswer.answerText;
                }
                if ('answerImg' in curAnswer) {
                    answerCode += "<BR><img src='" + curAnswer.answerImg + "'></img>";
                }
                buttons[aNum].innerHTML = answerCode;
            }
        }
        exports.showQuestion = showQuestion;
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
                fT.classList.remove("hidden");
                fT.classList.add("visible");
                buttonsActive = false;
            }
            else {
                fT.classList.remove("visible");
                fT.classList.add("hidden");
                buttonsActive = true;
            }
        }
        exports.setFeedbackVisibile = setFeedbackVisibile;
        function setButtonAction(callback) {
            bCallback = callback;
        }
        exports.setButtonAction = setButtonAction;
        function buttonPress(num) {
            if (buttonsActive) {
                bCallback(num);
            }
        }
    });
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
            eventString += ", all answers were [";
            for (var aNum in theQ.answers) {
                eventString += theQ.answers[aNum].answerName + ",";
            }
            eventString += "]";
            console.log(eventString);
        }
        exports.sendAnswered = sendAnswered;
        function sendFinished() {
            var eventString = "user " + uuid + " finished the assessment";
            console.log(eventString);
        }
        exports.sendFinished = sendFinished;
    });
    define("baseQuiz", ["require", "exports", "components/analyticsEvents", "components/uiController"], function (require, exports, analyticsEvents_1, uiController_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.baseQuiz = void 0;
        class baseQuiz {
            onEnd() {
                (0, analyticsEvents_1.sendFinished)();
                (0, uiController_1.showEnd)();
                this.aLink.unity.sendClose();
            }
        }
        exports.baseQuiz = baseQuiz;
    });
    define("components/jsonUtils", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.fetchAssessmentBuckets = exports.fetchSurveyQuestions = exports.fetchAppType = void 0;
        function fetchAppType(url) {
            return __awaiter(this, void 0, void 0, function* () {
                return loadData(url).then(data => { return data["appType"]; });
            });
        }
        exports.fetchAppType = fetchAppType;
        function fetchSurveyQuestions(url) {
            return __awaiter(this, void 0, void 0, function* () {
                return loadData(url).then(data => { return data["questions"]; });
            });
        }
        exports.fetchSurveyQuestions = fetchSurveyQuestions;
        function fetchAssessmentBuckets(url) {
            return __awaiter(this, void 0, void 0, function* () {
                return loadData(url).then(data => { return data["buckets"]; });
            });
        }
        exports.fetchAssessmentBuckets = fetchAssessmentBuckets;
        function loadData(url) {
            return __awaiter(this, void 0, void 0, function* () {
                var furl = "./data/" + url + ".json";
                console.log(furl);
                return fetch(furl).then(response => response.json());
            });
        }
    });
    define("survey/survey", ["require", "exports", "components/uiController", "components/analyticsEvents", "baseQuiz", "components/jsonUtils"], function (require, exports, uiController_2, analyticsEvents_2, baseQuiz_1, jsonUtils_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Survey = void 0;
        class Survey extends baseQuiz_1.baseQuiz {
            constructor(durl) {
                super();
                this.onQuestionEnd = () => {
                    (0, uiController_2.setFeedbackVisibile)(false);
                    this.qNum += 1;
                    if (this.hasAnotherQueston()) {
                        (0, uiController_2.showQuestion)(this.getNextQuestion());
                    }
                    else {
                        console.log("no questions left");
                        this.onEnd();
                    }
                };
                this.tryAnswer = (ans) => {
                    (0, analyticsEvents_2.sendAnswered)(this.qList[this.qNum], ans);
                    (0, uiController_2.setFeedbackVisibile)(true);
                    setTimeout(() => { this.onQuestionEnd(); }, 2000);
                };
                this.buildQuestionList = () => {
                    var qs = (0, jsonUtils_1.fetchSurveyQuestions)(this.aLink.dataURL);
                    return qs;
                };
                this.dataURL = durl;
                console.log("survey initialized");
                this.qNum = 0;
                (0, uiController_2.setButtonAction)(this.tryAnswer);
            }
            run(applink) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.aLink = applink;
                    this.buildQuestionList().then(result => {
                        this.qList = result;
                        (0, uiController_2.showQuestion)(this.getNextQuestion());
                    });
                });
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
    define("assessment/bucketData", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
    });
    define("assessment/assessment", ["require", "exports", "components/uiController", "components/analyticsEvents", "baseQuiz", "components/jsonUtils"], function (require, exports, uiController_3, analyticsEvents_3, baseQuiz_2, jsonUtils_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Assessment = void 0;
        class Assessment extends baseQuiz_2.baseQuiz {
            constructor(durl) {
                super();
                this.buildBuckets = () => {
                    var res = (0, jsonUtils_2.fetchAssessmentBuckets)(this.aLink.dataURL).then(result => {
                        this.buckets = result;
                        this.numBuckets = result.length;
                        this.basalBucket = this.numBuckets + 1;
                        this.ceilingBucket = -1;
                        var middle = result[Math.floor(result.length / 2)];
                        this.initBucket(middle);
                    });
                    return res;
                };
                this.initBucket = (b) => {
                    this.curBucket = b;
                    this.curBucket.numTried = 0;
                    this.curBucket.numCorrect = 0;
                    this.curBucket.numConsecutiveWrong = 0;
                };
                this.tryAnswer = (ans) => {
                    (0, analyticsEvents_3.sendAnswered)(this.curQ, ans);
                    (0, analyticsEvents_3.sendAnswered)(this.curQ, ans);
                    this.curBucket.numTried += 1;
                    if (this.curQ.answers[ans - 1].answerName == this.curQ.correct) {
                        this.curBucket.numCorrect += 1;
                        this.curBucket.numConsecutiveWrong = 0;
                    }
                    else {
                        this.curBucket.numConsecutiveWrong = 0;
                    }
                    (0, uiController_3.setFeedbackVisibile)(true);
                    setTimeout(() => { this.onQuestionEnd(); }, 2000);
                };
                this.onQuestionEnd = () => {
                    (0, uiController_3.setFeedbackVisibile)(false);
                    if (this.hasAnotherQueston()) {
                        (0, uiController_3.showQuestion)(this.getNextQuestion());
                    }
                    else {
                        console.log("no questions left");
                        this.onEnd();
                    }
                };
                this.getNextQuestion = () => {
                    var targetItem, foil1, foil2, foil3;
                    do {
                        targetItem = randFrom(this.curBucket.items);
                    } while (this.curBucket.usedItems.includes(targetItem));
                    this.curBucket.usedItems.push(targetItem);
                    do {
                        foil1 = randFrom(this.curBucket.items);
                    } while (targetItem == foil1);
                    do {
                        foil2 = randFrom(this.curBucket.items);
                    } while (targetItem == foil2 || foil1 == foil2);
                    do {
                        foil3 = randFrom(this.curBucket.items);
                    } while (targetItem == foil3 || foil1 == foil3 || foil2 == foil3);
                    var opts = [targetItem, foil1, foil2, foil3];
                    shuffleArray(opts);
                    var res = {
                        qName: "question" + this.questionNum + "-" + targetItem.itemName,
                        promptText: targetItem.itemText,
                        answers: [
                            {
                                answerName: opts[0].itemName,
                                answerText: opts[0].itemText
                            },
                            {
                                answerName: opts[1].itemName,
                                answerText: opts[1].itemText
                            },
                            {
                                answerName: opts[2].itemName,
                                answerText: opts[2].itemText
                            },
                            {
                                answerName: opts[3].itemName,
                                answerText: opts[3].itemText
                            }
                        ]
                    };
                    this.curQ = res;
                    this.questionNum += 1;
                    return res;
                };
                this.hasAnotherQueston = () => {
                    var stillMore = true;
                    if (this.curBucket.numCorrect >= 4) {
                        if (this.curBucket.bucketID >= this.numBuckets) {
                            stillMore = false;
                        }
                        else {
                            this.curBucket.tested = true;
                            this.initBucket(this.buckets[this.curBucket.bucketID]);
                        }
                    }
                    if (this.curBucket.numConsecutiveWrong >= 2 || this.curBucket.numTried >= 5) {
                        if (this.curBucket.bucketID < this.basalBucket) {
                            this.basalBucket = this.curBucket.bucketID;
                        }
                        if (this.curBucket.bucketID <= 1) {
                            stillMore = false;
                        }
                        else {
                            this.curBucket.tested = true;
                            this.initBucket(this.buckets[this.curBucket.bucketID - 1]);
                        }
                    }
                    return stillMore;
                };
                this.dataURL = durl;
                this.questionNum = 0;
                console.log("app initialized");
                (0, uiController_3.setButtonAction)(this.tryAnswer);
            }
            run(applink) {
                this.aLink = applink;
                this.buildBuckets().then(result => {
                    console.log(this.curBucket);
                    (0, uiController_3.showQuestion)(this.getNextQuestion());
                });
            }
        }
        exports.Assessment = Assessment;
        function randFrom(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    });
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
            sendLoaded() {
                if (this.unityReference !== null) {
                    this.unityReference.call("loaded");
                }
                else {
                    console.log("would call Unity loaded now");
                }
            }
            sendClose() {
                if (this.unityReference !== null) {
                    this.unityReference.call("close");
                }
                else {
                    console.log("would close Unity now");
                }
            }
        }
        exports.UnityBridge = UnityBridge;
    });
    define("App", ["require", "exports", "components/urlUtils", "survey/survey", "assessment/assessment", "components/unityBridge", "components/analyticsEvents", "components/jsonUtils"], function (require, exports, urlUtils_1, survey_1, assessment_1, unityBridge_1, analyticsEvents_4, jsonUtils_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.App = void 0;
        class App {
            constructor() {
                this.unity = new unityBridge_1.UnityBridge();
                this.unity.sendLoaded();
                console.log("Initializing app...");
                this.dataURL = (0, urlUtils_1.getDataFile)();
            }
            spinUp() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, jsonUtils_3.fetchAppType)(this.dataURL).then(result => {
                        console.log("spinning up");
                        console.log(result);
                        if (result == "survey") {
                            this.game = new survey_1.Survey(this.dataURL);
                        }
                        if (result == "assessment") {
                            this.game = new assessment_1.Assessment(this.dataURL);
                        }
                        (0, analyticsEvents_4.setUuid)((0, urlUtils_1.getUUID)());
                        (0, analyticsEvents_4.sendInit)();
                        this.game.run(this);
                    });
                });
            }
        }
        exports.App = App;
        const app = new App();
        app.spinUp();
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