sap.ui.define(["demo/controller/BaseController",

    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
    "sap/ui/core/Fragment"

], function (BaseController, Filter, JSONModel, MessageToast, Fragment) {
    "use strict";
    return BaseController.extend("demo.controller.OrderDetails", {

        onInit: function () {
            this.getRouter().getRoute("orderdetails").attachPatternMatched(this._attachRoteMatched, this);
             const oEditModel = new JSONModel({
                    editMode: false
                });
                this.getView().setModel(oEditModel, "editModel");
        }
        ,
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

            const oPOdetailModel = new JSONModel(myModel);
            this.setModel(oPOdetailModel, "poDetails");
            console.log(oPOdetailModel);

            const siUrl = "/A_PurchaseOrderItem";
            let aFilters1 = [];
            aFilters1.push(new Filter("PurchaseOrder", "EQ", sPOnum));
            const oModel1 = await this.getDataFromServer(siUrl, {}, aFilters1);

            console.log("Raw data from server:", oModel1);
            console.log("Results array:", oModel1.results);
            console.log("First item:", oModel1.results ? oModel1.results[0] : "No results");

            const oPOdetailModel1 = new JSONModel(oModel1);
            this.getView().setModel(oPOdetailModel1, "poItems");

            //  console.log("Model set. Data:", oPOdetailModel1.getData());
            //  console.log("Number of items:", oModel1.results ? oModel1.results.length : 0);

            debugger;

        } ,
       
        onListItemPress: function (oEvent) {

            const oContext = oEvent.getSource().getBindingContext("poItems");
            const sPath = oContext.getPath();
            const oData = oContext.getObject();

            console.log("Path:", sPath);           // /results/0
            console.log("Data:", oData);           // { PurchaseOrder: "...", PurchaseOrderItem: "..." }
            console.log("PO:", oData.PurchaseOrder);

            debugger;
            this.getRouter().navTo("orderlist", {
                purchaseOrder: oData.PurchaseOrder
            })
        },
        
        onItemPress: function (oEvent) {
            // Get the binding context of the pressed item
            const oContext = oEvent.getSource().getBindingContext("poItems");
            const oData = oContext.getObject();

            console.log("Table Item Pressed - Data:", oData);
            console.log("Purchase Order:", oData.PurchaseOrder);
            console.log("Purchase Order Item:", oData.PurchaseOrderItem);
            console.log("Material:", oData.Material);

            // Navigate to item details page or perform action
            // You can customize this navigation based on your requirements
            
            // Example 1: Navigate to a specific item details route
            // this.getRouter().navTo("itemdetails", {
            //     purchaseOrder: oData.PurchaseOrder,
            //     purchaseOrderItem: oData.PurchaseOrderItem
            // });
            
            // Example 2: Show item details in a dialog/popover
            // this._showItemDetailsDialog(oData);
            
            // Example 3: Navigate to a different function/page
            this.getRouter().navTo("orderlist", {
                purchaseOrder: oData.PurchaseOrder
            });
            
            debugger;
        },
        _onEditPress: async function (oEvent) {
             debugger;
                
                // Get the edit model
                const oEditModel = this.getView().getModel("editModel");
                const bCurrentEditMode = oEditModel.getProperty("/editMode");
                
                // Toggle edit mode
                oEditModel.setProperty("/editMode", !bCurrentEditMode);
                const oButton = oEvent.getSource();
                if (!bCurrentEditMode) {
                    oButton.setText("Save");
                    oButton.setIcon("sap-icon://save");
                    debugger;
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
                // console.log(oEvent);
                // const sUrl = "/A_PurchaseOrder";
                // let aFilters = [];
                // aFilters.push(new Filter("PurchaseOrder", "EQ",  this.poNum));
                // const oModel = await this.getDataFromServer(sUrl, {}, aFilters);
                // const myModel = oModel.results[0];

                // const oPOdetailModel = new JSONModel(myModel);
                // this.setModel(oPOdetailModel, "poDetails");
                // console.log(oPOdetailModel);
                
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
                    Supplier: oPOData.Supplier,
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
                const oEditButton = this.byId("editButton1");
                oEditButton.setText("Edit");
                oEditButton.setIcon("sap-icon://edit");
                
                // Reload the original data to discard changes
                // const sPOnum = this.getView().getModel("poListItems").getProperty("/PurchaseOrder");
                // if (sPOnum) {
                //     this._getDealData(sPOnum);
                // }
                
                MessageToast.show("Changes discarded");
            },

              _onSupplierValueHelpRequest: async function (oEvent) {
                // Store the input that triggered the dialog
                debugger;
                this._oInput = oEvent.getSource();
                
                var sInputValue = this._oInput.getValue();
                var oView = this.getView();

                try {

                    const sUrl = "/A_BusinessPartner";
                    let aFilters = [];
                    const oParams = {};
                    const oData = await this.getDataFromNamedModel("supplierModel", sUrl, oParams, aFilters);
                    debugger;    
                    console.log(oData);
                    const oModel = new JSONModel(oData);
                    oView.setModel(oModel, "supplierCodes");
                
                }
                catch(error){
                        console.log(error);
                }

                // If dialog doesn't exist, create it
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                       
                        id: oView.getId(),
                        name: "demo.fragments.SupplierValueHelpDialog", // Change this to your actual fragment name
                        controller: this
                    }).then(function (oDialog) {
                        debugger;
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
                     if (this._oInput) {
                    this._oInput.setValue(oSelectedItem.getTitle());
                }
                }

            },


    );
}, [])