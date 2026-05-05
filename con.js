cat > webapp/controller/List.controller.js << 'EOF'
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";
    const API = "http://localhost:8000";
    return Controller.extend("com.po.approval.controller.List", {
        onInit: function () {
            this.loadPOs();
        },
        loadPOs: function () {
            fetch(API + "/po")
                .then(r => r.json())
                .then(data => {
                    var model = new JSONModel({ orders: data });
                    this.getView().setModel(model, "poModel");
                })
                .catch(err => console.error("Error loading POs:", err));
        },
        onItemPress: function (oEvent) {
            var item = oEvent.getParameter("listItem");
            var ctx = item.getBindingContext("poModel");
            var poId = ctx.getProperty("po_id");
            this.getOwnerComponent().getRouter()
                .navTo("detail", { po_id: poId });
        },
        onSearch: function (oEvent) {
            var query = oEvent.getParameter("query");
            var list = this.byId("poList");
            var binding = list.getBinding("items");
            var filters = [];
            if (query) {
                filters.push(new Filter({
                    filters: [
                        new Filter("po_id", FilterOperator.Contains, query),
                        new Filter("vendor", FilterOperator.Contains, query),
                        new Filter("category", FilterOperator.Contains, query)
                    ],
                    and: false
                }));
            }
            binding.filter(filters);
        },
        onFilterChange: function (oEvent) {
            var key = oEvent.getParameter("selectedItem").getKey();
            var list = this.byId("poList");
            var binding = list.getBinding("items");
            var filters = [];
            if (key !== "All") {
                filters.push(new Filter("status", FilterOperator.EQ, key));
            }
            binding.filter(filters);
        },
        onAnalyticsPress: function () {
            this.getOwnerComponent().getRouter().navTo("analytics");
        }
    });
});
EOF