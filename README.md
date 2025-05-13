# Quick Credit

A streamlined platform that connects MSMEs with financial organizations for quick and data-driven loan approvals.

---

## About

**Quick Credit** is a credit evaluation and loan facilitation platform designed for MSMEs (Micro, Small, and Medium Enterprises). It allows eligible businesses to apply for loans based on their credit score, revenue, and other key financial metrics. The platform connects MSMEs with major banks and financial institutions, streamlining the lending process and promoting financial inclusion.

---

## Features

- Loan application based on real-time credit metrics
- Integration with credit score APIs (e.g., SETU API)
- Status tracking of loan applications
- Responsive UI with intuitive user experience
- Analytics dashboard for both users and admin

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Python, Node.js, Express.js
- **Database:** MongoDB
- **Icons:** Lucide 
- **Deployment:** AWS

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/ArchanSureja/QuickCredit.git

```

### 2. Navigate to the project directory:

```bash
cd QuickCredit
```

### 3. Install dependencies for both admin and MSME UIs:

```bash
cd webapps && cd admin-ui && npm install 
cd ../msme-user-ui && npm install

```

### 4. Start both applications(in different terminals):

```bash
# Terminal 1 - Admin UI
cd webapps/admin-ui && npm run dev

# Terminal 2 - MSME UI
cd webapps/msme-user-ui && npm run dev

```
### 5. Backend Services Setup:
```bash
#Terminal 1 - aa-service
docker build -t aa-service .
docker run --name test-aa-service -d -p 8000:8000 aa-service

#Terminal 2 - user-service
docker build -t user-service .
docker run --name test-user-service -d -p 8001:8001 user-service

#Terminal 3 - credit-engine
docker build -t credit-engine .
docker run --name test-credit-engine -d -p 8002:8002 credit-engine

#Terminal 4 - loan-matching
docker build -t loan-matching
docker run --name test-loan-matching -d -p 8003:8003 loan-matching

#Terminal 5 - admin service(nodejs service)
npm install
npm run start 
```
---

## How to Use

### MSME User Flow

1. Navigate to the MSME user interface (msme-user-ui).

2. Enter the Mobile number and select your bank account to check your credit score, credit limit, cash flow and stability

3. For other financial analytics, go to Analytics section 

4. To see the Credit offers that matched to your profile, go to Loan Offers section

4. Use the Applications section to view the status of your applications (e.g., Applied, In Review, Disbursed, Rejected).

---

### Admin Flow

1. Navigate to the admin interface (admin-ui)

2. Use your admin credentials to sign in. (Use follwing credentials, Username: admin@lender.com, Password: secretpassword123)

3. In dashboard, admin can see Total Applications, Disbursed Loans, Avg. Loan Size, Recent Applications and Loan Performance.

4. In Application section, admin can see all loan applications with its status(Applied, In Review, Disbursed, Rejected). Admin can filter applications by status using the filter dropdown.

4. Admin can approve, reject, or mark applications as disbursed based on internal review and eligibility criteria.

5. In the Loan Criteria section, the admin can add new loan criteria, edit existing ones, and toggle their active/inactive status.

6. For details insights like monthly application trends and loan product Performance, platform provides analytics dashboard.




