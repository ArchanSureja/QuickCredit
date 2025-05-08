from fastapi import FastAPI, Request # type: ignore
from fastapi.responses import JSONResponse # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
import httpx # type: ignore
import os
from dotenv import load_dotenv # type: ignore
from datetime import datetime, timedelta, timezone
import json 
import pandas as pd  # type: ignore
import motor.motor_asyncio  # type: ignore

load_dotenv()
URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = motor.motor_asyncio.AsyncIOMotorClient(URI)
db = client[DB_NAME]
user_profiles = db["user_profiles"]
bank_analytics_list = db["bank_analytics"]

async def set_analytics():

    
    bank_analytics = {}
    with open("raw_txns.json","r") as f:
        data = json.load(f)
    
    user_profile = data.get("fips")[0].get("accounts")[0].get("data").get("account").get("profile").get("holders").get("holder")[0]

    result = await user_profiles.insert_one(user_profile)

    # creating bank transactions analytics 
    transaction_list = data.get("fips")[0].get("accounts")[0].get("data").get("account").get("transactions").get("transaction")
    df = pd.DataFrame(transaction_list)
    df["amount"] = df["amount"].astype(float)
    df["currentBalance"] = df["currentBalance"].astype(float)

    total_credit = df[df["type"]=="CREDIT"]["amount"].sum()
    bank_analytics["total_credit"] = total_credit

    total_debit = df[df["type"]=="DEBIT"]["amount"].sum()
    bank_analytics["total_debit"] = total_debit

    debit_to_credit_ratio = total_debit / total_credit if total_credit != 0 else 0
    bank_analytics["debit_to_credit_ratio"] = debit_to_credit_ratio

    average_tx_amount = df["amount"].mean()
    bank_analytics["average_tx_amount"] = average_tx_amount

    df['txn_date'] = pd.to_datetime(df['transactionTimestamp'])
    df['month_name'] = df['txn_date'].dt.strftime('%B')

    df_credit = df[df["type"]=="CREDIT"]
    df_debit = df[df["type"]=="DEBIT"]

    monthly_inflow = df_credit.groupby('month_name')['amount'].sum().reset_index(name='monthly_inflow')
    monthly_outflow = df_debit.groupby('month_name')['amount'].sum().reset_index(name='monthly_outflow')
    monthly_balance = df.groupby('month_name')['currentBalance'].mean().reset_index(name='monthly_balance')
    monthly_cashflow = pd.merge(monthly_inflow, monthly_outflow, on='month_name', how='outer').fillna(0)
    monthly_data = pd.merge(monthly_cashflow, monthly_balance, on='month_name', how='outer').fillna(0)
    obj = monthly_data.to_dict(orient='records')
    bank_analytics["monthly_data"] = obj

    average_monthly_inflow = monthly_cashflow['monthly_inflow'].mean()
    bank_analytics["average_monthly_inflow"] = average_monthly_inflow
    average_monthly_outflow = monthly_cashflow['monthly_outflow'].mean()
    bank_analytics["average_monthly_outflow"] = average_monthly_outflow

    monthly_cashflow['monthly_cashflow'] = monthly_cashflow['monthly_inflow'] - monthly_cashflow['monthly_outflow'] 
# print(monthly_cashflow)

    average_monthly_cashflow = monthly_cashflow['monthly_cashflow'].mean()
    bank_analytics["average_monthly_cashflow"] = average_monthly_cashflow

    std_ncf = monthly_cashflow['monthly_cashflow'].std()
    mean_ncf = monthly_cashflow['monthly_cashflow'].mean()
    cash_flow_stability = 1 - (std_ncf/mean_ncf) if mean_ncf > 0 else 0 # if negetive cashflow then do not use 
    bank_analytics["cash_flow_stability"] = cash_flow_stability

    minimum_maintained_balance = df["currentBalance"].min()
    bank_analytics["minmum_maintained_balance"] = minimum_maintained_balance

    balance_voltality = df["currentBalance"].std() / df["currentBalance"].mean()
    bank_analytics["balance_voltality"] = balance_voltality# lower the volatility is good 0.2 < is good 

    average_maintained_balance = df["currentBalance"].mean()
    bank_analytics["average_maintained_balance"] = average_maintained_balance

    cash_txns = df[df['mode']=="CASH"]
    bank_analytics["cash_tx_ratio"] = len(cash_txns)/len(df)
    bank_analytics["user_id"] = result.inserted_id 
    result_analytics = await bank_analytics_list.insert_one(bank_analytics)
    return { "user_id" : str(result.inserted_id) , "bank_analytics_id" : str(result_analytics.inserted_id)}


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
SETU_TOKEN_URL = os.getenv("SETU_TOKEN_URL") 
SETU_BASE_URL = os.getenv("SETU_BASE_URL")
SETU_PRODUCT_ID = os.getenv("SETU_PRODUCT_ID")
class PhoneInput(BaseModel):
    phone: str

