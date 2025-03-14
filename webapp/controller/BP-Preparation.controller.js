sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    ODataModel,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox
  ) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-Preparation", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
        this.oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        this.oODataModel = new ODataModel("/sap/opu/odata/sap/ZPP_WSM_SRV/", {
          defaultBindingMode: "TwoWay",
          useBatch: false,
          defaultCountMode: "Inline",
        });
        this.getView().setModel(this.oODataModel, "ODataModel");

        this.oODataModel.metadataLoaded().then(
          function () {
            console.log("✅ Metadati OData caricati correttamente!");

            this.oODataModel.read("/ZET_BP_HEADERSet", {
              success: function (oData) {
                console.log("✅ Dati ricevuti:", oData);

                if (!oData || !Array.isArray(oData.results)) {
                  console.error(
                    "❌ " + this.oResourceBundle.getText("errorInvalidOData")
                  );
                  return;
                }

                var oBPJsonModel = new JSONModel({
                  results: oData.results,
                  filteredResults: oData.results,
                });

                this.getView().setModel(oBPJsonModel, "BPData");
                console.log(
                  "✅ Modello BPData impostato:",
                  oBPJsonModel.getData()
                );
              }.bind(this),
              error: function (oError) {
                MessageBox.error(
                  this.oResourceBundle.getText("errorODataFetch")
                );
                console.error(
                  "❌ " + this.oResourceBundle.getText("errorODataFetch"),
                  oError
                );
              },
            });
          }.bind(this)
        );

        this.oRouter.attachRoutePatternMatched(
          this._onRoutePatternMatched,
          this
        );
      },

      _onRoutePatternMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name");
        if (sRouteName === "BP-Preparation") {
          var oIconTabBar = this.byId("globalIconTabBar");
          if (oIconTabBar) {
            oIconTabBar.setSelectedKey("tab1");
          }
        }
      },

      onGlobalTabSelect: function (oEvent) {
        var sSelectedKey = oEvent.getParameter("selectedKey");
        console.log("Tab selezionato: " + sSelectedKey);

        if (sSelectedKey === "tab1") {
          this.oRouter.navTo("BP-Preparation");
        } else if (sSelectedKey === "tab2") {
          if (!this.sSelectedIdDelivery) {
            MessageToast.show(this.oResourceBundle.getText("warningSelectBP"));
            this.byId("globalIconTabBar").setSelectedKey("tab1");
            return;
          }
          var sFormattedId = this._formatIdDelivery(this.sSelectedIdDelivery);
          this.oRouter.navTo("BP-RechercheProduit", {
            IdDelivery: sFormattedId,
          });
        } else if (sSelectedKey === "tab3") {
          this.oRouter.navTo("Manage"); // ✅ Modificata navigazione per il Tab3
        }
      },

      onNavBack: function () {
        this.oRouter.navTo("MainView", {}, true);
      },

      onBPSelected: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("listItem");
        var oContext = oSelectedItem.getBindingContext("BPData");

        if (!oContext) {
          MessageToast.show(
            this.oResourceBundle.getText("errorNoDataSelected")
          );
          return;
        }

        this.sSelectedIdDelivery = oContext.getProperty("IdDelivery");
        console.log("BP selezionato: " + this.sSelectedIdDelivery);

        var oSuivantButton = this.getView().byId("idSUIVANTButton");
        if (oSuivantButton) {
          oSuivantButton.setEnabled(true);
        }

        var oCustomerDetailButton = this.getView().byId("idCustomerDetail");
        if (oCustomerDetailButton) {
          oCustomerDetailButton.setVisible(true);
        }
      },

      onNextBP: function () {
        if (!this.sSelectedIdDelivery) {
          MessageToast.show(this.oResourceBundle.getText("warningSelectBP"));
          return;
        }

        var sFormattedId = this._formatIdDelivery(this.sSelectedIdDelivery);
        this.oRouter.navTo("BP-RechercheProduit", { IdDelivery: sFormattedId });
      },

      onDetailDuClient: function () {
        this.oRouter.navTo("DetailDuClient");
      },

      onTestF4Press: function () {
        this.oRouter.navTo("BP-DoJour");
      },

      onSearchBP: function (oEvent) {
        var sQuery =
          oEvent.getParameter("value") || oEvent.getSource().getValue();
        var oModel = this.getView().getModel("BPData");

        if (!oModel) return;

        var aResults = oModel.getProperty("/results") || [];
        var aFiltered = aResults.filter(function (oItem) {
          return oItem.IdDelivery.includes(sQuery);
        });

        oModel.setProperty("/filteredResults", aFiltered);
        console.log("Filtrati:", aFiltered);
      },

      _formatIdDelivery: function (sId) {
        if (!sId) return "0000000000";
        return sId.padStart(10, "0");
      },
    });
  }
);
