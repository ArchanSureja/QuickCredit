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
bank_analytics = db["bank_analytics"]
risk_data_list = db["risk_data_list"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def cal_credit_score(analytics):
    score = 300

    if analytics['total_credit'] > 500000: score += 100
    if analytics['total_debit'] > 500000: score -= 50

    if analytics['debit_to_credit_ratio'] < 1: score += 100
    elif analytics['debit_to_credit_ratio'] < 0.75: score += 50
    elif analytics['debit_to_credit_ratio'] > 1: score -= 50

    if analytics['average_tx_amount'] > 10000: score += 50
    elif analytics['average_tx_amount'] < 1000: score -= 50

    if analytics['cash_flow_stability'] > 0.7: score += 100
    elif analytics['cash_flow_stability'] < 0.5: score -= 100

    if analytics['balance_voltality'] < 0.7: score += 150
    elif analytics['balance_voltality'] > 1: score -= 50

    monthly_positive_cashflow = sum(
        1 for month in analytics['monthly_data'] 
        if month['monthly_inflow'] - month['monthly_outflow'] > 0
    )
    if monthly_positive_cashflow > 6: score += 150

    if analytics.get('minimum_maintained_balance', 0) < 1000: 
        score -= 50

    return min(900, max(300, score))


def cal_credit_limit(score,balance):
        if score >= 750: return balance * 5
        elif score >= 600: return balance * 3
        else: return balance * 1.5

def risk_category(score):
        if score >= 750: return "Low Risk"
        elif score >= 600: return "Medium Risk"
        else: return "High Risk"  
 
@app.get("/get-risk-data/{user_id}")
async def get_risk_data(user_id : str):
            risk_data = {}
            analytics = await bank_analytics.find_one({"user_id": ObjectId(user_id)})
            print(analytics)
            risk_data['credit_score'] = cal_credit_score(analytics)
            risk_data['credit_limit'] = cal_credit_limit(risk_data['credit_score'],analytics['average_maintained_balance'])
            risk_data['risk_category'] = risk_category(risk_data['credit_score'])
            return risk_data