# create consent endpoint 
@app.post("/create-consent")
async def create_consent(data : PhoneInput):
   phone = data.phone
   async with httpx.AsyncClient() as client:
       # Step 1 : Get Auth Token 
        res = await client.post(
            f"{SETU_TOKEN_URL}",
            headers = {"client": "bridge"},
            json = {
                "clientID": os.getenv("SETU_CLIENT_ID"),
	            "grant_type": "client_credentials",
	            "secret": os.getenv("SETU_CLIENT_SECRET")
            }
        )
        if res.text :
            print("got the token")
            with open("token.json","w") as f:
                f.write(res.text)
            with open("token.json","r") as f:
                token=json.load(f)

        # Step 2: Create Consent
        now = datetime.now(timezone.utc)
        one_year_ago = now - timedelta(days=365)
        from_timestamp = one_year_ago.isoformat(timespec='seconds').replace('+00:00', 'Z')
        to_timestamp = now.isoformat(timespec='seconds').replace('+00:00', 'Z')
        consent_payload = {
            "consentDuration": {
		            "unit": "MONTH",
		            "value": "24"
	        },
	        "vua":phone,
	        "dataRange": {
		        "from": from_timestamp,
		        "to": to_timestamp
	        },
            "consentTypes": ["TRANSACTIONS", "PROFILE", "SUMMARY"],
	        "context": [
              {
              "key":"fipId",
              "value":"setu-fip-2"
              }
            ]
        }

        consent_resp = await client.post(
            f"{SETU_BASE_URL}/consents",
            headers={
                "Authorization" : "Bearer "+ token["access_token"],
                "x-product-instance-id": SETU_PRODUCT_ID
            },
            json=consent_payload
        )
        consent_obj = json.loads(consent_resp.text)
        res = {
            "id":consent_obj.get("id"),
            "url":consent_obj.get("url")
        }
        return JSONResponse(content=res)

@app.get("/get-consent-status/{consent_id}")
async def get_consent_status(consent_id : str):
    async with httpx.AsyncClient() as client:
        with open("token.json","r") as f:
            token = json.load(f)
        consent_check_res = await client.get(
            f"{SETU_BASE_URL}/consents/{consent_id}",
            headers={
                "Authorization" : "Bearer "+ token["access_token"],
                "x-product-instance-id": SETU_PRODUCT_ID
            }
        )
        consent_check_obj = json.loads(consent_check_res.text)
        return JSONResponse(content=consent_check_obj)
    
@app.get("/create-session/{consent_id}")
async def fetch_data(consent_id : str):
    async with httpx.AsyncClient() as client:
        with open("token.json","r") as f:
            token = json.load(f)
        # create new data session 
        now = datetime.now(timezone.utc) - timedelta(days=1)
        one_year_ago = now - timedelta(days=363)
        from_timestamp = one_year_ago.isoformat(timespec='seconds').replace('+00:00', 'Z')
        to_timestamp = now.isoformat(timespec='seconds').replace('+00:00', 'Z')
        session_create_payload = {
                "consentId": consent_id,
                "dataRange": {
                    "from": from_timestamp,
                    "to": to_timestamp
                },
                "format": "json"
            }
        session_create_res = await client.post(
                f"{SETU_BASE_URL}/sessions",
                headers={
                    "Authorization" : "Bearer "+ token["access_token"],
                    "x-product-instance-id": SETU_PRODUCT_ID
                },
                json=session_create_payload
            )
        session_create_obj = json.loads(session_create_res.text)
        print(session_create_obj)
        return JSONResponse(content=session_create_obj)


@app.get("/fetch-data/{session_id}")
async def fetch_data(session_id :str):
    async with httpx.AsyncClient() as client:
        with open("token.json","r") as f:
            token = json.load(f)
        # fetch data using the session id 
        FI_data_res =await client.get(
                f"{SETU_BASE_URL}/sessions/{session_id}",
                headers={
                    "Authorization" : "Bearer "+ token["access_token"],
                    "x-product-instance-id": SETU_PRODUCT_ID
                }
            )
        print(FI_data_res.text)
        with open("raw_txns.json","w") as f:
            f.write(FI_data_res.text)
        print(FI_data_res.text)
        res = await set_analytics() 
        print(res) 
        return JSONResponse(content={"message" : "Data Fetched Successfully , Analytics Available in database...","ids":res})
        
@app.get("/")
async def check_aa_service():
    return {"message" : "AA service is up and running...."}
