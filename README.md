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

## Deployment

The applications can be accessed at the following URLs:

- **MSME User App**: [https://msme.quickcredit.com](https://msme.quickcredit.com)
- **Admin Dashboard**: [https://admin.quickcredit.com](https://admin.quickcredit.com)





