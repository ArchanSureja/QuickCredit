import pandas as pd  # type: ignore
import json , os
import motor.motor_asyncio  # type: ignore
from dotenv import load_dotenv # type: ignore

load_dotenv()

URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = motor.motor_asyncio.AsyncIOMotorClient(URI)
db = client[DB_NAME]
user_profiles = db["user_profiles"]
bank_analytics = db["bank_analytics"]

async def set_analytics():

    
    bank_analytics = {}
    with open("raw_txns.json","r") as f:
        data = json.load(f)
    
    user_profile = data.get("fips")[1].get("accounts")[0].get("data").get("account").get("profile").get("holders").get("holder")[0]

    result = await user_profiles.insert_one(user_profile)

    # creating bank transactions analytics 
    transaction_list = data.get("fips")[1].get("accounts")[0].get("data").get("account").get("transactions").get("transaction")
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
    result_analytics = await bank_analytics.insert_one(bank_analytics)
    return { "user_id" : result.inserted_id , "bank_analytics_id" : result_analytics.inserted_id}


