sap.ui.define(["demo/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],function (BaseController, Filter, JSONModel, MessageToast,Fragment) {
        "use strict";
        this.getloadoEvent = null;
        this.poNum;
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
                this.poNum = sPOnum;
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
            
            _onEditPress: async function (oEvent) {
                debugger;
                this.getloadoEvent = oEvent;

                // Get the edit model
                const oEditModel = this.getView().getModel("editModel");
                const bCurrentEditMode = oEditModel.getProperty("/editMode");
                
                // Toggle edit mode
                oEditModel.setProperty("/editMode", !bCurrentEditMode);
                
                // Change button text based on mode
                const oButton = oEvent.getSource(oEvent);
                if (!bCurrentEditMode) {
                    oButton.setText("Save");
                    oButton.setIcon("sap-icon://save");
                    MessageToast.show("Edit mode enabled");
                } else {
                    oButton.setEnabled(false);
                    try{
                        await this._onSavePressed(this.getloadoEvent);
                         oButton.setText("Edit");
                        oButton.setIcon("sap-icon://edit");
                    }
                    catch(error){
                        oEditModel.setProperty("/editMode", true);
                        oButton.setText("Save");
                        oButton.setIcon("sap-icon://save");
                        MessageToast.show("save failed");

                        console.log(error);
                    }
                    finally{
                        oButton.setEnabled(true);

                    }
                   
                    
                    // Here you can add save logic when switching from edit to view mode
                    // this._saveChanges();
                    MessageToast.show("Changes saved");
                }
            },
            _onSavePressed: async function (oEvent) {
               
                debugger;
                console.log(oEvent);
                const sUrl = "/A_PurchaseOrder";
                let aFilters = [];
                aFilters.push(new Filter("PurchaseOrder", "EQ",  this.poNum));
                const oModel = await this.getDataFromServer(sUrl, {}, aFilters);
                const myModel = oModel.results[0];

                const oPOdetailModel = new JSONModel(myModel);
                this.setModel(oPOdetailModel, "poDetails");
                console.log(oPOdetailModel);
                
                const oPOData = this.getView().getModel("poDetails").getData();
                // Get the purchase order number (key field)
                const sPurchaseOrder = oPOData.PurchaseOrder;
                
                // Build the OData path with the key
                const sPath = "/A_PurchaseOrder('" + sPurchaseOrder + "')";
                
                // Create payload with only updatable fields
                // Exclude read-only fields and metadata fields
                const oUpdatePayload = {
                    // Key fields (required for update)
                    PurchaseOrder: oPOData.PurchaseOrder,
                    
                    // Updatable fields only
                    CompanyCode: oPOData.CompanyCode,
                    PurchaseOrderType: oPOData.PurchaseOrderType,
                    // Note: Supplier field is causing the error - check if it's valid
                    // Supplier: oPOData.Supplier,
                    Language: oPOData.Language,
                    PaymentTerms: oPOData.PaymentTerms,
                    CashDiscount1Days: oPOData.CashDiscount1Days,
                    CashDiscount2Days: oPOData.CashDiscount2Days,
                    NetPaymentDays: oPOData.NetPaymentDays,
                    CashDiscount1Percent: oPOData.CashDiscount1Percent,
                    CashDiscount2Percent: oPOData.CashDiscount2Percent,
                    PurchasingOrganization: oPOData.PurchasingOrganization,
                    PurchasingGroup: oPOData.PurchasingGroup,
                    PurchaseOrderDate: oPOData.PurchaseOrderDate,
                    DocumentCurrency: oPOData.DocumentCurrency,
                    ExchangeRate: oPOData.ExchangeRate,
                    ExchangeRateIsFixed: oPOData.ExchangeRateIsFixed,
                    ValidityStartDate: oPOData.ValidityStartDate,
                    ValidityEndDate: oPOData.ValidityEndDate,
                    SupplierQuotationExternalID: oPOData.SupplierQuotationExternalID,
                    PurchasingCollectiveNumber: oPOData.PurchasingCollectiveNumber,
                    SupplierRespSalesPersonName: oPOData.SupplierRespSalesPersonName,
                    SupplierPhoneNumber: oPOData.SupplierPhoneNumber,
                    SupplyingSupplier: oPOData.SupplyingSupplier,
                    SupplyingPlant: oPOData.SupplyingPlant,
                    IncotermsClassification: oPOData.IncotermsClassification,
                    CorrespncExternalReference: oPOData.CorrespncExternalReference,
                    IncotermsVersion: oPOData.IncotermsVersion,
                    IncotermsLocation1: oPOData.IncotermsLocation1,
                    IncotermsLocation2: oPOData.IncotermsLocation2,
                    AddressCityName: oPOData.AddressCityName,
                    AddressFaxNumber: oPOData.AddressFaxNumber,
                    AddressHouseNumber: oPOData.AddressHouseNumber,
                    AddressName: oPOData.AddressName,
                    AddressPostalCode: oPOData.AddressPostalCode,
                    AddressStreetName: oPOData.AddressStreetName,
                    AddressPhoneNumber: oPOData.AddressPhoneNumber,
                    AddressRegion: oPOData.AddressRegion,
                    AddressCountry: oPOData.AddressCountry,
                    AddressCorrespondenceLanguage: oPOData.AddressCorrespondenceLanguage
                };
                
                // Remove undefined/null values
                Object.keys(oUpdatePayload).forEach(key => {
                    if (oUpdatePayload[key] === undefined || oUpdatePayload[key] === null) {
                        delete oUpdatePayload[key];
                    }
                });
                
                try {
                    // Call the update method with only updatable fields
                    const oUpdatedData = await this.updateDataToServer(sPath, oUpdatePayload);
                    
                    // Show success message
                    MessageToast.show("Purchase Order" + sPurchaseOrder + " updated successfully");
                    
                    // Navigate back to the order details view
                    this.getRouter().navTo("orderdetails", {
                        purchaseOrder: sPurchaseOrder
                    });
                    
                } catch (oError) {
                    console.error("Error updating purchase order:", oError);
                    
                    // Show error message
                    MessageBox.error("Failed to update Purchase Order: " + 
                        (oError.message || oError.responseText || "Unknown error"));
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
            _onValueHelpClose: function (oEvent) { ser678
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