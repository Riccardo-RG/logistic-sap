sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, UIComponent, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend(
      "logistic-flow.controller.AjustementDesQuantitès",
      {
        onInit: function () {
          this.oRouter = UIComponent.getRouterFor(this);

          // Creazione del modello JSON con i dati iniziali
          var oData = {
            Produit: "GCI BLANC S9016 VB40 IHB",
            Liner: "OUI",
            UC: "2 x SEAU EXPORT 25KG",
            QtePreparer: "50.000",
            QteDejaPreparer: "49.500",
            Quantite: "",
            LotPropose: "",
            QteDuLot: "",
            Lot: "",
            NbCollis: "",
            NbBP: "",
          };

          // Creazione e assegnazione del modello alla View
          var oModel = new JSONModel(oData);
          this.getView().setModel(oModel, "model");
        },

        onNavBack: function () {
          var oView = this.getView();
          var aInputIds = [
            "inputQuantite",
            "inputLotPropose",
            "inputQteDuLot",
            "inputLot",
            "inputNbCollis",
            "inputNbBP",
          ];

          var bFieldFilled = aInputIds.some(function (sId) {
            var oInput = oView.byId(sId);
            return oInput && oInput.getValue && oInput.getValue().trim() !== "";
          });

          if (bFieldFilled) {
            MessageBox.confirm(
              this.getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("confirmExit"),
              {
                title: this.getView()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("confirmTitle"),
                onClose: function (oAction) {
                  if (oAction === MessageBox.Action.OK) {
                    this.oRouter.navTo("PrepareProduit", {}, true);
                  }
                }.bind(this),
              }
            );
          } else {
            this.oRouter.navTo("PrepareProduit", {}, true);
          }
        },
      }
    );
  }
);
