# Internal Hospital Management System (IHMS)
## Complete Architecture & Developer Guide
### Designed for Vetri-style Multi-Specialty Hospitals (20–100 beds)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   React.js + Tailwind CSS | Role-Based Dashboards               │
│   [Reception] [Doctor] [Nurse] [Lab] [Pharmacy] [Admin]         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼────────────────────────────────────┐
│                        API GATEWAY                               │
│   Express.js | JWT Middleware | RBAC | Rate Limiter              │
│   /api/v1/...                                                   │
└──────┬──────────┬──────────┬──────────┬────────────┬────────────┘
       │          │          │          │            │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌──▼─────┐ ┌───▼────┐
  │ Auth   │ │Patient │ │ Lab    │ │Pharmacy│ │Billing │
  │Service │ │Service │ │Service │ │Service │ │Service │
  └────┬───┘ └───┬────┘ └───┬────┘ └──┬─────┘ └───┬────┘
       └─────────┴──────────┴─────────┴────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       DATA LAYER                                 │
│   MongoDB Atlas | Mongoose ODM | GridFS (file storage)          │
│   Redis (session/cache) | Multer (uploads)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. MODULE BREAKDOWN

| Module | Roles | Key Functions |
|--------|-------|---------------|
| Auth | All | Login, JWT, RBAC |
| Reception | Receptionist, Admin | Register patient, create visit, assign doctor, token queue |
| OPD/Doctor | Doctor | Consultation, diagnosis, prescription, lab order |
| Lab | Lab Tech, Doctor | Test requests, upload results, attach to record |
| Pharmacy | Pharmacist | View prescriptions, dispense, inventory |
| IPD | Doctor, Nurse | Bed alloc, vitals, treatment updates |
| Billing | Admin, Receptionist | Charges, invoice, payment |
| Discharge | Doctor, Admin | Summary, final bill, close visit |
| Admin | Admin | Users, reports, analytics, settings |

---

## 3. DATABASE SCHEMAS (MongoDB)

