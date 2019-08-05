(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ "./node_modules/immediate/lib/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/immediate/lib/browser.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\nvar Mutation = global.MutationObserver || global.WebKitMutationObserver;\n\nvar scheduleDrain;\n\n{\n  if (Mutation) {\n    var called = 0;\n    var observer = new Mutation(nextTick);\n    var element = global.document.createTextNode('');\n    observer.observe(element, {\n      characterData: true\n    });\n    scheduleDrain = function () {\n      element.data = (called = ++called % 2);\n    };\n  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {\n    var channel = new global.MessageChannel();\n    channel.port1.onmessage = nextTick;\n    scheduleDrain = function () {\n      channel.port2.postMessage(0);\n    };\n  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {\n    scheduleDrain = function () {\n\n      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted\n      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.\n      var scriptEl = global.document.createElement('script');\n      scriptEl.onreadystatechange = function () {\n        nextTick();\n\n        scriptEl.onreadystatechange = null;\n        scriptEl.parentNode.removeChild(scriptEl);\n        scriptEl = null;\n      };\n      global.document.documentElement.appendChild(scriptEl);\n    };\n  } else {\n    scheduleDrain = function () {\n      setTimeout(nextTick, 0);\n    };\n  }\n}\n\nvar draining;\nvar queue = [];\n//named nextTick for less confusing stack traces\nfunction nextTick() {\n  draining = true;\n  var i, oldQueue;\n  var len = queue.length;\n  while (len) {\n    oldQueue = queue;\n    queue = [];\n    i = -1;\n    while (++i < len) {\n      oldQueue[i]();\n    }\n    len = queue.length;\n  }\n  draining = false;\n}\n\nmodule.exports = immediate;\nfunction immediate(task) {\n  if (queue.push(task) === 1 && !draining) {\n    scheduleDrain();\n  }\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/immediate/lib/browser.js?");

/***/ })

}]);