/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__extends\", function() { return __extends; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__assign\", function() { return __assign; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__rest\", function() { return __rest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__decorate\", function() { return __decorate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__param\", function() { return __param; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__metadata\", function() { return __metadata; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__awaiter\", function() { return __awaiter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__generator\", function() { return __generator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__exportStar\", function() { return __exportStar; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__values\", function() { return __values; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__read\", function() { return __read; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__spread\", function() { return __spread; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__spreadArrays\", function() { return __spreadArrays; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__await\", function() { return __await; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__asyncGenerator\", function() { return __asyncGenerator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__asyncDelegator\", function() { return __asyncDelegator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__asyncValues\", function() { return __asyncValues; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__makeTemplateObject\", function() { return __makeTemplateObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__importStar\", function() { return __importStar; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__importDefault\", function() { return __importDefault; });\n/*! *****************************************************************************\r\nCopyright (c) Microsoft Corporation. All rights reserved.\r\nLicensed under the Apache License, Version 2.0 (the \"License\"); you may not use\r\nthis file except in compliance with the License. You may obtain a copy of the\r\nLicense at http://www.apache.org/licenses/LICENSE-2.0\r\n\r\nTHIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\r\nKIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\r\nWARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\r\nMERCHANTABLITY OR NON-INFRINGEMENT.\r\n\r\nSee the Apache Version 2.0 License for specific language governing permissions\r\nand limitations under the License.\r\n***************************************************************************** */\r\n/* global Reflect, Promise */\r\n\r\nvar extendStatics = function(d, b) {\r\n    extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return extendStatics(d, b);\r\n};\r\n\r\nfunction __extends(d, b) {\r\n    extendStatics(d, b);\r\n    function __() { this.constructor = d; }\r\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n}\r\n\r\nvar __assign = function() {\r\n    __assign = Object.assign || function __assign(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];\r\n        }\r\n        return t;\r\n    }\r\n    return __assign.apply(this, arguments);\r\n}\r\n\r\nfunction __rest(s, e) {\r\n    var t = {};\r\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\r\n        t[p] = s[p];\r\n    if (s != null && typeof Object.getOwnPropertySymbols === \"function\")\r\n        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {\r\n            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))\r\n                t[p[i]] = s[p[i]];\r\n        }\r\n    return t;\r\n}\r\n\r\nfunction __decorate(decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n}\r\n\r\nfunction __param(paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n}\r\n\r\nfunction __metadata(metadataKey, metadataValue) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(metadataKey, metadataValue);\r\n}\r\n\r\nfunction __awaiter(thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n}\r\n\r\nfunction __generator(thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n}\r\n\r\nfunction __exportStar(m, exports) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\n\r\nfunction __values(o) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator], i = 0;\r\n    if (m) return m.call(o);\r\n    return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n}\r\n\r\nfunction __read(o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n}\r\n\r\nfunction __spread() {\r\n    for (var ar = [], i = 0; i < arguments.length; i++)\r\n        ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n}\r\n\r\nfunction __spreadArrays() {\r\n    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\r\n    for (var r = Array(s), k = 0, i = 0; i < il; i++)\r\n        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\r\n            r[k] = a[j];\r\n    return r;\r\n};\r\n\r\nfunction __await(v) {\r\n    return this instanceof __await ? (this.v = v, this) : new __await(v);\r\n}\r\n\r\nfunction __asyncGenerator(thisArg, _arguments, generator) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var g = generator.apply(thisArg, _arguments || []), i, q = [];\r\n    return i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i;\r\n    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }\r\n    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }\r\n    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }\r\n    function fulfill(value) { resume(\"next\", value); }\r\n    function reject(value) { resume(\"throw\", value); }\r\n    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }\r\n}\r\n\r\nfunction __asyncDelegator(o) {\r\n    var i, p;\r\n    return i = {}, verb(\"next\"), verb(\"throw\", function (e) { throw e; }), verb(\"return\"), i[Symbol.iterator] = function () { return this; }, i;\r\n    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === \"return\" } : f ? f(v) : v; } : f; }\r\n}\r\n\r\nfunction __asyncValues(o) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var m = o[Symbol.asyncIterator], i;\r\n    return m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\r\n    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\r\n    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\r\n}\r\n\r\nfunction __makeTemplateObject(cooked, raw) {\r\n    if (Object.defineProperty) { Object.defineProperty(cooked, \"raw\", { value: raw }); } else { cooked.raw = raw; }\r\n    return cooked;\r\n};\r\n\r\nfunction __importStar(mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result.default = mod;\r\n    return result;\r\n}\r\n\r\nfunction __importDefault(mod) {\r\n    return (mod && mod.__esModule) ? mod : { default: mod };\r\n}\r\n\n\n//# sourceURL=webpack:///./node_modules/tslib/tslib.es6.js?");

