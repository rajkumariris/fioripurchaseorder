/*global QUnit*/

sap.ui.define([
	"demo/controller/PlannerApp.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PlannerApp Controller");

	QUnit.test("I should test the PlannerApp controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
