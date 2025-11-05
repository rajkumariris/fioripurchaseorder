sap.ui.define([
    "demo/controller/BaseController"
    , "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("demo.controller.PlannerApp", {
        onInit() {
                
                this.getRouter().getRoute("RoutePlannerApp").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function () {
             
           console.log("planner app");
           this._getDealData([]);
        //    this._setFilterModel();
        }
        ,
        _getDealData: async function(aFilters){
           
          const sUrl = "/A_PurchaseOrder";
          try {
          const oData = await this.getDataFromServer(sUrl, {}, aFilters);
          const oModel = new JSONModel(oData);
          this.setModel(oModel, "purchaseOrder");
          console.log(oData);
          }
          catch(oError){
            console.log(oError);
          }
        },

        onRowSelectionChange : function(oEvent){
          const sPath =  oEvent.getParameter("rowContext").sPath;
          const oSelectedItem= this.getModel("purchaseOrder").getProperty(sPath);
          
          this.getRouter().navTo("orderdetails",{
            purchaseOrder:oSelectedItem.PurchaseOrder
          })
            
              console.log(oSelectedItem);
        },
        /**
         * Example: read A_PurchaseOrder entity set from the OData service configured as the 'purchaseOrder' model
         */
        onLoadPurchaseOrders: function () {
            var oModel = this.getView().getModel("purchaseOrder");
            if (!oModel) {
                console.error("purchaseOrder model not found. Ensure it's configured in manifest.json");
                return;
            }

            oModel.read("A_PurchaseOrder", {
                urlParameters: {
                    "$top": 10
                },
                success: function (oData) {
                    console.log("Purchase orders:", oData);
                },
                error: function (oError) {
                    console.error("Error reading purchase orders:", oError);
                }
            });
        }
    });
});