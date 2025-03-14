sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
  ],
  function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("logistic-flow.controller.DetailDuClient", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
      },

      onNavBack: function () {
        this.oRouter.navTo("BP-Preparation", {}, true);
      },
    });
  }
);