### 3.1 users
```json
{
  "_id": "ObjectId",
  "employeeId": "EMP-2024-001",
  "name": "Dr. Aravind Kumar",
  "email": "aravind@vetrihospital.in",
  "passwordHash": "bcrypt_hash",
  "role": "doctor",                          // admin|doctor|nurse|receptionist|lab|pharmacist
  "department": "Cardiology",
  "phone": "9876543210",
  "isActive": true,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 3.2 patients
```json
{
  "_id": "ObjectId",
  "patientId": "VH-2024-00142",             // auto-generated unique ID
  "name": "Ramesh Babu",
  "dob": "1978-03-15",
  "age": 46,
  "gender": "male",
  "bloodGroup": "B+",
  "phone": "9994567890",
  "address": {
    "street": "12 Anna Nagar",
    "city": "Kallakurichi",
    "state": "Tamil Nadu",
    "pincode": "606202"
  },
  "emergencyContact": { "name": "Lakshmi Babu", "relation": "wife", "phone": "9994567891" },
  "allergies": ["Penicillin"],
  "chronicConditions": ["Hypertension", "Type 2 Diabetes"],
  "createdAt": "ISODate",
  "createdBy": "ObjectId(userId)"
}
```

### 3.3 visits
```json
{
  "_id": "ObjectId",
  "visitId": "VH-V-2024-00891",
  "patientId": "ObjectId(patient)",
  "type": "OPD",                             // OPD | IPD
  "status": "active",                        // active | admitted | discharged | closed
  "department": "Cardiology",
  "assignedDoctor": "ObjectId(user)",
  "tokenNumber": 14,
  "tokenStatus": "waiting",                  // waiting | in-consultation | done
  "chiefComplaint": "Chest pain since 2 days",
  "admittedAt": "ISODate",
  "dischargedAt": null,
  "createdAt": "ISODate",
  "createdBy": "ObjectId(user)"             // receptionist
}
```

### 3.4 consultations
```json
{
  "_id": "ObjectId",
  "visitId": "ObjectId(visit)",
  "patientId": "ObjectId(patient)",
  "doctor": "ObjectId(user)",
  "consultedAt": "ISODate",
  "symptoms": ["chest pain", "shortness of breath", "fatigue"],
  "diagnosis": "Unstable Angina",
  "icdCode": "I20.0",
  "clinicalNotes": "Patient presents with...",
  "followUpDate": "2024-12-10",
  "admissionRequired": true
}
```

### 3.5 prescriptions
```json
{
  "_id": "ObjectId",
  "visitId": "ObjectId(visit)",
  "patientId": "ObjectId(patient)",
  "prescribedBy": "ObjectId(user)",
  "prescribedAt": "ISODate",
  "status": "pending",                       // pending | dispensed | partial
  "medicines": [
    {
      "medicineName": "Aspirin",
      "genericName": "Acetylsalicylic Acid",
      "dosage": "75mg",
      "frequency": "1-0-1",                  // morning-afternoon-night
      "duration": "30 days",
      "route": "oral",
      "instructions": "After food",
      "quantity": 60
    }
  ]
}
```

### 3.6 lab_orders
```json
{
  "_id": "ObjectId",
  "orderId": "VH-L-2024-00441",
  "visitId": "ObjectId(visit)",
  "patientId": "ObjectId(patient)",
  "orderedBy": "ObjectId(user)",             // doctor
  "orderedAt": "ISODate",
  "status": "pending",                       // pending | sample-collected | processing | completed
  "tests": [
    {
      "testName": "Complete Blood Count",
      "testCode": "CBC",
      "price": 250,
      "category": "Haematology"
    },
    {
      "testName": "ECG",
      "testCode": "ECG-12L",
      "price": 300,
      "category": "Cardiology"
    }
  ],
  "collectedAt": "ISODate",
  "completedAt": "ISODate",
  "results": [
    {
      "testCode": "CBC",
      "reportUrl": "gridfs://reports/lab_VH-L-2024-00441_CBC.pdf",
      "values": {
        "Haemoglobin": { "value": 11.2, "unit": "g/dL", "normalRange": "13.0-17.0", "flag": "LOW" },
        "WBC": { "value": 8.4, "unit": "10^3/µL", "normalRange": "4.5-11.0", "flag": "NORMAL" }
      },
      "interpretation": "Mild anaemia noted",
      "uploadedBy": "ObjectId(user)",
      "uploadedAt": "ISODate"
    }
  ]
}
```

### 3.7 vitals (IPD)
```json
{
  "_id": "ObjectId",
  "visitId": "ObjectId(visit)",
  "patientId": "ObjectId(patient)",
  "recordedBy": "ObjectId(user)",           // nurse
  "recordedAt": "ISODate",
  "bp": { "systolic": 158, "diastolic": 98 },
  "pulse": 88,
  "temperature": 37.2,
  "spo2": 96,
  "respiratoryRate": 18,
  "weight": 72,
  "height": 170,
  "alerts": ["HIGH_BP"]                     // auto-generated flags
}
```

### 3.8 beds
```json
{
  "_id": "ObjectId",
  "bedNumber": "C-204",
  "ward": "Cardiology",
  "floor": 2,
  "type": "general",                        // general | semi-private | private | ICU
  "status": "occupied",                     // available | occupied | maintenance
  "currentPatient": "ObjectId(patient)",
  "currentVisit": "ObjectId(visit)",
  "admittedAt": "ISODate",
  "dailyRate": 1500
}
```

### 3.9 billing
```json
{
  "_id": "ObjectId",
  "invoiceId": "VH-INV-2024-00781",
  "visitId": "ObjectId(visit)",
  "patientId": "ObjectId(patient)",
  "status": "pending",                      // pending | partial | paid | waived
  "lineItems": [
    { "category": "consultation", "description": "OPD Consultation - Cardiology", "amount": 500, "qty": 1 },
    { "category": "lab", "description": "CBC Test", "amount": 250, "qty": 1 },
    { "category": "pharmacy", "description": "Aspirin 75mg x60", "amount": 180, "qty": 1 },
    { "category": "bed", "description": "General Ward - 3 days", "amount": 4500, "qty": 3 }
  ],
  "subtotal": 5430,
  "discount": 200,
  "tax": 0,
  "totalAmount": 5230,
  "paidAmount": 2000,
  "balanceAmount": 3230,
  "paymentMode": "cash",                   // cash | card | upi | insurance
  "insuranceDetails": null,
  "generatedBy": "ObjectId(user)",
  "createdAt": "ISODate"
}
```

### 3.10 discharge_summary
```json
{
  "_id": "ObjectId",
  "visitId": "ObjectId(visit)",
  "patientId": "ObjectId(patient)",
  "doctor": "ObjectId(user)",
  "dischargedAt": "ISODate",
  "admissionDiagnosis": "Unstable Angina",
  "finalDiagnosis": "NSTEMI - Non-ST Elevation MI",
  "treatmentSummary": "Patient was managed with anticoagulants...",
  "conditionAtDischarge": "stable",        // stable | improved | against-advice | expired
  "dischargeMedicines": [...],             // same structure as prescriptions.medicines
  "followUpInstructions": "Review after 1 week. Avoid strenuous activity.",
  "followUpDate": "2024-12-10",
  "reportUrl": "gridfs://discharge/VH-D-2024-00012.pdf"
}
```

### 3.11 inventory (Pharmacy)
```json
{
  "_id": "ObjectId",
  "medicineName": "Aspirin",
  "genericName": "Acetylsalicylic Acid",
  "category": "Cardiovascular",
  "manufacturer": "Cipla Ltd.",
  "batchNumber": "BATCH-2024-CIP-081",
  "currentStock": 2400,
  "unit": "tablet",
  "reorderLevel": 500,
  "expiryDate": "2026-06-30",
  "purchasePrice": 0.8,
  "sellingPrice": 1.5,
  "location": "Shelf A-3",
  "lastUpdated": "ISODate"
}
```

---

## 4. API ROUTES

### 4.1 Auth
```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
PATCH  /api/v1/auth/change-password
```

### 4.2 Patients
```
POST   /api/v1/patients                        # Register new patient
GET    /api/v1/patients?search=ramesh          # Search by name/phone/ID
GET    /api/v1/patients/:patientId             # Patient profile
PUT    /api/v1/patients/:patientId             # Update patient info
GET    /api/v1/patients/:patientId/visits      # All visits
GET    /api/v1/patients/:patientId/history     # Full medical history
```

### 4.3 Visits
```
POST   /api/v1/visits                          # Create visit (OPD/IPD)
GET    /api/v1/visits/:visitId                 # Visit details
PATCH  /api/v1/visits/:visitId/status          # Update status
GET    /api/v1/visits/queue?dept=Cardiology    # Token queue for department
```

### 4.4 Consultations
```
POST   /api/v1/consultations                   # Add consultation
GET    /api/v1/consultations/:visitId          # Get for visit
PUT    /api/v1/consultations/:id               # Update consultation
```

### 4.5 Prescriptions
```
POST   /api/v1/prescriptions                   # Create prescription
GET    /api/v1/prescriptions/:visitId          # Get by visit
GET    /api/v1/prescriptions/pending           # Pharmacist: pending list
PATCH  /api/v1/prescriptions/:id/dispense      # Mark as dispensed
```

### 4.6 Lab Orders
```
POST   /api/v1/lab/orders                      # Doctor creates order
GET    /api/v1/lab/orders?status=pending       # Lab tech: pending list
GET    /api/v1/lab/orders/:orderId             # Order details
PATCH  /api/v1/lab/orders/:orderId/status      # Update to collected/processing
POST   /api/v1/lab/orders/:orderId/results     # Upload results (multipart)
GET    /api/v1/lab/reports/:filename           # Serve report file
```

### 4.7 Vitals (IPD)
```
POST   /api/v1/vitals                          # Record vitals (nurse)
GET    /api/v1/vitals/:visitId                 # All vitals for a visit
GET    /api/v1/vitals/:visitId/latest          # Latest reading
GET    /api/v1/vitals/:visitId/alerts          # Active alerts
```

### 4.8 Beds
```
GET    /api/v1/beds?status=available           # Available beds
POST   /api/v1/beds/:bedId/allocate            # Allocate to patient
POST   /api/v1/beds/:bedId/release             # Release on discharge
GET    /api/v1/beds/occupancy                  # Occupancy report
```

### 4.9 Billing
```
POST   /api/v1/billing                         # Create invoice
GET    /api/v1/billing/:visitId                # Get invoice
PATCH  /api/v1/billing/:id/payment             # Record payment
GET    /api/v1/billing/:id/invoice-pdf         # Generate/download PDF
```

### 4.10 Discharge
```
POST   /api/v1/discharge                       # Create discharge summary
GET    /api/v1/discharge/:visitId              # Get summary
GET    /api/v1/discharge/:visitId/pdf          # Download discharge PDF
```

### 4.11 Admin
```
GET    /api/v1/admin/users                     # List users
POST   /api/v1/admin/users                     # Add user/staff
PUT    /api/v1/admin/users/:id                 # Update user
PATCH  /api/v1/admin/users/:id/toggle          # Enable/disable