/***/ }),

/***/ "./test.ts":
/*!*****************!*\
  !*** ./test.ts ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _tests__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tests */ \"./tests/index.ts\");\n/* harmony import */ var _tests_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tests/utils */ \"./tests/utils.ts\");\n\n\n\nconst results = {};\nfunction run() {\n    return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n        let testFunctions = [];\n        Object.keys(_tests__WEBPACK_IMPORTED_MODULE_1__[\"default\"]).forEach((groupName) => tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            Object.keys(_tests__WEBPACK_IMPORTED_MODULE_1__[\"default\"][groupName]).forEach((suitName) => tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n                Object.keys(_tests__WEBPACK_IMPORTED_MODULE_1__[\"default\"][groupName][suitName]).forEach((testName) => tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n                    const id = `${groupName} > ${suitName} > ${testName}`;\n                    const test = _tests__WEBPACK_IMPORTED_MODULE_1__[\"default\"][groupName][suitName][testName];\n                    testFunctions.push({\n                        id,\n                        test: () => tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n                            yield _tests_utils__WEBPACK_IMPORTED_MODULE_2__[\"app\"].reset();\n                            console.log(`🧪 Running: ${id}`);\n                            let testReturnValue = undefined;\n                            try {\n                                yield test();\n                            }\n                            catch (e) {\n                                testReturnValue = e.toString();\n                            }\n                            const result = testReturnValue === undefined\n                                ? \"✅\"\n                                : \"❌ \" + testReturnValue;\n                            results[id] = result;\n                            console.log(`🧪 Finished: ${id}: ${result}`);\n                        })\n                    });\n                }));\n            }));\n        }));\n        if (testFunctions.find(x => x.id.indexOf(\"__\") !== -1)) {\n            testFunctions = testFunctions.filter(x => x.id.indexOf(\"__\") !== -1);\n        }\n        for (let i = 0; i < testFunctions.length; i++) {\n            yield testFunctions[i].test();\n        }\n        console.log(\"🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪\");\n        Object.keys(results).forEach(id => {\n            console.log(\"🧪\", id, results[id]);\n        });\n        console.log(\"🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪🧪\");\n    });\n}\nrun();\n\n\n//# sourceURL=webpack:///./test.ts?");

/***/ }),

/***/ "./tests/basic/header.test.ts":
/*!************************************!*\
  !*** ./tests/basic/header.test.ts ***!
  \************************************/
/*! exports provided: headerSuite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"headerSuite\", function() { return headerSuite; });\n/**\n * TODO: showing namespace on top\n */\nconst headerSuite = {};\n\n\n//# sourceURL=webpack:///./tests/basic/header.test.ts?");

/***/ }),

/***/ "./tests/basic/index.ts":
/*!******************************!*\
  !*** ./tests/basic/index.ts ***!
  \******************************/
/*! exports provided: headerSuite, menuSuite, loginSuite, userPanelSuite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _header_test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.test */ \"./tests/basic/header.test.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"headerSuite\", function() { return _header_test__WEBPACK_IMPORTED_MODULE_0__[\"headerSuite\"]; });\n\n/* harmony import */ var _menu_test__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu.test */ \"./tests/basic/menu.test.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"menuSuite\", function() { return _menu_test__WEBPACK_IMPORTED_MODULE_1__[\"menuSuite\"]; });\n\n/* harmony import */ var _login_test__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login.test */ \"./tests/basic/login.test.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"loginSuite\", function() { return _login_test__WEBPACK_IMPORTED_MODULE_2__[\"loginSuite\"]; });\n\n/* harmony import */ var _user_panel_test__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user-panel.test */ \"./tests/basic/user-panel.test.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"userPanelSuite\", function() { return _user_panel_test__WEBPACK_IMPORTED_MODULE_3__[\"userPanelSuite\"]; });\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./tests/basic/index.ts?");

