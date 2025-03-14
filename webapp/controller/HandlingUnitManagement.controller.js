sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "logistic-flow/utils/ProduitFormatter",
  ],
  function (
    Controller,
    MessageToast,
    JSONModel,
    History,
    UIComponent,
    ProduitFormatter
  ) {
    "use strict";

    return Controller.extend(
      "logistic-flow.controller.HandlingUnitManagement",
      {
        onInit: function () {
          var oModel = new JSONModel();

          // Carica i dati in modo asincrono
          oModel.loadData("model/data.json");

          oModel.attachRequestCompleted(
            function (oEvent) {
              if (!oEvent.getParameter("errorObject")) {
                var oData = oModel.getData();

                // ✅ Aggiunta di DisplayPalette e DisplayBox per la concatenazione
                oData.Produits.forEach(function (oItem) {
                  oItem.DisplayPalette =
                    (oItem.PaletteId ? oItem.PaletteId : "") +
                    " - " +
                    (oItem.Palette ? oItem.Palette : "");
                  oItem.DisplayBox =
                    (oItem.BoxId ? oItem.BoxId : "") +
                    " - " +
                    (oItem.Box ? oItem.Box : "");

                  oItem.PaletteVisible = ProduitFormatter.isValueVisible(
                    oItem.Palette
                  );
                  oItem.PaletteButtonVisible = ProduitFormatter.isButtonVisible(
                    oItem.Palette
                  );
                  oItem.BoxVisible = ProduitFormatter.isValueVisible(oItem.Box);
                  oItem.BoxButtonVisible = ProduitFormatter.isButtonVisible(
                    oItem.Box
                  );
                  oItem.OrderReturn = ProduitFormatter.getReturnOrderNumber(
                    oItem.isReturnable,
                    oItem.ReturnNo,
                    oItem.OrderNo
                  );
                });

                // Aggiunta dei dati delle Palette e dei Box al modello
                oData.Palettes = [
                  {
                    Id: "P001",
                    Name: "Pallette_1",
                    Type: "120x80",
                    DisplayPalette: "P001 - Pallette_1",
                  },
                  {
                    Id: "P002",
                    Name: "Pallette_1",
                    Type: "120x80",
                    DisplayPalette: "P002 - Pallette_1",
                  },
                  {
                    Id: "P003",
                    Name: "Pallette_2",
                    Type: "100x120",
                    DisplayPalette: "P003 - Pallette_2",
                  },
                  {
                    Id: "P004",
                    Name: "Pallette_3",
                    Type: "110x90",
                    DisplayPalette: "P004 - Pallette_3",
                  },
                ];

                oData.Boxes = [
                  {
                    Id: "B001",
                    Name: "Box id: 1",
                    Type: "Small",
                    DisplayBox: "B001 - Box_1",
                  },
                  {
                    Id: "B001",
                    Name: "Box id: 2",
                    Type: "Small",
                    DisplayBox: "B001 - Box_1",
                  },
                ];

                oModel.setData(oData);
                this.getView().setModel(oModel, "modelName");

                console.log(
                  "Modello 'modelName' assegnato con dati pre-elaborati:",
                  oModel.getData()
                );
              } else {
                console.error("Errore nel caricamento di model/data.json");
              }
            }.bind(this)
          );
        },

        onNavBack: function () {
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("BP-RechercheProduit", {}, true);
          }
        },

        onRefresh: function () {
          MessageToast.show("Dati ricaricati!");
        },

        onOpenModal: function (oEvent) {
          var oView = this.getView();

          if (!this.oDialog) {
            this.oDialog = oView.byId("idPaletteBoxDialog");
          }

          if (!this.oDialog) {
            this.oDialog = sap.ui.xmlfragment(
              oView.getId(),
              "logistic-flow.view.PaletteBoxDialog",
              this
            );
            oView.addDependent(this.oDialog);
          }

          this.oDialog.open();
        },

        onDialogConfirm: function () {
          MessageToast.show("Elemento selezionato!");
          this.oDialog.close();
        },

        onCloseDialog: function () {
          this.oDialog.close();
        },

        onOpenManagePalletteDialog: function () {
          if (!this.oManagePalletteDialog) {
            this.oManagePalletteDialog = this.getView().byId(
              "idManagePalletteDialog"
            );
          }
          this.oManagePalletteDialog.open();
        },

        onCloseManagePalletteDialog: function () {
          this.oManagePalletteDialog.close();
        },

        onConfirmManagePallette: function () {
          var oList = this.getView().byId("idAllPalletsList");
          var aSelectedItems = oList.getSelectedItems();
          var aSelectedPallets = [];

          // Recupera i pallet selezionati
          aSelectedItems.forEach(function (oItem) {
            var oContext = oItem.getBindingContext("modelName");
            aSelectedPallets.push(oContext.getObject());
          });

          // Salva nel modello (aggiungi qui la logica per usarli nella tabella)
          var oModel = this.getView().getModel("modelName");
          oModel.setProperty("/SelectedPallets", aSelectedPallets);

          // Chiudi la modale
          this.onCloseManagePalletteDialog();
        },
        onIncreasePallette: function (oEvent) {
          var oListItem = oEvent.getSource().getParent().getParent(); // Ottieni l'elemento della riga
          var oContext = oListItem.getBindingContext("modelName"); // Ottieni il contesto dati
          var oModel = this.getView().getModel("modelName");

          var oData = oContext.getObject();
          if (!oData.SelectedQuantity) {
            oData.SelectedQuantity = 0; // Imposta a zero se non è definito
          }

          oData.SelectedQuantity++; // Aumenta di 1
          oModel.refresh(); // Aggiorna la vista
        },

        onDecreasePallette: function (oEvent) {
          var oListItem = oEvent.getSource().getParent().getParent();
          var oContext = oListItem.getBindingContext("modelName");
          var oModel = this.getView().getModel("modelName");

          var oData = oContext.getObject();
          if (!oData.SelectedQuantity) {
            oData.SelectedQuantity = 0;
          }

          if (oData.SelectedQuantity > 0) {
            oData.SelectedQuantity--; // Diminuisci di 1 solo se maggiore di 0
          }

          oModel.refresh();
        },

        onOpenSelectionDialog: function (oEvent) {
          this._selectedProperty = oEvent
            .getSource()
            .getCustomData()[0]
            .getValue(); // "Box" o "Palette"
          if (!this._oSelectDialog) {
            this._oSelectDialog = this.byId("idSelectBoxPalletDialog");
          }
          this._oSelectDialog.open();
        },

        onSelectPallet: function (oEvent) {
          let selectedItem = oEvent.getParameter("listItem").getTitle();
          this._selectedPallet = selectedItem;
        },

        onSelectBox: function (oEvent) {
          let selectedItem = oEvent.getParameter("listItem").getTitle();
          this._selectedBox = selectedItem;
        },

        onConfirmSelection: function () {
          let oModel = this.getView().getModel("modelName");
          let oData = oModel.getData();

          if (this._selectedProperty === "Palette" && this._selectedPallet) {
            oData.SelectedPalette = this._selectedPallet;
          } else if (this._selectedProperty === "Box" && this._selectedBox) {
            oData.SelectedBox = this._selectedBox;
          }

          oModel.refresh();
          this._oSelectDialog.close();
        },

        onCloseSelectionDialog: function () {
          this._oSelectDialog.close();
        },
      }
    );
  }
);