GET    /api/v1/admin/analytics/opd             # OPD stats
GET    /api/v1/admin/analytics/ipd             # IPD/occupancy stats
GET    /api/v1/admin/analytics/revenue         # Revenue report
GET    /api/v1/admin/analytics/departments     # Dept-wise report
```

---

## 5. FRONTEND COMPONENT STRUCTURE

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── AlertBanner.jsx
│   │   ├── PatientSearchBar.jsx
│   │   ├── TokenDisplay.jsx
│   │   ├── StatusBadge.jsx
│   │   └── LoadingSpinner.jsx
│   │
│   ├── reception/
│   │   ├── PatientRegistrationForm.jsx
│   │   ├── PatientSearchPanel.jsx
│   │   ├── VisitCreationForm.jsx
│   │   ├── TokenQueue.jsx
│   │   └── QuickVisitCard.jsx
│   │
│   ├── doctor/
│   │   ├── ConsultationForm.jsx
│   │   ├── PrescriptionForm.jsx
│   │   ├── LabOrderForm.jsx
│   │   ├── PatientHistoryTimeline.jsx
│   │   ├── VisitSummaryCard.jsx
│   │   └── AdmissionDecisionPanel.jsx
│   │
│   ├── lab/
│   │   ├── TestOrderList.jsx
│   │   ├── ResultUploadForm.jsx
│   │   ├── LabResultEntry.jsx
│   │   └── ReportViewer.jsx
│   │
│   ├── pharmacy/
│   │   ├── PrescriptionQueue.jsx
│   │   ├── DispenseForm.jsx
│   │   ├── InventoryTable.jsx
│   │   └── LowStockAlert.jsx
│   │
│   ├── ipd/
│   │   ├── BedAllocationPanel.jsx
│   │   ├── VitalsForm.jsx
│   │   ├── VitalsChart.jsx
│   │   ├── AlertsPanel.jsx
│   │   └── TreatmentNotes.jsx
│   │
│   ├── billing/
│   │   ├── InvoiceBuilder.jsx
│   │   ├── PaymentForm.jsx
│   │   └── InvoicePDFView.jsx
│   │
│   └── admin/
│       ├── StatsCards.jsx
│       ├── OPDChart.jsx
│       ├── RevenueChart.jsx
│       ├── OccupancyMap.jsx
│       ├── UserManagementTable.jsx
│       └── DepartmentReport.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── reception/
│   │   ├── ReceptionDashboard.jsx
│   │   ├── RegisterPatient.jsx
│   │   └── TokenBoard.jsx
│   ├── doctor/
│   │   ├── DoctorDashboard.jsx
│   │   ├── PatientConsultation.jsx
│   │   └── PatientHistory.jsx
│   ├── lab/
│   │   ├── LabDashboard.jsx
│   │   └── UploadResults.jsx
│   ├── pharmacy/
│   │   ├── PharmacyDashboard.jsx
│   │   └── InventoryManagement.jsx
│   ├── ipd/
│   │   ├── IPDDashboard.jsx
│   │   ├── BedManagement.jsx
│   │   └── PatientWard.jsx
│   ├── billing/
│   │   ├── BillingDashboard.jsx
│   │   └── InvoiceDetail.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── UserManagement.jsx
│       └── Analytics.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
│
├── hooks/
│   ├── usePatient.js
│   ├── useVisit.js
│   ├── useAuth.js
│   └── useAlerts.js
│
├── services/
│   ├── api.js                        # Axios instance + interceptors
│   ├── authService.js
│   ├── patientService.js
│   ├── visitService.js
│   ├── labService.js
│   ├── pharmacyService.js
│   └── billingService.js
│
├── utils/
│   ├── alertLogic.js                 # BP/vitals alert calculations
│   ├── patientIdGenerator.js
│   ├── dateHelpers.js
│   └── roleGuard.jsx                 # HOC for route protection
│
└── App.jsx
```

