sap.ui.define(["sap/ui/core/mvc/Controller"
    , "sap/ui/core/UIComponent"
],
    function (Controller, UIComponent) {
        "use strict";
        return Controller.extend("demo.controller.BaseController", {
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },
            getDataFromServer: function (sUrl, oParams, aFilters) {
                
                return new Promise((resolve, reject) => {
                   
                    let model = this.getOwnerComponent().getModel();
                    let success = function (data) {
                       
                        resolve(data);
                    }
                    let error = function (error) {
                        reject(error);
                    }
                    model.read(sUrl, {
                        filters: aFilters,
                        urlParameters: oParams,
                        success: success,
                        error: error,
                        async :true
                        
                    });

                });
            },
            getDataFromNamedModel: function (sModelName, sUrl, oParams, aFilters) {
                
                return new Promise((resolve, reject) => {
                   
                    let model = this.getOwnerComponent().getModel(sModelName);
                    let success = function (data) {
                       
                        resolve(data);
                    }
                    let error = function (error) {
                        reject(error);
                    }
                    model.read(sUrl, {
                        filters: aFilters,
                        urlParameters: oParams,
                        success: success,
                        error: error,
                        async: true
                        
                    });

                });
            },
            updateDataToServer: function (sUrl, oData) {
                debugger;
                return new Promise((resolve, reject) => {
                    debugger;
                    let model = this.getOwnerComponent().getModel();
                    let success = function (data) {
                        debugger;
                        resolve(data);
                    }
                    let error = function (error) {
                        reject(error);
                    }
                    model.update(sUrl, oData, {
                        success: success,
                        error: error
                    });

                });
            },

            _valueHelpRequest : function(oEvent){
                debugger;
            }


        }
        )
    });