sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, UIComponent, History, MessageToast, Sorter, JSONModel) {
    "use strict";

    return Controller.extend("logistic-flow.controller.BP-DoJour", {
      onInit: function () {
        console.log("BP-DoJour.controller.js caricato correttamente!");
        this.oRouter = UIComponent.getRouterFor(this);

        // Proviamo a recuperare il modello predefinito
        var oModel = this.getView().getModel();

        // Se non esiste, creiamo un JSONModel con i dati di esempio
        if (!oModel) {
          var aData = [
            {
              BP: "10879",
              CodeClient: "12345",
              NomClient: "GCI GRIS S7037 VM16/D IHBE",
              Status: "valid",
              date: "01 01 2023",
            },
            {
              BP: "11148",
              CodeClient: "12345",
              NomClient: "GCI BEIGE S1013 VM16/D IHBE",
              Status: "valid",
              date: "02 01 2023",
            },
            {
              BP: "11152",
              CodeClient: "12345",
              NomClient: "GCVN ORANGE X20000 VB40 IH ANGE X20000 ...",
              Status: "valid",
              date: "10 01 2023",
            },
            {
              BP: "17969",
              CodeClient: "12345",
              NomClient: "GCI NOIR S9005 NC VB40 IHBE",
              Status: "valid",
              date: "01 01 2023",
            },
            {
              BP: "18136",
              CodeClient: "12345",
              NomClient: "GCI VERT X50000 VM13 IHBE",
              Status: "valid",
              date: "03 01 2023",
            },
            {
              BP: "10879",
              CodeClient: "12345",
              NomClient: "GCI GRIS S7037 VM16/D IHBE",
              Status: "valid",
              date: "01 01 2023",
            },
            {
              BP: "11148",
              CodeClient: "12345",
              NomClient: "GCI BEIGE S1013 VM16/D IHBE",
              Status: "valid",
              date: "02 01 2023",
            },
            {
              BP: "11152",
              CodeClient: "12345",
              NomClient: "GCVN ORANGE X20000 VB40 IH ANGE X20000 ...",
              Status: "valid",
              date: "10 01 2023",
            },
            {
              BP: "17969",
              CodeClient: "12345",
              NomClient: "GCI NOIR S9005 NC VB40 IHBE",
              Status: "valid",
              date: "01 01 2023",
            },
            {
              BP: "18136",
              CodeClient: "12345",
              NomClient: "GCI VERT X50000 VM13 IHBE",
              Status: "valid",
              date: "03 01 2023",
            },
            {
              BP: "10879",
              CodeClient: "12345",
              NomClient: "GCI GRIS S7037 VM16/D IHBE",
              Status: "valid",
              date: "01 01 2023",
            },
            {
              BP: "11148",
              CodeClient: "12345",
              NomClient: "GCI BEIGE S1013 VM16/D IHBE",
              Status: "valid",
              date: "02 01 2023",
            },
            {
              BP: "11152",
              CodeClient: "12345",
              NomClient: "GCVN ORANGE X20000 VB40 IH ANGE X20000 ...",
              Status: "valid",
              date: "10 01 2023",
            },
            {
              BP: "17969",
              CodeClient: "12345",
              NomClient: "GCI NOIR S9005 NC VB40 IHBE",
              Status: "valid",
              date: "01 01 2023",
            },
            {
              BP: "18136",
              CodeClient: "12345",
              NomClient: "GCI VERT X50000 VM13 IHBE",
              Status: "valid",
              date: "03 01 2023",
            },
          ];

          oModel = new JSONModel({
            BPRechercheData: aData,
          });
          this.getView().setModel(oModel);
        }

        // Salviamo una copia dei dati originali (per il reset)
        this._aOriginalData = JSON.parse(
          JSON.stringify(oModel.getProperty("/BPRechercheData"))
        );
      },

      /*--------------------------------------------
      |  Navigazione
      ---------------------------------------------*/
      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.oRouter.navTo("MainView", {}, true);
        }
      },

      onShowMessage: function () {
        MessageToast.show("Azione eseguita correttamente in BP-DoJour!");
      },
      /*--------------------------------------------
      |  Open Date Filter Popover
      ---------------------------------------------*/
      onOpenDateFilter: function (oEvent) {
        // Get the popover by ID
        var oPopover = this.getView().byId("dateFilterPopover");

        // Check if the Popover exists
        if (!oPopover) {
          MessageToast.show("Popover non trovato.");
          return;
        }

        // Open the Popover relative to the button that triggered the event
        oPopover.openBy(oEvent.getSource());
      },
      /*--------------------------------------------
      |  Ricerca / Filtraggio
      ---------------------------------------------*/
      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue");
        // Esempio: se vuoi filtrare i dati localmente, puoi usare un Filter
        console.log("Ricerca in corso per:", sQuery);
      },

      /*--------------------------------------------
      |  Sorting
      ---------------------------------------------*/

      // Pulsante: Ordina in ASC
      onSortAsc: function () {
        var oTable = this.byId("bpTable");
        var oBinding = oTable.getBinding("items");
        // Applichiamo uno sorter ascendente sulla "date"
        var oSorter = this._createDateSorter(false);
        oBinding.sort([oSorter]);
      },

      // Pulsante: Ordina in DESC
      onSortDesc: function () {
        var oTable = this.byId("bpTable");
        var oBinding = oTable.getBinding("items");
        // Applichiamo uno sorter discendente sulla "date"
        var oSorter = this._createDateSorter(true);
        oBinding.sort([oSorter]);
      },

      // Pulsante: Reset Sorting -> disabilita il sort e ripristina i dati originali
      onSortReset: function () {
        var oModel = this.getView().getModel();
        var oTable = this.byId("bpTable");
        var oBinding = oTable.getBinding("items");

        // Rimuove eventuali sorters attivi
        oBinding.sort(null);

        // Reimposta i dati originali (quelli del BE)
        oModel.setProperty(
          "/BPRechercheData",
          JSON.parse(JSON.stringify(this._aOriginalData))
        );
      },

      // Sorter personalizzato sul campo "date" (formato "DD MM YYYY")
      _createDateSorter: function (bDescending) {
        var oSorter = new Sorter("date", bDescending);

        oSorter.fnCompare = function (a, b) {
          var aParts = a.split(" "); // es: ["01","01","2023"]
          var bParts = b.split(" ");

          var aDate = new Date(
            parseInt(aParts[2], 10),
            parseInt(aParts[1], 10) - 1,
            parseInt(aParts[0], 10)
          );
          var bDate = new Date(
            parseInt(bParts[2], 10),
            parseInt(bParts[1], 10) - 1,
            parseInt(bParts[0], 10)
          );

          if (aDate < bDate) return -1;
          if (aDate > bDate) return 1;
          return 0;
        };

        return oSorter;
      },

      /*--------------------------------------------
      |  Selezione riga
      ---------------------------------------------*/
      onRowSelect: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var oSelectedData = oContext.getObject();
        MessageToast.show("Selezionato BP: " + oSelectedData.BP);
      },

      /*--------------------------------------------
      |  Bottoni di azione
      ---------------------------------------------*/
      onCancel: function () {
        MessageToast.show("Operazione annullata");
      },

      onValidate: function () {
        MessageToast.show("Dati validati con successo");
      },
    });
  }
);