---

## 6. BACKEND FOLDER STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   ├── gridfs.js                 # File storage setup
│   │   └── constants.js              # Roles, departments, etc.
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification
│   │   ├── rbac.js                   # Role-based access
│   │   ├── upload.js                 # Multer config
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Visit.js
│   │   ├── Consultation.js
│   │   ├── Prescription.js
│   │   ├── LabOrder.js
│   │   ├── Vitals.js
│   │   ├── Bed.js
│   │   ├── Billing.js
│   │   ├── DischargeSummary.js
│   │   └── Inventory.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── visit.routes.js
│   │   ├── consultation.routes.js
│   │   ├── prescription.routes.js
│   │   ├── lab.routes.js
│   │   ├── vitals.routes.js
│   │   ├── bed.routes.js
│   │   ├── billing.routes.js
│   │   ├── discharge.routes.js
│   │   └── admin.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── visit.controller.js
│   │   ├── consultation.controller.js
│   │   ├── prescription.controller.js
│   │   ├── lab.controller.js
│   │   ├── vitals.controller.js
│   │   ├── bed.controller.js
│   │   ├── billing.controller.js
│   │   ├── discharge.controller.js
│   │   └── admin.controller.js
│   │
│   ├── services/
│   │   ├── alertService.js           # Vitals alert logic
│   │   ├── pdfService.js             # Invoice/discharge PDF
│   │   ├── idGeneratorService.js     # Patient/visit IDs
│   │   └── notificationService.js
│   │
│   └── utils/
│       ├── apiResponse.js
│       ├── validators.js
│       └── logger.js
│
├── uploads/                          # Temp upload folder
├── .env
├── server.js
└── package.json
```

---

## 7. SAMPLE .ENV CONFIGURATION

```env
PORT=5000
MONGO_URI=mongodb+srv://ihms_user:password@cluster.mongodb.net/ihms_db
JWT_SECRET=your-256-bit-secret-key
JWT_REFRESH_SECRET=your-256-bit-refresh-secret
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
GRIDFS_BUCKET=uploads
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 8. ALERT LOGIC (alertService.js)

