(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[28],{

/***/ "./src/modules/orthodontic/components/ortho-gallery.tsx":
/*!**************************************************************!*\
  !*** ./src/modules/orthodontic/components/ortho-gallery.tsx ***!
  \**************************************************************/
/*! exports provided: OrthoGalleryPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OrthoGalleryPanel\", function() { return OrthoGalleryPanel; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @core */ \"./src/core/index.ts\");\n/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @modules */ \"./src/modules/index.ts\");\n/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ \"./node_modules/mobx/lib/mobx.module.js\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/dist/mobxreact.esm.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nlet OrthoGalleryPanel = class OrthoGalleryPanel extends react__WEBPACK_IMPORTED_MODULE_5__[\"Component\"] {\n    get canEdit() {\n        return _core__WEBPACK_IMPORTED_MODULE_1__[\"user\"].currentUser.canEditOrtho;\n    }\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", null, this.props.orthoCase.patient ? (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](_modules__WEBPACK_IMPORTED_MODULE_2__[\"PatientGalleryPanel\"], { patient: this.props.orthoCase.patient })) : (\"\")));\n    }\n};\nObject(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx__WEBPACK_IMPORTED_MODULE_3__[\"computed\"]\n], OrthoGalleryPanel.prototype, \"canEdit\", null);\nOrthoGalleryPanel = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx_react__WEBPACK_IMPORTED_MODULE_4__[\"observer\"]\n], OrthoGalleryPanel);\n\n\n\n//# sourceURL=webpack:///./src/modules/orthodontic/components/ortho-gallery.tsx?");

/***/ })

}]);