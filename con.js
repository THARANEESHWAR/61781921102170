cat > webapp/controller/Detail.controller.js << 'EOF'
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";
    const API = "http://localhost:8000";
    return Controller.extend("com.po.approval.controller.Detail", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this.onRouteMatched, this);
        },
        onRouteMatched: function (oEvent) {
            var poId = oEvent.getParameter("arguments").po_id;
            this.loadPO(poId);
        },
        loadPO: function (poId) {
            fetch(API + "/po/" + poId)
                .then(r => r.json())
                .then(data => {
                    var model = new JSONModel(data);
                    this.getView().setModel(model, "poModel");
                    this.checkFraud(data);
                });
        },
        checkFraud: function (po) {
            fetch(API + "/po/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(po)
            })
                .then(r => r.json())
                .then(result => {
                    var alert = this.byId("fraudAlert");
                    if (result.is_flagged) {
                        alert.setText("⚠️ ML Alert: " + result.message + " (anomaly score: " + result.anomaly_score + ")");
                        alert.setVisible(true);
                    }
                });
        },
        onApprove: function () {
            var poId = this.getView().getModel("poModel").getProperty("/po_id");
            fetch(API + "/po/" + poId + "/approve", { method: "PUT" })
                .then(r => r.json())
                .then(() => {
                    MessageToast.show("PO Approved!");
                    this.onNavBack();
                });
        },
        onReject: function () {
            var poId = this.getView().getModel("poModel").getProperty("/po_id");
            fetch(API + "/po/" + poId + "/reject", { method: "PUT" })
                .then(r => r.json())
                .then(() => {
                    MessageToast.show("PO Rejected!");
                    this.onNavBack();
                });
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("list");
        }
    });
});
EOF