```javascript
// src/services/alertService.js

const ALERT_THRESHOLDS = {
  bp: {
    systolic: { critical_high: 180, high: 140, low: 90 },
    diastolic: { critical_high: 120, high: 90, low: 60 }
  },
  pulse: { critical_high: 130, high: 100, low: 50 },
  spo2: { critical_low: 90, low: 94 },
  temperature: { critical_high: 40.0, high: 38.5, low: 36.0 }
};

function generateAlerts(vitals) {
  const alerts = [];
  const { bp, pulse, spo2, temperature } = vitals;

  if (bp?.systolic >= ALERT_THRESHOLDS.bp.systolic.critical_high)
    alerts.push({ code: 'CRITICAL_HIGH_BP', severity: 'critical', message: `Critical BP: ${bp.systolic}/${bp.diastolic} mmHg` });
  else if (bp?.systolic >= ALERT_THRESHOLDS.bp.systolic.high)
    alerts.push({ code: 'HIGH_BP', severity: 'warning', message: `High BP: ${bp.systolic}/${bp.diastolic} mmHg` });

  if (spo2 <= ALERT_THRESHOLDS.spo2.critical_low)
    alerts.push({ code: 'CRITICAL_LOW_SPO2', severity: 'critical', message: `Critical SpO2: ${spo2}%` });
  else if (spo2 <= ALERT_THRESHOLDS.spo2.low)
    alerts.push({ code: 'LOW_SPO2', severity: 'warning', message: `Low SpO2: ${spo2}%` });

  if (temperature >= ALERT_THRESHOLDS.temperature.critical_high)
    alerts.push({ code: 'CRITICAL_FEVER', severity: 'critical', message: `Critical Fever: ${temperature}°C` });

  return alerts;
}

module.exports = { generateAlerts };
```

---

## 9. RBAC MIDDLEWARE

