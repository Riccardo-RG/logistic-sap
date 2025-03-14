sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/Fragment",
    "logistic-flow/utils/ProduitFormatter",
    "sap/ui/core/theming/Parameters",
  ],
  function (
    UIComponent,
    JSONModel,
    ODataModel,
    Fragment,
    ProduitFormatter,
    Parameters
  ) {
    "use strict";

    return UIComponent.extend("logistic-flow.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        var oRouter = this.getRouter();
        if (oRouter) {
          oRouter.initialize();
          this.getRootControl()
            .loaded()
            .then(() => {
              console.log("✅ RootView caricata:", this.getRootControl());

              var oNavContainer = this.getRootControl().byId("navContainer");
              if (oNavContainer) {
                console.log("✅ NavContainer trovato:", oNavContainer);
              } else {
                console.error("❌ NavContainer NON trovato!");
              }

              if (!window.location.hash || window.location.hash === "#") {
                oRouter.navTo("MainView", {}, true);
              }
            });
        } else {
          console.error("❌ Router non inizializzato correttamente.");
        }

        // Caricare il CSS personalizzato in modo più affidabile
        this._loadCustomCSS();

        console.log("ProduitFormatter caricato:", ProduitFormatter);

        // Gestire il GlobalTabBar
        this._handleGlobalTabBar();
      },

      _loadCustomCSS: function () {
        var sCustomCssPath = jQuery.sap.getModulePath(
          "logistic-flow",
          "/css/style.css"
        );
        jQuery.sap.includeStyleSheet(sCustomCssPath);
        console.log("✅ CSS personalizzato caricato:", sCustomCssPath);
      },

      _handleGlobalTabBar: function () {
        var oRootControl = this.getRootControl();
        var oNavContainer = oRootControl && oRootControl.byId("navContainer");
        if (oNavContainer) {
          oNavContainer.attachAfterNavigate(function (oEvent) {
            var oPage = oEvent.getParameter("to");
            if (
              oPage &&
              (!oPage.getSubHeader() ||
                !oPage.getSubHeader().getId().includes("GlobalTabBar"))
            ) {
              Fragment.load({
                name: "logistic-flow.fragment.GlobalTabBar",
                controller: this,
              }).then(function (oGlobalTabBar) {
                oPage.setSubHeader(oGlobalTabBar);
              });
            }
          }, this);
        } else {
          console.warn("NavContainer non trovato, GlobalTabBar non caricato.");
        }
      },
    });
  }
);
