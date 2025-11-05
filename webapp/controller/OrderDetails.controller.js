sap.ui.define(["demo/controller/BaseController",

    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"

], function (BaseController, Filter, JSONModel) {
    "use strict";
    return BaseController.extend("demo.controller.OrderDetails", {

        onInit: function () {
            this.getRouter().getRoute("orderdetails").attachPatternMatched(this._attachRoteMatched, this);
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
        }


    });
}, [])