/***/ }),

/***/ "./tests/basic/login.test.ts":
/*!***********************************!*\
  !*** ./tests/basic/login.test.ts ***!
  \***********************************/
/*! exports provided: loginSuite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loginSuite\", function() { return loginSuite; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ \"./tests/utils.ts\");\n\n\n/**\n * TODO: login while offline\n * TODO: login while offline using saved session\n */\nconst staffName = \"Alex Corvi\";\nconst loginSuite = {\n    noServer() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            // start no server\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".no-server-mode\");\n            // create new staff member\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndInput(\"#new-user-name\", staffName);\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\"#create-new-user-btn\");\n            // go to staff page and make sure it's there\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".main-component\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].goToPage(\"staff\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(`.staff-component`);\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"assert\"].elContains(\".staff-component\", staffName);\n            // after resetting the application, staff member must still be there\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".no-server-mode\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#choose-user\");\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"assert\"].elContains(\"#choose-user\", staffName);\n        });\n    },\n    defaultServerField() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".input-server input\");\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"assert\"].elValue(\".input-server input\", \"http://localhost:5984\");\n        });\n    },\n    loginWithPIN() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            // start no server\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".no-server-mode\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".ms-Persona\");\n            // go to staff page and input a PIN\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".main-component\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].goToPage(\"staff\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(`.staff-component`);\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".alexcorvi .permission\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#login-pin\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\"#login-pin\", \"1234\");\n            // visit a couple of routes\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].goToPage(\"patients\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(`.patients-component`);\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].goToPage(\"staff\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(`.staff-component`);\n            // and then back to PIN to make sure its there\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".alexcorvi .permission\");\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"assert\"].elValue(\"#login-pin\", \"1234\");\n            // reset and go to no server mode again\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".no-server-mode\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#choose-user\");\n            // now should be asked for a PIN\n            // we'll enter an invalid one first\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".ms-Persona\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#modal-input\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\"#modal-input\", \"12345\"); // invalid\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\"#confirm-modal-btn\");\n            // expect an error message\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".message-inner\");\n            // we'll enter the valid one now\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".ms-Persona\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#modal-input\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\"#modal-input\", \"1234\"); // valid\n            _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\"#confirm-modal-btn\");\n            // we should be in\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".header-component\");\n        });\n    },\n    loginWhenOnline() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            // resetting\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].removeCookies();\n            // entering login data and login\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".input-server\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\".input-identification input\", \"test\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\".input-password input\", \"test\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".proceed-login\");\n            // check if actually logged in\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#choose-user\");\n        });\n    },\n    loginWhenOnlineUsingCookies() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            // resetting\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].removeCookies();\n            // entering login data and login\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\".input-server\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\".input-identification input\", \"test\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].typeIn(\".input-password input\", \"test\");\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitAndClick(\".proceed-login\");\n            // check if actually logged in\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#choose-user\");\n            // then do a reset\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"app\"].reset();\n            // we should be logged in again\n            yield _utils__WEBPACK_IMPORTED_MODULE_1__[\"interact\"].waitForEl(\"#choose-user\");\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./tests/basic/login.test.ts?");

/***/ }),

/***/ "./tests/basic/menu.test.ts":
/*!**********************************!*\
  !*** ./tests/basic/menu.test.ts ***!
  \**********************************/
/*! exports provided: menuSuite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"menuSuite\", function() { return menuSuite; });\n/**\n * TODO: toggling menu\n * TODO: clicking menu item\n */\nconst menuSuite = {};\n\n\n//# sourceURL=webpack:///./tests/basic/menu.test.ts?");

