from fastapi import FastAPI, Request # type: ignore
from fastapi.responses import JSONResponse # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
import httpx # type: ignore
import os
from dotenv import load_dotenv # type: ignore
from datetime import datetime, timedelta, timezone
import json 

load_dotenv()

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
        one_year_ago = now - timedelta(days=300)
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
        res_obj = json.loads(FI_data_res.text)
        return JSONResponse(content=res_obj)
        
@app.get("/")
async def check_aa_service():
    return {"message" : "AA service is up and running...."}
