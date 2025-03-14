sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, UIComponent, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("logistic-flow.controller.InformationsProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);

        // Creazione del modello JSON con i dati dinamici
        var oData = {
          Code: "1342",
          Description:
            "LPAL120*120 NON EUROPE COMPLETE METRE DOC RECAP DES PRUDIOTS SUR CHAQUE PALETTE RESPECTER ... PAL120*120 NON EUROPE COMPLETE METRE DOC RECAP DES PRUDIOTS SUR CHAQUE PALETTE RESPECTER ...",
          Conditionnement: "SXP",
          Pallette: "Non attribué",
          Lot: "433244543",
        };

        // Creazione e assegnazione del modello alla View
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "model");
      },

      onNavBack: function () {
        var oView = this.getView();
        var aInputIds = ["productInput"];

        var bFieldFilled = aInputIds.some(function (sId) {
          var oInput = oView.byId(sId);
          return oInput && oInput.getValue && oInput.getValue().trim() !== "";
        });

        if (bFieldFilled) {
          MessageBox.show(
            this.getView()
              .getModel("i18n")
              .getResourceBundle()
              .getText("confirmExit"),
            {
              icon: MessageBox.Icon.WARNING,
              title: this.getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("confirmTitle"),
              actions: ["Oui", "Non"],
              emphasizedAction: "Oui",
              onClose: function (sAction) {
                if (sAction === "Oui") {
                  this.oRouter.navTo("MainView", {}, true);
                }
              }.bind(this),
            }
          );
        } else {
          this.oRouter.navTo("MainView", {}, true);
        }
      },
    });
  }
);
