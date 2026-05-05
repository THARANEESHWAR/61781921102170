from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv("po_data.csv")
model = joblib.load("po_model.pkl")
le = joblib.load("label_encoder.pkl")

class PORequest(BaseModel):
    vendor: str
    category: str
    amount: float
    description: str
    requestor: str

@app.get("/po")
def get_all_pos():
    return df.to_dict(orient="records")

@app.get("/po/{po_id}")
def get_po(po_id: str):
    result = df[df["po_id"] == po_id]
    if result.empty:
        return {"error": "PO not found"}
    return result.iloc[0].to_dict()

@app.post("/po/check")
def check_po(po: PORequest):
    try:
        cat_encoded = le.transform([po.category])[0]
    except:
        cat_encoded = 0

    X = [[po.amount, cat_encoded]]
    prediction = model.predict(X)[0]
    score = round(model.decision_function(X)[0], 4)
    is_flagged = prediction == -1

    return {
        "is_flagged": is_flagged,
        "anomaly_score": score,
        "message": "Suspicious amount detected" if is_flagged else "Amount looks normal"
    }

@app.put("/po/{po_id}/approve")
def approve_po(po_id: str):
    global df
    df.loc[df["po_id"] == po_id, "status"] = "Approved"
    df.to_csv("po_data.csv", index=False)
    return {"status": "Approved", "po_id": po_id}

@app.put("/po/{po_id}/reject")
def reject_po(po_id: str):
    global df
    df.loc[df["po_id"] == po_id, "status"] = "Rejected"
    df.to_csv("po_data.csv", index=False)
    return {"status": "Rejected", "po_id": po_id}

@app.get("/analytics")
def get_analytics():
    total = len(df)
    approved = len(df[df["status"] == "Approved"])
    rejected = len(df[df["status"] == "Rejected"])
    pending = len(df[df["status"] == "Pending"])
    total_spend = round(df["amount"].sum(), 2)
    avg_amount = round(df["amount"].mean(), 2)

    by_category = df.groupby("category")["amount"].sum().round(2).to_dict()
    by_vendor = df.groupby("vendor")["amount"].sum().round(2).to_dict()

    return {
        "total": total,
        "approved": approved,
        "rejected": rejected,
        "pending": pending,
        "total_spend": total_spend,
        "avg_amount": avg_amount,
        "by_category": by_category,
        "by_vendor": by_vendor
    }