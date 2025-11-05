sap.ui.define(["demo/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],function (BaseController, Filter, JSONModel, MessageToast,Fragment) {
        "use strict";
        return BaseController.extend("demo.controller.OrderList", {
            onInit: function () {
                debugger;
                this.getRouter().getRoute("orderlist").attachPatternMatched(this._onRouteMatched, this);
                
                // Create a model to track edit mode
                const oEditModel = new JSONModel({
                    editMode: false
                });
                this.getView().setModel(oEditModel, "editModel");
            },
            _onRouteMatched: function (oEvent) {
                debugger;
                const sPOnum = oEvent.getParameter("arguments").purchaseOrder;
                this._getDealData(sPOnum);

            },
            _getDealData: async function (sPOnum) {
                debugger;
                const sUrl = "/A_PurchaseOrderItem";
                let aFilters = [];
                aFilters.push(new Filter("PurchaseOrder", "EQ", sPOnum));
                const oModel = await this.getDataFromServer(sUrl, {}, aFilters);
                const oModel1 = oModel.results[0];
                const oPOdetailModel = new JSONModel(oModel1);
                this.getView().setModel(oPOdetailModel , "poListItems");
                console.log(oModel);
                debugger;
            },
            _onEditPress: function (oEvent) {
                debugger;
                
                // Get the edit model
                const oEditModel = this.getView().getModel("editModel");
                const bCurrentEditMode = oEditModel.getProperty("/editMode");
                
                // Toggle edit mode
                oEditModel.setProperty("/editMode", !bCurrentEditMode);
                
                // Change button text based on mode
                const oButton = oEvent.getSource();
                if (!bCurrentEditMode) {
                    oButton.setText("Save");
                    oButton.setIcon("sap-icon://save");
                    MessageToast.show("Edit mode enabled");
                } else {
                    oButton.setText("Edit");
                    oButton.setIcon("sap-icon://edit");
                    
                    // Here you can add save logic when switching from edit to view mode
                    // this._saveChanges();
                    MessageToast.show("Changes saved");
                }
            },
            
            _onCancelPress: function () {
                // Reset edit mode
                const oEditModel = this.getView().getModel("editModel");
                oEditModel.setProperty("/editMode", false);
                
                // Reset the edit button
                const oEditButton = this.byId("editButton");
                oEditButton.setText("Edit");
                oEditButton.setIcon("sap-icon://edit");
                
                // Reload the original data to discard changes
                const sPOnum = this.getView().getModel("poListItems").getProperty("/PurchaseOrder");
                if (sPOnum) {
                    this._getDealData(sPOnum);
                }
                
                MessageToast.show("Changes discarded");
            },
               _onPoValueHelpRequest: async function (oEvent) {
                // Store the input that triggered the dialog
                debugger;
                this._oInput = oEvent.getSource();
                
                var sInputValue = this._oInput.getValue();
                var oView = this.getView();

                try {

                    const sUrl = "/A_CompanyCode";
                    let aFilters = [];
                    const oParams = {};
                    const oData = await this.getDataFromNamedModel("companyCodeModel", sUrl, oParams, aFilters);
                    debugger;    
                    console.log(oData);
                    const oModel = new JSONModel(oData);
                    oView.setModel(oModel, "companyCodes");
                
                }
                catch(error){
                        console.log(error);
                }

                // If dialog doesn't exist, create it
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "demo.fragments.PoValueHelpDialog", // Change this to your actual fragment name
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }).catch(function (error) {
                        console.error("Error loading fragment:", error);
                    });
                }

                // Open the dialog once loaded
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    //oDialog.getBinding("items").filter([new Filter("PurchaseOrder", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open();
                });

            },
            _onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                // Use the stored input reference
                if (this._oInput) {
                    this._oInput.setValue(oSelectedItem.getTitle());
                }
            }

        });

    });