```javascript
// src/middleware/rbac.js

const PERMISSIONS = {
  admin:        ['*'],
  doctor:       ['consultation:rw', 'prescription:rw', 'lab:r', 'patient:r', 'discharge:rw'],
  nurse:        ['vitals:rw', 'patient:r', 'lab:r'],
  receptionist: ['patient:rw', 'visit:rw', 'billing:r'],
  lab:          ['lab:rw', 'patient:r'],
  pharmacist:   ['pharmacy:rw', 'inventory:rw', 'patient:r']
};

function authorize(...requiredPerms) {
  return (req, res, next) => {
    const userPerms = PERMISSIONS[req.user.role] || [];
    if (userPerms.includes('*')) return next();
    const hasAll = requiredPerms.every(p => userPerms.includes(p));
    if (!hasAll) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}
module.exports = { authorize };
```

---

## 10. SAMPLE DUMMY DATA

### Staff Users
```json
[
  { "employeeId": "EMP-001", "name": "Dr. Aravind Kumar", "role": "doctor", "department": "Cardiology", "email": "aravind@ihms.in", "password": "Doctor@123" },
  { "employeeId": "EMP-002", "name": "Dr. Meenakshi Sundaram", "role": "doctor", "department": "General Medicine", "email": "meenakshi@ihms.in", "password": "Doctor@123" },
  { "employeeId": "EMP-010", "name": "Priya Rajan", "role": "receptionist", "email": "priya@ihms.in", "password": "Recept@123" },
  { "employeeId": "EMP-020", "name": "Kavitha Devi", "role": "nurse", "email": "kavitha@ihms.in", "password": "Nurse@123" },
  { "employeeId": "EMP-030", "name": "Senthil Kumar", "role": "lab", "email": "senthil@ihms.in", "password": "Lab@1234" },
  { "employeeId": "EMP-040", "name": "Lakshmi Priya", "role": "pharmacist", "email": "lakshmi@ihms.in", "password": "Pharma@123" },
  { "employeeId": "EMP-000", "name": "Admin", "role": "admin", "email": "admin@ihms.in", "password": "Admin@123" }
]
```

### Sample Patients
```json
[
  { "patientId": "VH-2024-00001", "name": "Rajesh Kumar", "age": 52, "gender": "male", "phone": "9994001001", "bloodGroup": "O+", "chronicConditions": ["Hypertension"] },
  { "patientId": "VH-2024-00002", "name": "Lakshmi Devi", "age": 34, "gender": "female", "phone": "9994001002", "bloodGroup": "A+" },
  { "patientId": "VH-2024-00003", "name": "Murugan S.", "age": 67, "gender": "male", "phone": "9994001003", "bloodGroup": "B+", "chronicConditions": ["Type 2 Diabetes", "CKD Stage 2"] }
]
```

---

## 11. ADMIN ANALYTICS QUERIES

```javascript
// Daily OPD count
db.visits.aggregate([
  { $match: { type: 'OPD', createdAt: { $gte: startOfDay } }},
  { $group: { _id: '$department', count: { $sum: 1 }}}
])

// Monthly revenue
db.billing.aggregate([
  { $match: { status: 'paid', createdAt: { $gte: startOfMonth }}},
  { $group: { _id: null, total: { $sum: '$totalAmount' }}}
])

// Bed occupancy rate
db.beds.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 }}},
  { $project: { rate: { $divide: ['$count', totalBeds] }}}
])
```

---

## 12. SCALABILITY NOTES (SaaS-Ready)

### Multi-Hospital Setup
- Add `hospitalId` field to ALL collections
- JWT payload includes `{ userId, role, hospitalId }`
- All queries filter by `hospitalId`
- Separate MongoDB databases per hospital OR shared with tenant isolation
- Subdomain routing: `vetri.ihms.app` → `hospitalId: vetri`

### Performance
- Index on: `patientId`, `visitId`, `phone`, `status`, `createdAt`, `department`
- Redis cache: token queues, bed occupancy counts, active alerts
- Pagination on all list endpoints (limit/offset or cursor)
- GridFS for PDF/image storage (scales independently)

### Infrastructure
- Docker containerization for each service
- Nginx reverse proxy
- MongoDB Atlas for managed DB
- AWS S3 (optional replacement for GridFS at scale)
- PM2 for Node.js process management

