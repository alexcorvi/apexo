(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[33],{

/***/ "./src/modules/prescriptions/components/page.prescriptions.tsx":
/*!*********************************************************************!*\
  !*** ./src/modules/prescriptions/components/page.prescriptions.tsx ***!
  \*********************************************************************/
/*! exports provided: PrescriptionsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PrescriptionsPage\", function() { return PrescriptionsPage; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common-components */ \"./src/common-components/index.ts\");\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core */ \"./src/core/index.ts\");\n/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules */ \"./src/modules/index.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @utils */ \"./src/utils/index.ts\");\n/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mobx */ \"./node_modules/mobx/lib/mobx.module.js\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/dist/mobx-react.module.js\");\n/* harmony import */ var office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! office-ui-fabric-react */ \"./node_modules/office-ui-fabric-react/lib/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);\n\n\n\n\n\n\n\n\n\nlet PrescriptionsPage = class PrescriptionsPage extends react__WEBPACK_IMPORTED_MODULE_8__[\"Component\"] {\n    get canEdit() {\n        return _core__WEBPACK_IMPORTED_MODULE_2__[\"user\"].currentUser && _core__WEBPACK_IMPORTED_MODULE_2__[\"user\"].currentUser.canEditPrescriptions;\n    }\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](\"div\", { className: \"pc-pg\" },\n            react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"DataTableComponent\"], { onDelete: this.canEdit\n                    ? id => {\n                        _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].deleteModal(id);\n                    }\n                    : undefined, commands: this.canEdit\n                    ? [\n                        {\n                            key: \"addNew\",\n                            title: \"Add new\",\n                            name: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Add new\"),\n                            onClick: () => {\n                                const newDoc = _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].new();\n                                _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"]\n                                    .add(newDoc)\n                                    .then(() => {\n                                    _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedID =\n                                        newDoc._id;\n                                });\n                            },\n                            iconProps: {\n                                iconName: \"Add\"\n                            }\n                        }\n                    ]\n                    : [], heads: [\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Item name\"),\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Dose\"),\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Frequency\"),\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Form\")\n                ], rows: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].docs.map(prescription => {\n                    return {\n                        id: prescription._id,\n                        searchableString: prescription.searchableString,\n                        cells: [\n                            {\n                                dataValue: prescription.name,\n                                component: (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"ProfileSquaredComponent\"], { text: prescription.name, subText: `${prescription.doseInMg}${Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"mg\")} ${prescription.timesPerDay}X${prescription.unitsPerTime} ${Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(prescription.form)}` })),\n                                onClick: () => {\n                                    _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedID =\n                                        prescription._id;\n                                },\n                                className: \"no-label\"\n                            },\n                            {\n                                dataValue: prescription.doseInMg,\n                                component: (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](\"span\", null,\n                                    prescription.doseInMg,\n                                    \" \",\n                                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"mg\"))),\n                                className: \"hidden-xs\"\n                            },\n                            {\n                                dataValue: prescription.timesPerDay,\n                                component: (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](\"span\", null,\n                                    prescription.timesPerDay,\n                                    \" *\",\n                                    \" \",\n                                    prescription.unitsPerTime)),\n                                className: \"hidden-xs\"\n                            },\n                            {\n                                dataValue: prescription.form,\n                                component: (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](\"span\", null, Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(prescription.form))),\n                                className: \"hidden-xs\"\n                            }\n                        ]\n                    };\n                }), maxItemsOnLoad: 20 }),\n            _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc ? (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"Panel\"], { isOpen: !!_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc, type: office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"PanelType\"].medium, closeButtonAriaLabel: \"Close\", isLightDismiss: true, onDismiss: () => {\n                    _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedID = \"\";\n                }, onRenderNavigation: () => (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], { className: \"panel-heading\" },\n                    react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { span: 20 }, _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc ? (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"ProfileSquaredComponent\"], { text: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.name, subText: `${_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc\n                            .doseInMg}${Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"mg\")} ${_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc\n                            .timesPerDay}X${_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc\n                            .unitsPerTime} ${Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.form)}` })) : (react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](\"p\", null))),\n                    react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { span: 4, className: \"close\" },\n                        react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"IconButton\"], { iconProps: { iconName: \"cancel\" }, onClick: () => {\n                                _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedID = \"\";\n                            } })))) },\n                react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](\"div\", { className: \"prescription-editor\" },\n                    react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"SectionComponent\"], { title: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Prescription Details\") },\n                        react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Item name\"), value: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.name, onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.name = val), disabled: !this.canEdit }),\n                        react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], { gutter: 8 },\n                            react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { md: 8 },\n                                react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Dosage in mg\"), type: \"number\", value: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.doseInMg.toString(), onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.doseInMg = Object(_utils__WEBPACK_IMPORTED_MODULE_4__[\"num\"])(val)), disabled: !this.canEdit })),\n                            react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { md: 8 },\n                                react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Times per day\"), type: \"number\", value: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.timesPerDay.toString(), onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.timesPerDay = Object(_utils__WEBPACK_IMPORTED_MODULE_4__[\"num\"])(val)), disabled: !this.canEdit })),\n                            react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { md: 8 },\n                                react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Units per time\"), type: \"number\", value: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.unitsPerTime.toString(), onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.unitsPerTime = Object(_utils__WEBPACK_IMPORTED_MODULE_4__[\"num\"])(val)), disabled: !this.canEdit }))),\n                        react__WEBPACK_IMPORTED_MODULE_8__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_7__[\"Dropdown\"], { disabled: !this.canEdit, label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Item form\"), className: \"form-picker\", selectedKey: _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.form, options: Object.keys(_modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptionItemForm\"]).map(form => {\n                                return {\n                                    key: form,\n                                    text: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(form)\n                                };\n                            }), onChange: (ev, newValue) => {\n                                _modules__WEBPACK_IMPORTED_MODULE_3__[\"prescriptions\"].selectedDoc.form = newValue.text;\n                            } }))))) : (\"\")));\n    }\n};\ntslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"]([\n    mobx__WEBPACK_IMPORTED_MODULE_5__[\"computed\"]\n], PrescriptionsPage.prototype, \"canEdit\", null);\nPrescriptionsPage = tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"]([\n    mobx_react__WEBPACK_IMPORTED_MODULE_6__[\"observer\"]\n], PrescriptionsPage);\n\n\n\n//# sourceURL=webpack:///./src/modules/prescriptions/components/page.prescriptions.tsx?");

/***/ })

}]);