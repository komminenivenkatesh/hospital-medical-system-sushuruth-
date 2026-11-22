import os
from PIL import Image, ImageDraw, ImageFont

def create_system_architecture_diagram(output_path="architecture_diagram.png"):
    width = 1920
    height = 1080
    img = Image.new("RGB", (width, height), (248, 250, 252)) # Light slate #F8FAFC
    draw = ImageDraw.Draw(img)

    # Attempt to load Arial or clean TrueType font, fallback to default
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 36)
        font_subtitle = ImageFont.truetype("arial.ttf", 20)
        font_tier = ImageFont.truetype("arialbd.ttf", 22)
        font_box_title = ImageFont.truetype("arialbd.ttf", 18)
        font_box_sub = ImageFont.truetype("arial.ttf", 14)
        font_box_body = ImageFont.truetype("arial.ttf", 13)
        font_proto = ImageFont.truetype("arialbd.ttf", 13)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = font_tier = font_box_title = font_box_sub = font_box_body = font_proto = font_title

    # Palette
    C_HEADER_BG = (15, 23, 42)       # #0F172A
    C_PRIMARY_BLUE = (2, 132, 199)    # #0284C7
    C_TEXT_DARK = (15, 23, 42)
    C_TEXT_MUTED = (71, 85, 105)      # #475569
    C_CARD_BG = (255, 255, 255)
    C_BORDER_LIGHT = (226, 232, 240)  # #E2E8F0
    C_CYAN_BG = (240, 249, 255)
    C_GREEN_BG = (240, 253, 244)
    C_PURPLE_BG = (250, 245, 255)
    C_AMBER_BG = (254, 252, 232)

    # Draw Top Header Banner
    draw.rectangle([(0, 0), (width, 100)], fill=C_HEADER_BG)
    draw.rectangle([(0, 95), (width, 100)], fill=C_PRIMARY_BLUE)
    draw.text((60, 20), "SUSHRUTH : SYSTEM ARCHITECTURE BLUEPRINT", fill=(255, 255, 255), font=font_title)
    draw.text((60, 64), "3-Tier Distributed Microservices | Multi-Organ AI Engine | Real-Time Teleconsultation Gateway", fill=(56, 189, 248), font=font_subtitle)

    def draw_box(x, y, w, h, title, subtitle, items, header_color, bg_color=C_CARD_BG, border_color=C_BORDER_LIGHT):
        # Card Background
        draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=12, fill=bg_color, outline=border_color, width=2)
        # Header area
        draw.rounded_rectangle([(x, y), (x + w, y + 42)], radius=12, fill=header_color)
        draw.rectangle([(x, y + 25), (x + w, y + 42)], fill=header_color) # square off bottom of header
        draw.text((x + 14, y + 10), title, fill=(255, 255, 255), font=font_box_title)
        
        curr_y = y + 52
        if subtitle:
            draw.text((x + 14, curr_y), subtitle, fill=header_color, font=font_box_sub)
            curr_y += 24
            draw.line([(x + 14, curr_y - 4), (x + w - 14, curr_y - 4)], fill=border_color, width=1)
            curr_y += 6

        for item in items:
            draw.text((x + 14, curr_y), item, fill=C_TEXT_DARK, font=font_box_body)
            curr_y += 21

    # Tier Section Labels
    def draw_tier_label(x, y, text, color):
        draw.rounded_rectangle([(x, y), (x + 360, y + 36)], radius=8, fill=color)
        draw.text((x + 16, y + 7), text, fill=(255, 255, 255), font=font_tier)

    # =========================================================================
    # TIER 1: CLIENT PRESENTATION LAYER (Top Section)
    # =========================================================================
    draw_tier_label(60, 125, "TIER 1 : CLIENT PRESENTATION LAYER", (30, 41, 59))
    draw.text((440, 134), "React 19 + Vite 8 Single-Page Application (Port: 5175)", fill=C_TEXT_MUTED, font=font_subtitle)

    # 3 Client Portals + Shared Core
    draw_box(60, 175, 420, 180, "PATIENT PORTAL (18 Pages)", "Role: Public & Registered Patients", [
        "• AI Diagnostics Lab & Scans History",
        "• Doctor Discovery & Slot Booking",
        "• Real-Time Doctor Chat & Prescriptions",
        "• Teleconsultation & Health Records Vault"
    ], (2, 132, 199), C_CYAN_BG)

    draw_box(510, 175, 420, 180, "DOCTOR PORTAL (6 Pages)", "Role: Verified Medical Specialists", [
        "• Live Patient Queue & Schedule Manager",
        "• AI Scan Diagnostic Verification & Notes",
        "• Real-Time Chat & Teleconsultation",
        "• Online Status Sync & Earnings Ledger"
    ], (13, 148, 136), C_GREEN_BG)

    draw_box(960, 175, 420, 180, "ADMIN PORTAL (4 Pages)", "Role: Platform Administrators", [
        "• Medical License & Doctor Verification",
        "• System Usage Metrics & Analytics",
        "• Platform Moderation & Dispute Handling",
        "• Role-Based Access Control Audit"
    ], (124, 58, 237), C_PURPLE_BG)

    draw_box(1410, 175, 450, 180, "FRONTEND CORE UTILITIES", "State & Network Infrastructure", [
        "• State Management: Zustand 5.0",
        "• UI Library: Material UI v9 & Emotion",
        "• Real-Time Client: Socket.io-client 4.8",
        "• HTTP Interceptors: Axios (JWT Tokens)"
    ], (71, 85, 105))

    # =========================================================================
    # PROTOCOL BRIDGES (Middle Connector Arrows)
    # =========================================================================
    # REST API Connector
    draw.rounded_rectangle([(300, 375), (850, 415)], radius=8, fill=(238, 242, 255), outline=(199, 210, 254), width=1)
    draw.text((320, 387), "HTTP / REST (Axios with Bearer JWT Authorization) ➔", fill=(67, 56, 202), font=font_proto)

    # WebSocket Connector
    draw.rounded_rectangle([(1050, 375), (1650, 415)], radius=8, fill=(240, 253, 250), outline=(153, 246, 228), width=1)
    draw.text((1070, 387), "◄➔ Bidirectional WebSockets (Socket.io Real-Time Protocol)", fill=(15, 118, 110), font=font_proto)

    # =========================================================================
    # TIER 2: API GATEWAY & BUSINESS LOGIC TIER
    # =========================================================================
    draw_tier_label(60, 435, "TIER 2 : API GATEWAY & ORCHESTRATION", (15, 23, 42))
    draw.text((490, 444), "Node.js & Express.js 4.21 Server (Port: 5000)", fill=C_TEXT_MUTED, font=font_subtitle)

    draw_box(60, 485, 420, 205, "SECURITY & MIDDLEWARE", "Security & Traffic Control", [
        "• JWT Verification & RBAC Guards",
        "• Bcrypt Password Hashing (12 Rounds)",
        "• Multer Multipart Scan File Ingestion",
        "• Helmet.js Security Headers & CORS",
        "• Express Rate-Limiting & Error Handler"
    ], (15, 23, 42))

    draw_box(510, 485, 420, 205, "CORE CONTROLLERS", "REST Routing & Logic", [
        "• authController (/api/auth)",
        "• doctorController (/api/doctors)",
        "• appointmentController (/api/appointments)",
        "• chatController (/api/chat)",
        "• mriController (Microservice Proxy)"
    ], (2, 132, 199))

    draw_box(960, 485, 420, 205, "REAL-TIME SOCKET.IO ENGINE", "WebSocket Event Handlers", [
        "• join_room (Isolated Chat Rooms)",
        "• send_message / receive_message",
        "• typing / stop_typing Indicators",
        "• doctor_status_change Sync",
        "• Live Availability Broadcasts"
    ], (13, 148, 136))

    draw_box(1410, 485, 450, 205, "FAILOVER & RESILIENCE ENGINE", "Automated Fault Tolerance", [
        "• Microservice Timeout Detection (60s)",
        "• Automated Mock Diagnostic Fallback",
        "• Uninterrupted User Consultation Flow",
        "• Automatic Error Logging & Recovery",
        "• Graceful Health Status Degradation"
    ], (217, 119, 6), C_AMBER_BG)

    # Connector Arrows down to Tier 3
    draw.rounded_rectangle([(300, 705), (820, 745)], radius=8, fill=(240, 253, 244), outline=(187, 247, 208), width=1)
    draw.text((320, 717), "Mongoose ODM (BSON / TCP Port 27017) ➔", fill=(21, 128, 61), font=font_proto)

    draw.rounded_rectangle([(1050, 705), (1650, 745)], radius=8, fill=(254, 242, 242), outline=(254, 202, 202), width=1)
    draw.text((1070, 717), "Axios Multipart Scan Stream / JSON (HTTP Port 5001) ➔", fill=(185, 28, 28), font=font_proto)

    # =========================================================================
    # TIER 3: PERSISTENCE & ML INFERENCE ENGINE
    # =========================================================================
    draw_tier_label(60, 765, "TIER 3A : PERSISTENCE LAYER", (5, 150, 105))
    draw_tier_label(760, 765, "TIER 3B : AI DIAGNOSTICS MICROSERVICE", (225, 29, 72))
    draw.text((1290, 774), "Python 3.10+ & Flask 3.1 (Port: 5001)", fill=C_TEXT_MUTED, font=font_subtitle)

    # Database Box
    draw_box(60, 815, 660, 220, "MONGODB PERSISTENCE ENGINE (Port: 27017)", "Local / Cloud Enterprise Cluster via Mongoose ODM", [
        "• users Collection: Auth profiles, hashed passwords, roles (patient, doctor, admin)",
        "• doctors Collection: Specializations, clinic fees, experience, real-time availability status",
        "• appointments Collection: Patient-doctor bookings, consultation slots, status tracking",
        "• conversations & messages Collections: Chat history, message timestamps, read status",
        "• mrianalyses Collection: AI diagnostic records, tumor types, severity scores (1-10), recommendations"
    ], (5, 150, 105), C_GREEN_BG)

    # 4 ML Models Box
    draw_box(760, 815, 1100, 220, "PYTHON AI / DEEP LEARNING DIAGNOSTICS ENGINE", "Sub-Second Clinical-Grade Inference on CPU (Flask + ONNX Runtime + PyTorch)", [
        "1. Brain MRI Tumor Classifier: ResNet-18 (ONNX) | 224x224x3 Tensor ➔ Glioma, Meningioma, Pituitary, Normal",
        "2. Breast Mammography Classifier: MedMNIST CNN (ONNX) | 224x224x3 Tensor ➔ Binary BI-RADS Benign vs Malignant",
        "3. Complete Blood Count Analyzer: XGBoost Classifier (PKL) | 6 Clinical Features ➔ Normal, Anemia, Infection, Leukemia",
        "4. Spleen CT 3D Segmentation: PyTorch 3D U-Net | [1, 1, 96, 96, 96] Voxels ➔ Spleen Volume (cm³) & Splenomegaly Ratio (>0.08)",
        "5. Automated Report Synthesizer: Translates logits into Clinical Severity Index (1-10), Organ Findings & Precautions"
    ], (225, 29, 72), (255, 241, 242))

    # Save Image
    img.save(output_path, "PNG", quality=95)
    print(f"System architecture diagram successfully saved to: {output_path}")

if __name__ == "__main__":
    create_system_architecture_diagram()
