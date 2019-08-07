(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ "./src/modules/statistics/components/chart.treatments-gender.tsx":
/*!***********************************************************************!*\
  !*** ./src/modules/statistics/components/chart.treatments-gender.tsx ***!
  \***********************************************************************/
/*! exports provided: TreatmentsByGenderChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TreatmentsByGenderChart\", function() { return TreatmentsByGenderChart; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common-components */ \"./src/common-components/index.ts\");\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core */ \"./src/core/index.ts\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/dist/mobx-react.module.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nlet TreatmentsByGenderChart = class TreatmentsByGenderChart extends react__WEBPACK_IMPORTED_MODULE_4__[\"Component\"] {\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_4__[\"createElement\"](\"div\", null,\n            react__WEBPACK_IMPORTED_MODULE_4__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"BarChartComponent\"], Object.assign({}, {\n                horizontal: true,\n                height: 400,\n                notStacked: true,\n                data: {\n                    xLabels: this.props.selectedTreatments.map(x => x.treatment.type),\n                    bars: [\n                        {\n                            label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Male\"),\n                            data: this.props.selectedTreatments.map(x => x.male)\n                        },\n                        {\n                            label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Female\"),\n                            data: this.props.selectedTreatments.map(x => x.female * -1)\n                        }\n                    ]\n                }\n            }))));\n    }\n};\nTreatmentsByGenderChart = tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"]([\n    mobx_react__WEBPACK_IMPORTED_MODULE_3__[\"observer\"]\n], TreatmentsByGenderChart);\n\n\n\n//# sourceURL=webpack:///./src/modules/statistics/components/chart.treatments-gender.tsx?");

/***/ })

}]);