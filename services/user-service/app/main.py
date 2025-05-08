from fastapi import FastAPI, Request  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore
import motor.motor_asyncio  # type: ignore
from bson import ObjectId  # type: ignore
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@lender.com")  # Default to your admin email

client = motor.motor_asyncio.AsyncIOMotorClient(URI)
db = client[DB_NAME]
user_profiles = db["user_profiles"]
bank_analytics = db["bank_analytics"]
loan_application_list = db["loanapplications"]
loan_product_list = db["loanproducts"]
admin_collection = db["admins"]  # Assuming you have an admins collection

async def send_email(to_email: str, subject: str, body: str):
    try:
        message = MIMEMultipart()
        message["From"] = SMTP_USERNAME
        message["To"] = to_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "plain"))
        print('=================================')
        print('Sending email to:', to_email)
        print('=================================')
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.get('/get-analytics/{analytics_id}')
async def get_analytics(analytics_id: str):
    analytics_obj_id = ObjectId(analytics_id)
    analytics = await bank_analytics.find_one({"_id": analytics_obj_id}, {"_id": 0, "user_id": 0})
    if not analytics:
        return {"error": "Analytics data not found"}
    print(analytics)
    return analytics

@app.get('/get-profile/{user_id}')
async def get_profile(user_id: str):
    user_obj_id = ObjectId(user_id)
    user_profile = await user_profiles.find_one({"_id": user_obj_id}, {"_id": 0})
    if not user_profile:
        return {"error": "User profile not found"}
    print(user_profile)
    return user_profile

@app.get('/get-applications/{user_id}')
async def get_applications(user_id: str):
    user_obj_id = ObjectId(user_id)
    res_list = list()
    loan_applications = await loan_application_list.find({"user_id": user_obj_id}).to_list(length=None)
    for loan_application in loan_applications:
        l = {}
        loan_product = await loan_product_list.find_one({"_id": loan_application["loan_product_id"]})
        l['name'] = loan_product['name']
        l['description'] = loan_product['description']
        l['tenure'] = loan_product['max_tenure_months']
        l['amount'] = loan_product['max_amount']
        l['interest_rate'] = loan_product['interest_rate']
        l['applied'] = loan_application['applied']
        l['updated'] = loan_application['processed_at']
        l['status'] = loan_application['application_status']
        res_list.append(l)

    print(res_list)
    return res_list

@app.post('/add-application')
async def add_application(request: Request):
    data = await request.json()
    user_id = ObjectId(data['user_id'])
    loan_product = await loan_product_list.find_one({"name": data["loan_name"]})
    
    if not loan_product:
        return {"error": "Loan product not found"}
    
    loan_product_id = ObjectId(loan_product['_id'])
    current_loan_application = await loan_application_list.find_one({"user_id": user_id, "loan_product_id": loan_product_id})
    
    if not current_loan_application:
        loan_application = {}
        main_matched_rules = {}
        loan_application['user_id'] = user_id
        loan_application['loan_product_id'] = loan_product_id
        loan_application['admin_id'] = ObjectId(loan_product['admin_id'])
        loan_application['limit'] = loan_product['max_amount']
        loan_application['tenure_months'] = loan_product['max_tenure_months']
        loan_application['application_status'] = 'pending'
        main_matched_rules["credit_score_match"] = True
        main_matched_rules['business_age_match'] = True
        loan_application['main_matched_rules'] = main_matched_rules
        loan_application['disbursement'] = False
        loan_application['applied'] = datetime.now(timezone.utc)
        loan_application['created'] = datetime.now(timezone.utc)
        loan_application['processed_at'] = datetime.now(timezone.utc)
        loan_application['processed_by'] = loan_product['admin_id']
        
        print(loan_application)
        res = await loan_application_list.insert_one(loan_application)
        print(res)
        
        # Get admin details
        admin = await admin_collection.find_one({"_id": ObjectId(loan_product['admin_id'])})
        admin_email = admin.get('email', ADMIN_EMAIL)
        admin_name = admin.get('name', 'Admin')
        
        # Get user details
        user = await user_profiles.find_one({"_id": user_id})
        user_name = user.get('name', 'Customer')
        
        # Prepare email
        subject = f"New Loan Application Received - {loan_product['name']}"
        body = f"""
        Dear {admin_name},
        
        A new loan application has been submitted:
        
        Applicant: {user_name}
        Loan Product: {loan_product['name']}
        Amount: {loan_product['max_amount']}
        Tenure: {loan_product['max_tenure_months']} months
        Applied At: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}
        
        Please review the application at your earliest convenience.
        """
        
        # Send email
        email_sent = await send_email(admin_email, subject, body)
        if not email_sent:
            print("Failed to send email notification")
        
        return {"status": "success", "message": "Application submitted successfully"}
    else:
        print("Application already exists")
        print(current_loan_application)
        return {"error": "Application already exists"}