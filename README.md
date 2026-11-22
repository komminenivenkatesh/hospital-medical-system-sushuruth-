# 🏥 Sushruth (NeuroCare) — AI-Integrated Healthcare Operating System & Telemedicine Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-1.22-005CED?logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.6-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Peer_to_Peer-333333?logo=webrtc&logoColor=white)](https://webrtc.org/)

**Sushruth** is a full-stack, distributed healthcare operating system and telemedicine platform engineered to solve outpatient diagnostic delays and specialist scarcity. It unifies **Computer-Aided Diagnosis (CAD)** powered by 4 deep learning/machine learning models with **instant browser-native WebRTC peer-to-peer video consultations**, real-time socket chat, and dedicated multi-role portals for **Patients**, **Doctors**, **Hospitals**, and **Administrators**.

---

## 📑 Table of Contents
1. [🌟 Key Highlights & Innovations](#-key-highlights--innovations)
2. [🏗 System Architecture](#-system-architecture)
3. [🧠 Multimodal AI Diagnostics Engine (4 Pipelines)](#-multimodal-ai-diagnostics-engine-4-pipelines)
4. [📹 WebRTC Telemedicine & Real-Time Engine](#-webrtc-telemedicine--real-time-engine)
5. [🖥 Multi-Role Portals & Page Map (31 Pages)](#-multi-role-portals--page-map-31-pages)
6. [🛠 Tech Stack Inventory](#-tech-stack-inventory)
7. [🚀 Quick Start & Installation Manual](#-quick-start--installation-manual)
8. [👥 Pre-Configured Demo Accounts](#-pre-configured-demo-accounts)
9. [📁 Project Codebase Structure](#-project-codebase-structure)
10. [🔒 Security, Compliance & Resiliency](#-security-compliance--resiliency)

---

## 🌟 Key Highlights & Innovations

- **Multimodal AI Diagnostics Suite**: Instant sub-second inference across 4 medical modalities:
  - 🧠 **Brain MRI** tumor classification via ResNet-18 (ONNX Runtime).
  - 🎗 **Breast Mammography** BI-RADS risk classification via MedMNIST CNN (ONNX Runtime).
  - 🩸 **Complete Blood Count (CBC)** hematology triage via XGBoost.
  - 🫁 **3D Volumetric Spleen CT** segmentation via PyTorch 3D U-Net.
- **Automated Clinical Reporting**: Generates standardized medical reports with an objective **Severity Score (1–10 Index)**, anatomical observations, and actionable next steps.
- **Synchronized WebRTC Telemedicine**: Full peer-to-peer video and audio consultation room with in-call chat, live duration timer, automatic track unmuting, and prescription dispatch.
- **Multi-Role RBAC Portals**: Context-optimized portals for:
  - 👤 **Patient Portal**: AI lab, appointment booking, health vault, family dependent records, and chat.
  - 🩺 **Doctor Workstation**: Patient queues, video consult room, MRI report verification, earnings analytics, and schedule manager.
  - 🏥 **Hospital Facility Dashboard**: ICU telemetry, real-time bed capacity, ambulance dispatch, and departmental wait times.
  - 🛡 **Admin Governance Suite**: Doctor license verification queue, fraud prevention, user analytics, and platform moderation.
- **Mobile-Responsive Architecture**: Glassmorphic UI with safe-area bottom docks, swipeable drawers, and mobile camera constraints.

---

## 🏗 System Architecture

Sushruth implements an enterprise 3-tier distributed microservices architecture:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TIER 1: PRESENTATION CLIENT                               │
│                         React 19.2 + Vite 8.0 SPA (Port: 5175)                         │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────────────────────┐  │
│  │ Patient Portal (19p)  │  │   Doctor Portal (7p)  │  │ Admin & Hospital Portals   │  │
│  └───────────────────────┘  └───────────────────────┘  └────────────────────────────┘  │
│        │ State: Zustand 5.0   │ UI: Material-UI v9    │ Motion: Framer Motion 12.4     │
│        │ Styling: Manrope CSS │ Charts: Recharts 3.8  │ Real-Time: Socket.io Client    │
└────────┼───────────────────────────────────────────────────────────▲───────────────────┘
         │ HTTP REST (Axios + JWT)                                   │ WebSockets & WebRTC
         ▼                                                           │
┌────────────────────────────────────────────────────────────────────┴───────────────────┐
│                           TIER 2: API GATEWAY & CONTROLLERS                            │
│                        Node.js + Express.js 4.21 (Port: 5000)                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Security: Helmet.js | CORS | Express-Rate-Limit | Bcryptjs (12 Salt Rounds)      │  │
│  │ Auth: JWT Bearer Tokens | RBAC Guard Middleware (Patient/Doctor/Hospital/Admin)  │  │
│  │ Ingestion: Multer (Memory / Multipart Disk Streaming)                            │  │
│  │ Real-Time: Socket.io 4.7 (Room Isolation, Chat History, Doctor Status Broadcast) │  │
│  │ WebRTC Signaling: SDP Offer/Answer Exchange & ICE Candidate Relays               │  │
│  │ Failover Engine: Axios Timeout Detection -> Automatic Structured Diagnostic Mock │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────┬──────────────────────────┘
               │ Mongoose 8.6 ODM (Port 27017)                │ HTTP POST (Port 5001)
               ▼                                              ▼
┌───────────────────────────────┐              ┌─────────────────────────────────────────┐
│     TIER 3A: PERSISTENCE      │              │     TIER 3B: AI DIAGNOSTICS ENGINE      │
│       MongoDB Database        │              │       Python Flask 3.1 Microservice     │
│  13 Production Collections:   │              │ 4 Deep Learning / Machine Learning Caps:│
│  Users, Doctors, Hospitals,   │              │ • Brain MRI: ResNet-18 (ONNX Runtime)   │
│  Appointments, Conversations, │              │ • Breast Cancer: MedMNIST (ONNX Runtime)│
│  Messages, MriAnalysis, etc.  │              │ • Blood CBC: XGBoost Classifier (PKL)   │
└───────────────────────────────┘              │ • Spleen CT: 3D U-Net (PyTorch Tensor)  │
                                               └─────────────────────────────────────────┘
```

---

## 🧠 Multimodal AI Diagnostics Engine (4 Pipelines)

The Python Flask microservice (`ml_service`) performs sub-second CPU inference using lightweight, quantized neural networks:

| Modality | Architecture / Format | Input Tensor | Diagnostic Classes | Severity Index |
|---|---|---|---|:---:|
| **Brain MRI** | ResNet-18 (`.onnx`) | `[1, 3, 224, 224]` Float32 | `glioma`, `meningioma`, `pituitary`, `no_tumor` | **1 to 8 / 10** |
| **Breast Mammogram** | MedMNIST CNN (`.onnx`) | `[1, 3, 224, 224]` Float32 | `malignant` (BI-RADS 5), `benign` (BI-RADS 2) | **1 to 9 / 10** |
| **Blood CBC Panel** | XGBoost Classifier (`.pkl`) | 6 numeric biomarkers (`wbc`, `rbc`, `hb`, `plt`, `neu`, `lym`) | `Normal`, `Anemia`, `Infection`, `Leukemia` | **1 to 9 / 10** |
| **Spleen CT Scan** | PyTorch 3D U-Net (`.pt`) | `[1, 1, 96, 96, 96]` Voxels | Voxel-level segmentation, Volume ($cm^3$), Splenomegaly diagnosis | **1 to 7 / 10** |

---

## 📹 WebRTC Telemedicine & Real-Time Engine

- **Signaling Layer**: Handled via Socket.io over port `5000` with ICE candidate exchange and SDP Offer/Answer negotiation.
- **Media Pipeline**:
  - Direct hardware transceiver matching for audio (`Opus`) and video (`VP8/H.264`).
  - Native video re-binding on packet unmute events.
  - Safe mobile aspect ratio constraints with user-facing camera selection.
  - Dual stream isolation (muted `<video>` for hardware decoding + separate `<audio>` element for playback).
- **Synchronized Rooms**: Doctor and Patient portals automatically converge into shared consultation rooms (`/doctor/consult/a001` and `/consult/a001`).

---

## 🖥 Multi-Role Portals & Page Map (31 Pages)

### 👤 Patient Portal (`/`)
- `/dashboard` — Clinical overview, vital cards, and appointment actions
- `/find-doctors` — Advanced doctor directory with specialty, location, and fee filters
- `/doctors/:id` — Doctor profile, patient reviews, credentials, and booking CTA
- `/booking/:doctorId` — Interactive calendar slot booking with conflict detection
- `/appointments` — Active, upcoming, and past consultation records
- `/appointments/:id` — Pre-consultation summary and clinical instructions
- `/consult/:id` — Full-screen WebRTC video consultation room
- `/mri` — AI Medical Scan Analysis workstation (MRI, Mammogram, Blood, CT)
- `/health` — Health Vault (digital prescriptions, lab reports, and vital tracking)
- `/hospitals` — Hospital directory with live ICU bed telemetry and wait times
- `/hospitals/:id` — Hospital specialty departments and facility contact
- `/articles` — Evidence-based medical and wellness articles
- `/article/:id` — Full article reader with specialist author attribution
- `/chat` — Direct real-time doctor chat with typing indicators
- `/family` — Family health accounts and dependent medical records
- `/payments` — Transaction ledger, invoice download, and billing methods
- `/upgrade` — Sushruth Pro tier subscription plans
- `/profile` — Personal patient health profile and demographics
- `/ai` — Standalone Sushruth AI Health Assistant

### 🩺 Doctor Workstation (`/doctor/*`)
- `/doctor/dashboard` — Daily consultation schedule, patient queue, and task list
- `/doctor/patients` — Assigned patient directory with medical history review
- `/doctor/chat` — Real-time doctor-patient communication workstation
- `/doctor/consult/:id` — Doctor consultation room with integrated prescription writer
- `/doctor/mri-review/:id` — AI scan verification and sign-off module
- `/doctor/earnings` — Payout ledger, consultation revenue, and analytics
- `/doctor/availability` — Real-time availability toggling (`Available` / `Busy` / `Offline`)
- `/doctor/profile` — Clinical bio, consultation fees, and qualification editor

### 🛡 Admin Governance Suite (`/admin/*`)
- `/admin` — System overview with active user metrics and revenue stats
- `/admin/verification` — Medical license review and doctor credential approvals
- `/admin/analytics` — Platform-wide diagnostic utilization and consultation trends
- `/admin/moderation` — Content moderation, review flags, and audit logs

### 🏥 Hospital Operations (`/hospital/*`)
- `/hospital/dashboard` — ICU/Oxygen bed status, emergency wait times, and ambulance dispatch

---

## 🛠 Tech Stack Inventory

| Domain | Technology | Version | Key Purpose |
|---|---|---|---|
| **Frontend** | React | `19.2.6` | Component UI and declarative rendering |
| **Bundler** | Vite | `8.0.12` | Lightning-fast HMR and production bundling |
| **Component Library**| Material UI (MUI) | `9.0.1` | Clean healthcare design tokens and accessibility |
| **Typography** | Fontsource Manrope| `5.2.8` | High-legibility clinical typography |
| **State Management** | Zustand | `5.0.14` | Client-side reactive store |
| **Routing** | React Router DOM | `7.17.0` | Nested RBAC protected route management |
| **Real-Time Client** | Socket.io-client | `4.8.3` | Duplex communication & WebRTC signaling |
| **Visuals & Charts** | Recharts / Framer Motion | `3.8` / `12.4` | Health analytics charts and fluid transitions |
| **3D Graphics** | Cobe | `2.0.1` | Interactive WebGL network globe |
| **Backend API** | Node.js / Express | `18+` / `4.21` | REST API gateway and controllers |
| **Database & ODM** | MongoDB / Mongoose | `8.6.0` | Document database across 13 collections |
| **Real-Time Server** | Socket.io | `4.7.5` | WebSocket server with room isolation |
| **AI Microservice** | Python / Flask | `3.10+` / `3.1` | Dedicated neural inference microservice |
| **Deep Learning** | PyTorch & ONNX Runtime | `2.x` / `1.22` | CPU-accelerated tensor inference |
| **Tabular ML** | XGBoost / Scikit-Learn | `2.x` / `1.4` | Complete blood count classification |

---

## 🚀 Quick Start & Installation Manual

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** running locally on port `27017`

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/komminenivenkatesh/hospital-medical-system-sushuruth-.git
cd hospital-medical-system-sushuruth-

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install Python ML dependencies
pip install -r ml_service/requirements.txt
```

### 2. Seed the Database
Populate MongoDB with default clinical fixtures, doctors, appointments, and medical records:
```bash
npm run seed
```

### 3. Launch the Application
Start MongoDB, the Python ML Service, Express Backend, and Vite Frontend concurrently with a single command:
```bash
npm start
```
*(Or run `npm run dev:all`)*

| Service | Port | URL |
|---|---|---|
| **Frontend Web Client** | `5175` | `http://localhost:5175` |
| **Express API Gateway** | `5000` | `http://localhost:5000` |
| **Python ML Microservice** | `5001` | `http://localhost:5001` |
| **MongoDB Instance** | `27017` | `mongodb://localhost:27017/neurocare` |

---

## 👥 Pre-Configured Demo Accounts

Use these pre-seeded accounts to experience all role-based portals:

| Role | Email | Password | Access / Capabilities |
|---|---|---|---|
| **Patient** | `meera@example.com` | `password123` | Patient Portal, AI MRI Lab, Bookings, Health Vault |
| **Doctor** | `arvind.rao@neurocare.com` | `password123` | Doctor Workstation, Video Room, Rx Generator |
| **Doctor** | `priya.mehta@neurocare.com` | `password123` | Cardiologist Workstation, Patient Review Queue |
| **Doctor** | `rajesh.kumar@neurocare.com` | `password123` | General Physician Workstation |
| **Admin** | `admin@neurocare.com` | `password123` | Admin Portal, Doctor Verification, Analytics |

---

## 📁 Project Codebase Structure

```
sushuruth/
├── backend/                       # Node.js + Express API Gateway (Port 5000)
│   ├── config/                    # Database (db.js) & Socket.io (socket.js)
│   ├── controllers/               # 12 Express controllers handling business logic
│   ├── middleware/                # JWT verification & error handling guards
│   ├── models/                    # 13 Mongoose Schemas (User, Doctor, Appointment, Rx...)
│   ├── routes/                    # REST API routes (/api/*)
│   ├── seed.js                    # Full database clinical seeder
│   └── server.js                  # Gateway bootstrap & HTTP/WS server
├── ml_service/                    # Python Flask Inference Service (Port 5001)
│   ├── app.py                     # Flask inference endpoints (/predict/*)
│   ├── unet3d.py                  # PyTorch 3D U-Net architectural definition
│   ├── requirements.txt           # Python library specifications
│   └── models/                    # Serialized ONNX, PKL, and PT weights
├── src/                           # React 19 Frontend Client (Port 5175)
│   ├── components/                # Reusable UI widgets, cards, and modal components
│   ├── context/                   # AuthContext with session persistence
│   ├── data/                      # Fallback clinical fixtures & doctor profiles
│   ├── hooks/                     # Custom hooks (useWebRTC.js)
│   ├── layout/                    # AppShell, DoctorShell, AdminShell, TopNav, MobileNav
│   ├── pages/                     # 31 Clinical application views
│   │   ├── auth/                  # Login and multi-role Signup
│   │   ├── patient/               # 19 Patient portal pages (Dashboard, MriLab, Health...)
│   │   ├── doctor/                # 7 Doctor workstation pages (Dashboard, Consult...)
│   │   ├── admin/                 # 4 Governance pages (Overview, Verification...)
│   │   └── hospital/              # Facility dashboard
│   ├── services/                  # Axios HTTP client (api.js) and socket singleton
│   ├── store/                     # Zustand state store (useStore.js)
│   └── theme/                     # Material UI clinical design tokens
├── package.json                   # Root orchestrator scripts
└── vite.config.js                 # Bundler config with API proxy
```

---

## 🔒 Security, Compliance & Resiliency

- **Stateless Authentication**: Signed JSON Web Tokens (JWT) with HTTP-only Authorization Bearer interceptors.
- **Password Security**: Salted Bcrypt hashing with 12 rounds.
- **Network Hardening**: Helmet HTTP headers, CORS origin whitelisting, and Express rate limiting.
- **Failover Engine**: If the ML service is offline or processing is delayed, the API Gateway seamlessly activates structured heuristic diagnostic generators, guaranteeing zero user-facing downtime.

---

## 📄 License
This project is developed for academic, research, and healthcare technology evaluation purposes.
