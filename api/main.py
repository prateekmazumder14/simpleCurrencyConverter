# api/main.py
from typing import Annotated
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os, requests

API_KEY = os.getenv("CURRENCY_API_KEY")
BASE_URL = f"https://api.freecurrencyapi.com/v1/latest?apikey={API_KEY}"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173","http://localhost:8000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/healthz")
def health():
    return {"ok": True}

@app.get("/convert")
def convert(
    from_: Annotated[str, Query(alias="from")] = "USD",
    to: str = "INR",
    amount: float = 1.0
):
    if amount < 0:
        raise HTTPException(status_code=400, detail="amount must be >= 0")

    # freecurrencyapi: get latest rate for one target currency
    params = {"base_currency": from_, "currencies": to}
    r = requests.get(BASE_URL, params=params, timeout=10)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"upstream error {r.status_code}")

    data = r.json()
    if "data" not in data or to not in data["data"]:
        raise HTTPException(status_code=502, detail="unexpected upstream response")

    rate = data["data"][to]
    converted_value = rate * amount
    return JSONResponse({"rate": rate, "converted": float(f"{converted_value:.2f}")})
