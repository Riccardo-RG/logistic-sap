sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (Controller, UIComponent, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("logistic-flow.controller.PrepareProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
        console.log(this.oRouter); // ✅ Debugging router

        this.oRouter
          .getRoute("PrepareProduit")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        this.sIdDelivery = oArgs.IdDelivery || "";
      },

      onInputChange: function (oEvent) {
        var sValue = oEvent.getSource().getValue(); // ✅ Correct value extraction
        var oButton = this.byId("nextButtonBatch");

        var isValidNumber = !isNaN(sValue) && sValue.trim().length > 0;
        oButton.setEnabled(isValidNumber);
      },

      onSuivantPress: function () {
        var oInput = this.byId("productInputCode");
        var sValue = oInput.getValue();

        if (!sValue || isNaN(sValue) || sValue.trim().length === 0) {
          MessageToast.show(
            "⚠️ Veuillez entrer une valeur valide avant de continuer."
          );
          return;
        }

        if (this.sIdDelivery) {
          this.oRouter.navTo("Batch", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          this.oRouter.navTo("Batch");
        }
      },

      onNavBack: function () {
        var oInput = this.byId("productInputCode");
        var sValue = oInput.getValue();

        if (sValue && sValue.trim().length > 0) {
          MessageBox.show(
            "Des données ont été saisies dans le champ produit. Êtes-vous sûr de vouloir revenir en arrière ?",
            {
              icon: MessageBox.Icon.WARNING,
              title: "Attention",
              actions: ["Oui", "Non"],
              emphasizedAction: "Oui",
              onClose: function (sAction) {
                if (sAction === "Oui") {
                  if (this.sIdDelivery) {
                    this.oRouter.navTo("BP-RechercheProduit", {
                      IdDelivery: this.sIdDelivery,
                    });
                  } else {
                    MessageToast.show("⚠️ Aucun IdDelivery trouvé.");
                  }
                }
              }.bind(this),
            }
          );
        } else {
          if (this.sIdDelivery) {
            this.oRouter.navTo("BP-RechercheProduit", {
              IdDelivery: this.sIdDelivery,
            });
          } else {
            MessageToast.show("⚠️ Aucun IdDelivery trouvé.");
          }
        }
      },
    });
  }
);
