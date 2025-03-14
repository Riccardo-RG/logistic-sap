sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
  ],
  function (Controller, UIComponent, MessageBox, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("logistic-flow.controller.Batch", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
        this.oRouter
          .getRoute("Batch")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        this.sIdDelivery = oArgs.IdDelivery || "";

        if (!this.getView().getModel("ODataModel")) {
          this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
            defaultBindingMode: "TwoWay",
            useBatch: false,
            defaultCountMode: "Inline",
          });
          this.getView().setModel(this.oODataModel, "ODataModel");
        }
      },

      onValidate: function () {
        console.log("➡️ Continuer button pressed.");
        this._createMaterialDet();
      },
      onSubmit: function () {
        console.log("➡️ Fin traitement button pressed.");
        this._createMaterialDet();
      },

      _createMaterialDet: function () {
        var oView = this.getView();
        var sTipoImballo = oView.byId("tipoImballo").getValue();
        var sQtPick = oView.byId("qtPick").getValue();
        var sBatch = oView.byId("batch").getValue();
        var iIdCollo = parseInt(oView.byId("nbCollis").getText(), 10);
        var sIdDelivery = this.sIdDelivery || "0005113107";
        var sItem = "000001";
        var sUmQtPick = "KG";
        var fQtPick = parseFloat(sQtPick);

        if (!sTipoImballo || !sBatch || isNaN(fQtPick) || isNaN(iIdCollo)) {
          MessageBox.warning(sWarningMessage);
          return;
        }

        var sQtPickDec = fQtPick.toFixed(3);

        var oPayload = {
          IdDelivery: sIdDelivery,
          Item: sItem,
          IdCollo: iIdCollo,
          QtPick: sQtPickDec,
          UmQtPick: sUmQtPick,
          Batch: sBatch,
          TipoImballo: sTipoImballo,
        };

        console.log("📡 Invio richiesta OData con payload:", oPayload);

        var oModel = this.getView().getModel("ODataModel");
        if (!oModel) {
          MessageBox.error("❌ Errore: Modello OData non trovato.");
          return;
        }

        oModel.create("/ZET_MATERIAL_DETSet", oPayload, {
          success: function (oData, response) {
            MessageToast.show("✅ Dati inviati con successo!");
            console.log("✅ Risposta OData:", response);
          },
          error: function (oError) {
            MessageBox.error(
              "❌ Errore nell'invio dei dati. Dettagli nella console."
            );
            console.error("❌ Dettagli errore:", oError);

            if (oError.responseText) {
              try {
                var oErrorResponse = JSON.parse(oError.responseText);
                console.error("📌 Dettagli errore SAP:", oErrorResponse);
              } catch (e) {
                console.error(
                  "❌ Errore durante il parsing della risposta:",
                  e
                );
              }
            }
          },
        });
      },

      onNavBack: function () {
        if (this.sIdDelivery) {
          this.oRouter.navTo("PrepareProduit", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          this.oRouter.navTo("PrepareProduit");
        }
      },
    });
  }
);
