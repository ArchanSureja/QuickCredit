from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import os
from dotenv import load_dotenv # type: ignore
import motor.motor_asyncio  # type: ignore
from bson import ObjectId # type: ignore

load_dotenv()
URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = motor.motor_asyncio.AsyncIOMotorClient(URI)
db = client[DB_NAME]
user_profiles = db["user_profiles"]
bank_analytics_list = db["bank_analytics"]
risk_data_list = db["risk_data_list"]
loan_products_list = db["loanproducts"]
loan_product_params = db["lenderparamsandproducts"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

async def match(loan_id,user_id):
    # loan_params = await loan_product_params.find_one({"loan_product_id":loan_id})
    # bank_analytics = await bank_analytics_list.find_one({"user_id":user_id})
    match_score = 2 

    # rule - base matching logic 
    # match_score= 0 
    # if loan_params['min_maintained_balance'] <= bank_analytics['average_maintained_balance']:
    #     match_score+=1
    # if bank_analytics['debit_to_credit_ratio'] <= loan_params['max_debit_to_credit_ratio']:
    #     match_score+=1
    # if loan_params['min_monthly_inflow'] <= bank_analytics['average_monthly_inflow']:
    #     match_score+=1
    # if loan_params['min_recommended_limit'] <= risk_data['credit_limit'] and risk_data['credit_limit'] <= loan_params['max_recommended_limit']:
    #     match_score+=1
    # if loan_params['min_credit_score'] <= risk_data.credit_score and risk_data['credit_score'] <= loan_params['max_credit_score']:
    #     match_score+=
    if match_score>=2:
        return True
    return False

@app.get("/get-matched-offers/{user_id}")
async def get_matched_offers(user_id : str):
    matched_loans = list()
    loan_products = await loan_products_list.find({}).to_list(length=None)
    for loan_product in loan_products:
        loan_product_id = loan_product["_id"]
        match_result = await match(loan_id=loan_product_id,user_id=ObjectId(user_id))
        if match_result:
            loan_product.pop("_id",None)
            loan_product.pop("admin_id",None)
            print(loan_product)
            matched_loans.append(loan_product)
    print(matched_loans)
    return matched_loans
