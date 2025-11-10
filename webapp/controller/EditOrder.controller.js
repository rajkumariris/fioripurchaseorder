

sap.ui.define(["demo/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],

    function (BaseController, Filter, JSONModel, Fragment, FilterOperator, MessageToast, MessageBox) {
        "use strict";
        return BaseController.extend("demo.controller.EditOrder", {
            onInit: function () {

                this.getRouter().getRoute("editorder").attachPatternMatched(this._attachRoteMatched, this);

            },
            _attachRoteMatched: function (oEvent) {

                const sPOnum = oEvent.getParameter("arguments").purchaseOrder;
                this._getDealData(sPOnum);
            },
            _getDealData: async function (sPOnum) {

                const sUrl = "/A_PurchaseOrder";
                let aFilters = [];
                aFilters.push(new Filter("PurchaseOrder", "EQ", sPOnum));
                const oModel = await this.getDataFromServer(sUrl, {}, aFilters);
                const myModel = oModel.results[0];
                debugger;
                const oPOdetailModel = new JSONModel(myModel);
                this.setModel(oPOdetailModel, "poDetails");
            },
            onSaveButtonPress: async function (oEvent) {
                debugger;
                
                // Get the purchase order data from the model
                const oPOData = this.getModel("poDetails").getData();
                
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
                    MessageToast.show("Purchase Order " + sPurchaseOrder + " updated successfully");
                    
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
            }
            ,
            _onPoValueHelpRequest: async function (oEvent) {
                // Store the input that triggered the dialog
               
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
    })