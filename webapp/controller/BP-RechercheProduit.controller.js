sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    UIComponent,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-RechercheProduit", {
      onInit: function () {
        this.oRouter = UIComponent.getRouterFor(this);
        this.oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();

        this.oRouter
          .getRoute("BP-RechercheProduit")
          .attachPatternMatched(this._onRouteMatched, this);

        var oViewModel = new JSONModel({
          searchPlaceholder: this.oResourceBundle.getText(
            "searchPlaceholderCode"
          ),
          inputType: "Text",
          BPRechercheData: [],
          selectedFilter: "MaterialCode",
        });
        this.getView().setModel(oViewModel, "BPData");
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        this.sIdDelivery = this._formatIdDelivery(oArgs.IdDelivery);

        if (!this.getView().getModel("ODataModel")) {
          this.oODataModel = new sap.ui.model.odata.v2.ODataModel(
            "/sap/opu/odata/sap/ZPP_WSM_SRV/",
            {
              defaultBindingMode: "TwoWay",
              useBatch: false,
              defaultCountMode: "Inline",
            }
          );
          this.getView().setModel(this.oODataModel, "ODataModel");
        }

        if (this.sIdDelivery) {
          this._loadBPData();
        }
      },

      _loadBPData: function () {
        var oModel = this.getView().getModel("ODataModel");
        if (!oModel) {
          MessageToast.show(
            this.oResourceBundle.getText("errorODataNotInitialized")
          );
          return;
        }

        var sFilter = "IdDelivery eq '" + this.sIdDelivery + "'";

        oModel.read("/ZET_BP_POSITIONSet", {
          urlParameters: { $filter: sFilter },
          success: function (oData) {
            if (!oData || !oData.results || oData.results.length === 0) {
              MessageToast.show(
                this.oResourceBundle.getText("warningNoData") +
                  " " +
                  this.sIdDelivery
              );
              return;
            }

            var oBPJsonModel = this.getView().getModel("BPData");
            oBPJsonModel.setProperty("/BPRechercheData", oData.results);
          }.bind(this),
          error: function (oError) {
            MessageToast.show(this.oResourceBundle.getText("errorODataFetch"));
          },
        });
      },

      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue") || "";
        var oTable = this.getView().byId("bpTableProduit");
        var oBinding = oTable.getBinding("items");
        var oViewModel = this.getView().getModel("BPData");
        var sFilterField = oViewModel.getProperty("/selectedFilter");

        var aFilters = [];
        if (sQuery.trim()) {
          aFilters.push(
            new Filter(sFilterField, FilterOperator.Contains, sQuery)
          );
        }
        oBinding.filter(aFilters);
      },

      onSelectionChange: function (oEvent) {
        var iSelectedIndex = oEvent.getParameter("selectedIndex");
        var oViewModel = this.getView().getModel("BPData");

        var sPlaceholder =
          iSelectedIndex === 0
            ? this.oResourceBundle.getText("searchPlaceholderCode")
            : this.oResourceBundle.getText("searchPlaceholderLabel");
        var sFilterField =
          iSelectedIndex === 0 ? "MaterialCode" : "MaterialDescription";

        oViewModel.setProperty("/searchPlaceholder", sPlaceholder);
        oViewModel.setProperty("/selectedFilter", sFilterField);

        this.getView().byId("bpSearchFieldProduit").setValue("");
        this.onSearch({ getParameter: () => "" });
      },

      _formatIdDelivery: function (sId) {
        return sId ? sId.padStart(10, "0") : "0000000000";
      },

      onNavBack: function () {
        this.oRouter.navTo("BP-Preparation");
      },

      onAdvance: function () {
        if (this.sIdDelivery) {
          this.oRouter.navTo("PrepareProduit", {
            IdDelivery: this.sIdDelivery,
          });
        } else {
          MessageToast.show(
            this.oResourceBundle.getText("warningNoIdDelivery")
          );
        }
      },
    });
  }
);