/***/ }),

/***/ "./tests/basic/user-panel.test.ts":
/*!****************************************!*\
  !*** ./tests/basic/user-panel.test.ts ***!
  \****************************************/
/*! exports provided: userPanelSuite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"userPanelSuite\", function() { return userPanelSuite; });\n/**\n * TODO: toggle\n * TODO: clicking X\n * TODO: logout\n * TODO: switch user\n * TODO: appointments for today\n */\nconst userPanelSuite = {};\n\n\n//# sourceURL=webpack:///./tests/basic/user-panel.test.ts?");

/***/ }),

/***/ "./tests/index.ts":
/*!************************!*\
  !*** ./tests/index.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _basic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./basic */ \"./tests/basic/index.ts\");\n\nconst index = {\n    basic: _basic__WEBPACK_IMPORTED_MODULE_0__\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (index);\n\n\n//# sourceURL=webpack:///./tests/index.ts?");

/***/ }),

/***/ "./tests/utils.ts":
/*!************************!*\
  !*** ./tests/utils.ts ***!
  \************************/
/*! exports provided: timeout, assert, interact, app */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"timeout\", function() { return timeout; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"assert\", function() { return assert; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"interact\", function() { return interact; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"app\", function() { return app; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n\nconst ipcRenderer = __webpack_require__(/*! electron */ \"electron\").ipcRenderer;\nconst timeout = 15000;\nconst assert = {\n    elExists(query) {\n        if (!document.querySelector(query)) {\n            throw Error(`Element \"${query}\" does not exist`);\n        }\n    },\n    elContains(query, string) {\n        const el = document.querySelector(query);\n        if (!el) {\n            throw Error(`Element \"${query}\" does not exist`);\n        }\n        else if (el.innerText.indexOf(string) === -1) {\n            throw Error(`Element \"${query}\" does not have text: \"${string}\", instead it has the following: ${el.innerText.replace(/\\s+/g, \" \")}`);\n        }\n    },\n    elValue(query, value) {\n        const el = document.querySelector(query);\n        if (!el) {\n            throw Error(`Element \"${query}\" does not exist`);\n        }\n        else if (el.value !== value) {\n            throw Error(`Input \"${query}\" does not have value: \"${value}\", instead it has the following: ${el.value.replace(/\\s+/g, \" \")}`);\n        }\n    }\n};\nconst interact = {\n    typeIn(query, string) {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            return new Promise(resolve => {\n                const el = document.querySelector(query);\n                el.focus();\n                ipcRenderer.send(\"type\", string);\n                const i = setInterval(() => {\n                    if (el.value === string) {\n                        clearInterval(i);\n                        resolve();\n                    }\n                }, 10);\n            });\n        });\n    },\n    waitAndClick(query) {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            yield this.waitForEl(query);\n            const el = document.querySelector(query);\n            el.click();\n        });\n    },\n    waitAndInput(query, input) {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            yield this.waitForEl(query);\n            yield this.typeIn(query, input);\n        });\n    },\n    waitForEl(query) {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            return new Promise((resolve, reject) => {\n                const initTime = new Date().getTime();\n                const i = setInterval(() => {\n                    if (document.querySelector(query)) {\n                        clearInterval(i);\n                        resolve();\n                    }\n                    else if (new Date().getTime() - initTime > timeout) {\n                        clearInterval(i);\n                        throw Error(`Timeout: could not find element \"${query}\"`);\n                    }\n                }, 10);\n            });\n        });\n    }\n};\nconst app = {\n    resync() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            yield window.resyncApp();\n        });\n    },\n    reset() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            yield new Promise(resolve => setTimeout(resolve, 1000));\n            yield app.resync();\n            yield window.resetApp();\n        });\n    },\n    goToPage(namespace) {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            yield interact.waitAndClick(\"#expand-menu\");\n            yield interact.waitAndClick(`[title=\"${namespace}\"].ms-Nav-link`);\n        });\n    },\n    removeCookies() {\n        return tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"](this, void 0, void 0, function* () {\n            yield window.removeCookies();\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./tests/utils.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ })

/******/ });