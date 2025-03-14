sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"],
  function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("logistic-flow.controller.MainView", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
      },

      onNavigateBPPreparation: function () {
        console.log("Navigating to: BP-Preparation");
        this.oRouter.navTo("BP-Preparation");
      },

      onNavigateInfoProduit: function () {
        console.log("Navigating to: InformationsProduit");
        this.oRouter.navTo("InformationsProduit");
      },

      onSelectOption: function (oEvent) {
        var sTargetRoute = oEvent.getSource().data("key");

        if (sTargetRoute) {
          console.log("Navigating to:", sTargetRoute);
          this.oRouter.navTo(sTargetRoute);
        } else {
          console.warn("No route found for selected option.");
        }
      },
    });
  }
);
