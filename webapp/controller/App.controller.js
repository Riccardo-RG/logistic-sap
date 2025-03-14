sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"],
  function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("logistic-flow.controller.App", {
      onInit: function () {
        var oRouter = UIComponent.getRouterFor(this);
        var oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "routeModel");

        oRouter.attachRoutePatternMatched(function (oEvent) {
          var sRouteName = oEvent.getParameter("name");
          oModel.setProperty("/currentRoute", sRouteName);
        });
      },
    });
  }
);
