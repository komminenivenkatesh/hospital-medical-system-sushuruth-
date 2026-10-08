# 🏥 Sushruth (NeuroCare) — AI-Powered Healthcare & Hospital Management Platform

Welcome to **Sushruth**, a comprehensive, multi-role, AI-integrated hospital and healthcare operating system. The platform connects patients, physicians, and medical administrators with intelligent diagnostics, automated scan analysis, appointment scheduling, and real-time medical consultations.

---

## 📑 Table of Contents
1. [System Architecture & Tech Stack](#-system-architecture--tech-stack)
2. [Quick Start & Setup Guide](#-quick-start--setup-guide)
3. [Port & Service Allocation](#-port--service-allocation)
4. [Project Directory Structure](#-project-directory-structure)
5. [AI / Machine Learning Diagnostics Engine](#-ai--machine-learning-diagnostics-engine)
6. [Backend API Specifications](#-backend-api-specifications)
7. [Frontend Portals & Page Directory (31 Pages)](#-frontend-portals--page-directory-31-pages)
8. [📊 Project Progress & Feature Tracker](#-project-progress--feature-tracker)
9. [Pre-configured Demo Accounts](#-pre-configured-demo-accounts)
10. [Roadmap & Next Steps](#-roadmap--next-steps)

---

## 🏗 System Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                  React 19 Frontend (Vite)                   │
   │               Port: 5175 | Proxy: /api, /socket             │
   └───────────────┬─────────────────────────────▲───────────────┘
                   │ HTTP / REST                 │ WebSocket (Socket.io)
                   ▼                             │
   ┌─────────────────────────────────────────────┴───────────────┐
   │                   Express.js API Gateway                    │
   │               Port: 5000 | JWT Auth & Socket.io             │
   └───────────────┬─────────────────────────────┬───────────────┘
                   │ Mongoose                    │ Axios (Multipart/JSON)
                   ▼                             ▼
   ┌─────────────────────────────┐ ┌─────────────────────────────┐
   │      MongoDB Database       │ │      Python ML Service      │
   │         Port: 27017         │ │  Port: 5001 (PyTorch/ONNX)  │
   └─────────────────────────────┘ └─────────────────────────────┘
```

### 1. Frontend Client
- **Core Framework**: React `19.2.6`, Vite `8.0.12`
- **Component UI**: Material UI (MUI v9), Emotion, Lucide Icons, Fontsource Manrope
- **State Management**: Zustand `5.0.14`
- **Routing**: React Router DOM `v7.17.0` (3 distinct portal shells: Patient, Doctor, Admin)
- **Real-Time Client**: Socket.io-client `4.8.3`
- **Visuals & Charts**: Framer Motion `12.40.0`, Recharts `3.8.1`, Cobe (Interactive 3D Globe)
- **HTTP**: Axios `1.19.0` with token interceptors

### 2. Backend API Gateway
- **Runtime**: Node.js & Express `4.21.0`
- **Database ODM**: Mongoose `8.6.0` on MongoDB
- **Real-time Server**: Socket.io `4.7.5`
- **Security & Utilities**: JWT (`jsonwebtoken`), Bcryptjs (12 salt rounds), Helmet, CORS, Express-Rate-Limit
- **File Ingestion**: Multer `2.2.0`, FormData, Axios

### 3. ML Diagnostic Microservice
- **Runtime**: Python 3.10+ with Flask `3.1.1` & Flask-CORS
- **Deep Learning / ONNX**: PyTorch (`torch`), ONNX Runtime `1.22.0`
- **Machine Learning**: XGBoost, Scikit-learn, SciPy, NumPy
- **Image Processing**: Pillow (PIL)

---

## 🚀 Quick Start & Setup Guide

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** running locally on default port `27017`

### 1. Installation
Install root & backend npm dependencies:
```bash
# In the project root directory
npm install

# In the backend directory
cd backend
npm install
cd ..
```

Install Python ML microservice requirements:
```bash
pip install -r ml_service/requirements.txt
```

### 2. Database Seeding (First-time setup)
Populate MongoDB with default doctors, patients, conversations, and appointments:
```bash
npm run seed
```

### 3. Unified Launcher
Start MongoDB, the Python ML Service, Express Backend, and Vite Frontend concurrently:

**On Windows:**
Double click `start.bat` or run:
```bash
npm start
```

Or run all 3 services via `concurrently`:
```bash
npm run dev:all
```

---

## 🔌 Port & Service Allocation

| Component | Default Port | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5175` | React single-page application |
| **Backend REST API** | `http://localhost:5000` | Node.js Express server |
| **ML Inference Service** | `http://localhost:5001` | Flask AI microservice |
| **Database** | `mongodb://localhost:27017/neurocare` | MongoDB local database |

---

## 📁 Project Directory Structure

```
sushuruth/
├── start.bat                     # 1-Click launcher script for Windows
├── package.json                  # Root dependencies & orchestration scripts
├── vite.config.js                # Vite build configuration & API proxies
├── backend/                      # Node.js Express API & WebSocket Gateway
│   ├── .env                      # Active backend environment settings
│   ├── server.js                 # Express server & socket setup
│   ├── seed.js                   # MongoDB data seeder
│   ├── config/
│   │   ├── db.js                 # Mongoose database connection
│   │   └── socket.js             # Real-time WebSocket handlers
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # Patient, Doctor, Admin accounts
│   │   ├── Doctor.js             # Doctor professional metadata & fees
│   │   ├── Appointment.js        # Bookings & consultation logs
│   │   ├── Conversation.js       # Chat room metadata
│   │   ├── Message.js            # Chat messages
│   │   └── MriAnalysis.js        # AI Scan analysis history
│   ├── controllers/              # Business logic handlers
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── chatController.js
│   │   └── mriController.js
│   └── routes/                   # API endpoint routers
│       ├── authRoutes.js
│       ├── doctorRoutes.js
│       ├── appointmentRoutes.js
│       ├── chatRoutes.js
│       └── mriRoutes.js
├── ml_service/                   # Python AI Diagnostics Service
│   ├── app.py                    # Flask REST API & model runner
│   ├── unet3d.py                 # Pure PyTorch 3D UNet architecture
│   ├── requirements.txt          # Python dependencies
│   └── models/                   # Serialized ML model weights
│       ├── brain_mri_resnet18.onnx         # Brain tumor classifier (ONNX)
│       ├── breast_cancer_medmnist.onnx      # Breast cancer model (ONNX)
│       ├── breast_cancer_medmnist.onnx.data # Model weight tensor data
│       ├── blood_report_analyzer.pkl       # CBC blood classifier (XGBoost)
│       └── spleen_unet3d_final.pt          # Spleen 3D segmentation (PyTorch)
└── src/                          # React Frontend Source Code
    ├── main.jsx                  # React DOM root entry
    ├── App.jsx                   # Master routing & animated layout transitions
    ├── index.css                 # Global styles & design system tokens
    ├── context/
    │   └── AuthContext.jsx       # Authentication state & session manager
    ├── services/
    │   ├── api.js                # Axios HTTP client with JWT interceptor
    │   └── socket.js             # Socket.io connection & event subscribers
    ├── store/
    │   └── useStore.js           # Zustand global state (theme, notifications, etc.)
    ├── theme/
    │   └── theme.js              # Custom MUI design system & palette tokens
    ├── layout/                   # Role shells and navigations
    │   ├── AppShell.jsx          # Patient navigation shell
    │   ├── DoctorShell.jsx       # Doctor navigation shell
    │   ├── AdminShell.jsx        # Admin navigation shell
    │   ├── TopNav.jsx            # Universal navigation bar
    │   ├── Sidebar.jsx           # Desktop sidebar
    │   ├── MobileNav.jsx         # Bottom mobile navigation
    │   └── Footer.jsx            # Application footer
    ├── components/               # 16 Reusable UI components
    │   ├── ChatWindow.jsx        # Interactive messaging box
    │   ├── DoctorCard.jsx        # Doctor profile cards with booking CTA
    │   ├── PreLanding.jsx        # Startup loader & landing animation
    │   ├── SmartImage.jsx        # Image loader with graceful fallback
    │   ├── MetricCard.jsx        # Analytical metric display
    │   └── ...
    ├── data/                     # Seed & fallback dataset mocks
    │   ├── doctors.js
    │   ├── appointments.js
    │   ├── prescriptions.js
    │   ├── conversations.js
    │   └── assets.js
    └── pages/                    # 31 Page Views
        ├── auth/Login.jsx
        ├── patient/ (18 pages)
        ├── doctor/ (6 pages)
        └── admin/ (4 pages)
```

---

## 🧠 AI / Machine Learning Diagnostics Engine

The `ml_service` runs 4 trained models capable of clinical-grade inference on CPU:

### 1. Brain MRI Tumor Classifier
- **Model**: `models/brain_mri_resnet18.onnx` (ResNet-18)
- **Input**: 2D brain MRI slice (`[1, 3, 224, 224]` float32 normalized)
- **Diagnostic Classes**:
  - `glioma` (Severity: 8/10, High Risk)
  - `meningioma` (Severity: 5/10, Medium Risk)
  - `pituitary` (Severity: 4/10, Medium Risk)
  - `no_tumor` (Severity: 1/10, Low Risk)
- **Endpoint**: `POST /predict/brain`

### 2. Breast Mammography Classifier
- **Model**: `models/breast_cancer_medmnist.onnx` (MedMNIST ResNet)
- **Input**: Mammography image slice (`[1, 3, 224, 224]` float32 normalized)
- **Diagnostic Classes**:
  - `malignant` (Severity: 9/10, High Risk, BI-RADS 5)
  - `benign` (Severity: 1/10, Low Risk, BI-RADS 2)
- **Endpoint**: `POST /predict/breast`

### 3. Complete Blood Count (CBC) Tabular Analyzer
- **Model**: `models/blood_report_analyzer.pkl` (XGBoost Classifier)
- **Input**: 6 clinical numeric parameters:
  `wbc`, `rbc`, `hemoglobin`, `platelets`, `neutrophils`, `lymphocytes`
- **Diagnostic Classes**:
  - `Normal` (Severity: 1/10)
  - `Anemia` (Severity: 4/10)
  - `Infection` (Severity: 5/10)
  - `Leukemia` (Severity: 9/10)
- **Endpoint**: `POST /predict/blood`

### 4. Spleen CT 3D Volumetric Segmentation
- **Model**: `models/spleen_unet3d_final.pt` (PyTorch 3D U-Net)
- **Input**: 3D abdominal CT scan standardized to `[1, 1, 96, 96, 96]` voxels
- **Output**: Voxel-level mask, Spleen Volume ($cm^3$), and classification:
  - `Normal Spleen` (Volume ratio $\le 0.08$)
  - `Splenomegaly` (Volume ratio $> 0.08$, Splenic enlargement)
- **Endpoint**: `POST /predict/spleen`

### 5. Resilient Mock Fallback
If the ML service is offline or unsupported scans are submitted (e.g. *Cardiac MRI*, *Spine MRI*, *X-Ray*), `backend/controllers/mriController.js` generates detailed clinical diagnostic reports automatically, preventing application errors.

---

## 📡 Backend API Specifications

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new patient or doctor account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT |
| `GET` | `/api/auth/me` | Protected | Fetch currently authenticated user profile |

### 👨‍⚕️ Doctors (`/api/doctors`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/doctors` | Public | Filter doctors by specialty, status, availability |
| `GET` | `/api/doctors/:id` | Public | Fetch doctor profile details |
| `PATCH` | `/api/doctors/status` | Doctor Only | Update online status (`Available`, `Busy`, `Offline`) |

### 📅 Appointments (`/api/appointments`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/appointments` | Protected | Book a slot with conflict detection |
| `GET` | `/api/appointments` | Protected | List patient/doctor appointments |
| `PATCH` | `/api/appointments/:id/status` | Protected | Update status (`confirmed`, `completed`, `cancelled`) |

### 💬 Real-Time Chat (`/api/chat` + Socket.io)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/chat/conversations` | Protected | List all conversation threads for user |
| `GET` | `/api/chat/conversations/:id/messages`| Protected | Paginated message history |
| `POST` | `/api/chat/conversations/:id/messages`| Protected | Send new message |

**Socket.io Events:**
- `join_room`: Join a conversation room
- `send_message` / `receive_message`: Real-time bidirectional message transfer
- `typing` / `stop_typing`: Typing indicators
- `doctor_status_change` / `doctor_status_updated`: Live doctor availability changes

### 🔬 Medical Scans & MRI (`/api/mri`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/mri/analyze` | Protected | Submit medical scan (file or CBC data) for ML analysis |
| `GET` | `/api/mri/history` | Protected | Retrieve user's past scan diagnostic history |
| `POST` | `/api/mri/upload` | Protected | Upload scan file to temporary storage |

---

## 🖥 Frontend Portals & Page Directory (31 Pages)

### 👤 1. Patient Portal (18 Pages — `AppShell`)
1. `/dashboard` — Patient Home Dashboard (stats, next appointment, quick actions)
2. `/find-doctors` — Search doctors by specialty, location, ratings & fees
3. `/doctors/:id` — Doctor profile view (experience, reviews, bio, book CTA)
4. `/booking/:doctorId` — Appointment booking workflow (date/slot/type selection)
5. `/appointments` — Active, completed, and upcoming appointments
6. `/appointments/:id` — Appointment details & pre-consultation summary
7. `/consult/:id` — Teleconsultation Video Room (Full-screen)
8. `/mri` or `/mri-lab` — AI Diagnostics Lab (MRI, Mammography, Blood & CT upload)
9. `/health` — Health Vault (Prescriptions, lab records, vitals history)
10. `/hospitals` — Hospital directory with locations and wait times
11. `/hospitals/:id` — Hospital details, facilities, and departments
12. `/articles` — Health & wellness educational library
13. `/article/:id` — Full medical article reader
14. `/chat` — Direct messaging with doctors (Socket.io)
15. `/family` — Family health management & dependent profiles
16. `/payments` — Transaction ledger, invoices & saved payment methods
17. `/upgrade` — Sushruth Pro tier subscription plans
18. `/profile` — Personal profile & account settings
19. `/ai` — Standalone Sushruth AI Health Assistant (Full-screen)

### 🩺 2. Doctor Portal (6 Pages — `DoctorShell`)
1. `/doctor/dashboard` — Doctor overview, today's patient queue, pending tasks
2. `/doctor/patients` — Assigned patient directory & medical histories
3. `/doctor/consult/:id` — Doctor video consultation interface (Full-screen)
4. `/doctor/mri-review/:id` — Review & verify AI-generated scan reports
5. `/doctor/earnings` — Financial payouts, consultation revenue analytics
6. `/doctor/availability` — Real-time schedule & toggle status (`Available`/`Offline`)
7. `/doctor/profile` — Doctor profile customization & clinical bio edit

### 🛡 3. Admin Portal (4 Pages — `AdminShell`)
1. `/admin` — System Overview (platform users, active doctors, revenue)
2. `/admin/verification` — Review medical licenses & doctor credentials
3. `/admin/analytics` — Platform metrics, usage trends & appointment analytics
4. `/admin/moderation` — Content review, dispute resolution & flagged reports

---

## 📊 Project Progress & Feature Tracker

Use this section to track completed work versus pending tasks.

### ✅ Completed & Fully Functional
- [x] **Universal Full-stack Architecture**: Concurrent launcher (`start.bat`) for Frontend, Backend, ML Service, and MongoDB.
- [x] **Authentication & Role Security**: Register, Login, JWT authorization, Password hashing (Bcrypt 12 rounds).
- [x] **Doctor Search & Directory**: Live MongoDB querying, specialty filtering, and doctor detail viewing.
- [x] **Appointment Booking Engine**: Slot booking with duplicate conflict detection and status updates (`confirmed`, `completed`, `cancelled`).
- [x] **Real-Time Live Chat**: Dual REST + Socket.io protocol with room handling, message persistence, and typing indicators.
- [x] **AI Diagnostic Engine**: 4 integrated deep learning models (Brain MRI ResNet-18, Breast MedMNIST, Blood CBC XGBoost, Spleen 3D UNet) + automatic fallback reporting.
- [x] **Scan History Vault**: Preserves past AI diagnostics in MongoDB `MriAnalysis`.
- [x] **Doctor Status Sync**: Real-time availability toggling via REST & WebSocket.
- [x] **Design System & Theme Engine**: Dark/Light mode switching, custom color accents, responsive mobile navigation, and Framer Motion transitions.
- [x] **Database Seeding Utility**: Pre-populates sample doctors, patients, conversations, and appointments.

---

### ⏳ Remaining Work & Implementation Backlog

#### 🔴 High Priority (Core Features with UI ready, needing Backend wiring)
- [ ] **Health Records API Integration**:
  - *Current*: Hardcoded in `src/data/prescriptions.js`.
  - *Needed*: Create backend `Prescription` and `LabReport` Mongoose models + CRUD API endpoints to link with `/health`.
- [ ] **Real LLM Integration for AI Assistant (`/ai`)**:
  - *Current*: Canned responses in `AiAssistant.jsx`.
  - *Needed*: Connect to Google Gemini API (or OpenAI) with medical safety prompt guardrails.
- [ ] **WebRTC Teleconsultation Room (`/consult/:id`)**:
  - *Current*: Simulated UI with a ticking timer.
  - *Needed*: Implement WebRTC peer-to-peer audio/video streaming (or integrate Agora/Daily.co/Twilio).
- [ ] **Payment Gateway Integration (`/payments`, `/upgrade`)**:
  - *Current*: Static transactions & client-side plan toggling.
  - *Needed*: Integrate Razorpay / Stripe backend webhooks, create `Transaction` model.
- [ ] **Live Doctor Dashboard & Queue (`/doctor/dashboard`)**:
  - *Current*: Static patient queue.
  - *Needed*: Connect queue to real `appointments` filtered for today and the logged-in doctor.

#### 🟠 Medium Priority (Secondary Portals & Content)
- [ ] **Family Health Management (`/family`)**:
  - *Current*: Static data in `prescriptions.js`.
  - *Needed*: Create `FamilyMember` schema connected to User accounts.
- [ ] **Hospitals Directory API (`/hospitals`)**:
  - *Current*: 6 hardcoded hospitals in `Hospitals.jsx`.
  - *Needed*: Create `Hospital` model & endpoints (or integrate Google Maps/Places API).
- [ ] **Health Articles CMS (`/articles`)**:
  - *Current*: 8 hardcoded articles in `Articles.jsx`.
  - *Needed*: Create `Article` model for dynamic publishing.
- [ ] **Doctor Financial Analytics (`/doctor/earnings`)**:
  - *Current*: Static charts.
  - *Needed*: MongoDB aggregation pipeline calculating earnings from completed consultations.
- [ ] **Doctor Patient Directory (`/doctor/patients`)**:
  - *Current*: Hardcoded patient list.
  - *Needed*: Query distinct patients from the doctor's appointment records.
- [ ] **Admin Control Panel API Wiring (`/admin/*`)**:
  - *Current*: Hardcoded stats across Overview, Verification, Analytics, and Moderation.
  - *Needed*: Platform-wide analytics aggregation endpoints and doctor approval workflow.

#### 🟢 Low Priority & Production Hardening
- [ ] **Push & In-App Notifications**:
  - *Current*: Hardcoded notifications array in Zustand store.
  - *Needed*: Backend `Notification` model with live Socket.io alerts.
- [ ] **Profile Editing Endpoints**:
  - *Current*: Read-only displays.
  - *Needed*: `PUT /api/auth/profile` and `PUT /api/doctors/profile` endpoints.
- [ ] **Add missing `nibabel` dependency**:
  - *Current*: 3D NIfTI volumes in `/predict/spleen` require `nibabel` which is omitted from `requirements.txt`.
  - *Needed*: Add `nibabel` to `ml_service/requirements.txt`.
- [ ] **Additional ML Models**:
  - Train and integrate real models for *Cardiac MRI*, *Spine MRI*, and *X-Ray* (currently using mock reports).
- [ ] **Containerization & Deployment**:
  - Create `Dockerfile` and `docker-compose.yml` for unified cloud deployment.

---

## 👥 Pre-configured Demo Accounts

Use these accounts after running `npm run seed`:

| Role | Email | Password | Details |
|---|---|---|---|
| **Patient** | `meera@example.com` | `password123` | Meera Sharma (Sample patient with appointment history) |
| **Doctor** | `arvind.rao@neurocare.com` | `password123` | Dr. Arvind Rao (Senior Neurologist, ₹600 fee) |
| **Doctor** | `priya.mehta@neurocare.com` | `password123` | Dr. Priya Mehta (Cardiologist, ₹700 fee) |
| **Doctor** | `rajesh.kumar@neurocare.com` | `password123` | Dr. Rajesh Kumar (General Physician, ₹200 fee) |
| **Admin** | `admin@neurocare.com` | `password123` | Admin User (Full administrative access) |

---

## 🗺 Roadmap & Next Steps

When resuming development, the recommended sequence of work is:
1. **Phase 1: Health Records & Prescriptions**: Wire the Patient Health Vault (`/health`) to MongoDB so doctors can write prescriptions and patients can view them.
2. **Phase 2: Live Doctor Queue**: Connect `/doctor/dashboard` to live appointment records.
3. **Phase 3: Sushruth AI Assistant**: Integrate Google Gemini API into `/ai` for interactive patient inquiry.
4. **Phase 4: Teleconsultation Video**: Add peer-to-peer WebRTC video calling between patient and doctor.
5. **Phase 5: Payments & Pro Subscriptions**: Implement Razorpay/Stripe checkout.
