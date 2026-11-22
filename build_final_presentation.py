import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_sushruth_final_22_slides():
    template_path = "Sushuruth .pptx"
    output_path = "Sushuruth_Final_Review_Presentation.pptx"
    
    prs = Presentation(template_path)
    layout = prs.slide_layouts[0]
    
    # Keep slide 0 (Title Slide) exactly as is, remove slides 1..8
    for i in range(len(prs.slides) - 1, 0, -1):
        rId = prs.slides._sldIdLst[i].rId
        prs.part.drop_rel(rId)
        del prs.slides._sldIdLst[i]
        
    print(f"Base prepared with Slide 1 preserved. Current slide count: {len(prs.slides)}")
    
    # Styling Constants matching SRM Template
    COLOR_TITLE = RGBColor(31, 31, 31)         # #1F1F1F (Times New Roman 30pt Bold)
    COLOR_HEADING = RGBColor(0, 102, 204)       # #0066CC (SRM Royal Blue 20-22pt Bold)
    COLOR_BODY = RGBColor(40, 40, 40)          # #282828 (16-18pt Regular)
    COLOR_MUTED = RGBColor(100, 100, 100)      # Gray subtext
    COLOR_LINE = RGBColor(127, 127, 127)       # Line under title
    COLOR_CARD_BG = RGBColor(248, 250, 252)    # Clean off-white card fill
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)# Soft border
    FONT_NAME = "Times New Roman"

    def create_content_slide(title_text):
        slide = prs.slides.add_slide(layout)
        # Clear any auto-generated shapes
        for s in list(slide.shapes):
            sp = s._element
            sp.getparent().remove(sp)
            
        # Add Title Box
        title_box = slide.shapes.add_textbox(Inches(0.7), Inches(0.45), Inches(10.29), Inches(0.75))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = FONT_NAME
        p.font.size = Pt(30)
        p.font.bold = True
        p.font.color.rgb = COLOR_TITLE
        
        # Add Horizontal Accent Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.7), Inches(1.25), Inches(1.5), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_HEADING
        line.line.fill.background()
        
        return slide

    def add_section(slide, top_in, heading, bullets, height_in=1.8, is_lead=False):
        box = slide.shapes.add_textbox(Inches(0.7), Inches(top_in), Inches(10.29), Inches(height_in))
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Heading paragraph
        p_head = tf.paragraphs[0]
        p_head.text = heading
        p_head.font.name = FONT_NAME
        p_head.font.size = Pt(21)
        p_head.font.bold = True
        p_head.font.color.rgb = COLOR_HEADING
        
        # Bullets
        for b in bullets:
            p = tf.add_paragraph()
            p.text = f"•  {b}" if not b.startswith("•") else b
            p.font.name = FONT_NAME
            p.font.size = Pt(17)
            p.font.color.rgb = COLOR_BODY
            p.space_before = Pt(4)

    def add_two_cards(slide, top_in, left_data, right_data, height_in=5.4):
        # Left card
        card_l = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.7), Inches(top_in), Inches(5.0), Inches(height_in))
        card_l.fill.solid()
        card_l.fill.fore_color.rgb = COLOR_CARD_BG
        card_l.line.color.rgb = COLOR_CARD_BORDER
        card_l.line.width = Pt(1.5)
        
        tf_l = card_l.text_frame
        tf_l.word_wrap = True
        tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = Inches(0.2)
        p_l = tf_l.paragraphs[0]
        p_l.text = left_data["title"]
        p_l.font.name = FONT_NAME
        p_l.font.size = Pt(20)
        p_l.font.bold = True
        p_l.font.color.rgb = COLOR_HEADING
        
        for b in left_data["bullets"]:
            p = tf_l.add_paragraph()
            p.text = f"•  {b}"
            p.font.name = FONT_NAME
            p.font.size = Pt(15.5)
            p.font.color.rgb = COLOR_BODY
            p.space_before = Pt(5)

        # Right card
        card_r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.99), Inches(top_in), Inches(5.0), Inches(height_in))
        card_r.fill.solid()
        card_r.fill.fore_color.rgb = COLOR_CARD_BG
        card_r.line.color.rgb = COLOR_CARD_BORDER
        card_r.line.width = Pt(1.5)
        
        tf_r = card_r.text_frame
        tf_r.word_wrap = True
        tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = Inches(0.2)
        p_r = tf_r.paragraphs[0]
        p_r.text = right_data["title"]
        p_r.font.name = FONT_NAME
        p_r.font.size = Pt(20)
        p_r.font.bold = True
        p_r.font.color.rgb = COLOR_HEADING
        
        for b in right_data["bullets"]:
            p = tf_r.add_paragraph()
            p.text = f"•  {b}"
            p.font.name = FONT_NAME
            p.font.size = Pt(15.5)
            p.font.color.rgb = COLOR_BODY
            p.space_before = Pt(5)

    def add_table_slide(slide, top_in, headers, rows_data, col_widths):
        rows = len(rows_data) + 1
        cols = len(headers)
        table_shape = slide.shapes.add_table(rows, cols, Inches(0.7), Inches(top_in), Inches(10.29), Inches(5.2))
        table = table_shape.table
        
        for i, w in enumerate(col_widths):
            table.columns[i].width = Inches(w)
            
        for i, h in enumerate(headers):
            cell = table.cell(0, i)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(15, 23, 42)
            p = cell.text_frame.paragraphs[0]
            p.text = h
            p.font.name = FONT_NAME
            p.font.bold = True
            p.font.size = Pt(15)
            p.font.color.rgb = RGBColor(255, 255, 255)
            p.alignment = PP_ALIGN.CENTER
            
        for r_idx, r_data in enumerate(rows_data, start=1):
            for c_idx, val in enumerate(r_data):
                cell = table.cell(r_idx, c_idx)
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if r_idx % 2 == 1 else RGBColor(241, 245, 249)
                p = cell.text_frame.paragraphs[0]
                p.text = val
                p.font.name = FONT_NAME
                p.font.size = Pt(14)
                p.font.color.rgb = COLOR_BODY
                if c_idx == 0:
                    p.font.bold = True
                    p.font.color.rgb = COLOR_HEADING

    # =========================================================================
    # SLIDE 2: Table of Contents / Presentation Outline
    # =========================================================================
    s2 = create_content_slide("Presentation Outline")
    s2_left = {
        "title": "Part I: Foundations & Design",
        "bullets": [
            "1. Introduction & Clinical Motivation",
            "2. Background & Healthcare Domain",
            "3. Literature Review & Benchmark Papers",
            "4. Existing Systems Comparative Analysis",
            "5. Problem Statement & Research Gaps",
            "6. Project Objectives & Target Outcomes",
            "7. System Design & 3-Tier Architecture",
            "8. End-to-End Dataflow & Sequence Pipeline"
        ]
    }
    s2_right = {
        "title": "Part II: Implementation & Results",
        "bullets": [
            "9. Proposed Methodology & ML Pipeline",
            "10. 4 Diagnostic Models Specifications",
            "11. Project Planning & 9-Week Gantt Chart",
            "12. Full-Stack Implementation Details",
            "13. Multi-Role Portals (Patient, Doctor, Admin)",
            "14. Experimental Results & Metrics",
            "15. System Evaluation & Latency Benchmarks",
            "16. Conclusion, Future Scope & References"
        ]
    }
    add_two_cards(s2, 1.6, s2_left, s2_right, 5.5)

    # =========================================================================
    # SLIDE 3: Introduction & Clinical Motivation
    # =========================================================================
    s3 = create_content_slide("Introduction & Clinical Motivation")
    add_section(s3, 1.5, "The Clinical Reality in Contemporary Healthcare", [
        "Severe Doctor-to-Patient Deficit: India has an acute ratio of 1:1,456 (falling far below WHO's 1:1,000 threshold).",
        "Urban-Rural Radiologist Disparity: Over 70% of certified oncologists and radiologists are clustered in tier-1 metro cities.",
        "Diagnostic Latency: Patients wait 24 to 72 hours for specialist scan interpretations, creating clinical progression risks."
    ], height_in=2.2)
    add_section(s3, 4.3, "The Sushruth Solution Concept", [
        "Unified Telemedicine & AI Copilot: Connects patients, diagnostic imaging, and specialists within a single web platform.",
        "Sub-Second Pre-screening: Instant automated multi-organ triage for Brain, Breast, Blood, and Spleen scans.",
        "Doctor-in-the-Loop Philosophy: Designed as a clinical decision-support copilot to assist certified physicians, not replace them."
    ], height_in=2.5)

    # =========================================================================
    # SLIDE 4: Background and Healthcare Domain
    # =========================================================================
    s4 = create_content_slide("Background and Healthcare Domain")
    s4_left = {
        "title": "HealthTech Domain Landscape",
        "bullets": [
            "Healthcare Technology (HealthTech) & Medical AI.",
            "Computer-Aided Diagnosis (CAD) for radiological imaging.",
            "Clinical Decision Support Systems (CDSS) for laboratory hematology.",
            "Telemedicine & real-time bidirectional clinical communication via WebSockets.",
            "Longitudinal Electronic Health Records (EHR) digital vaults."
        ]
    }
    s4_right = {
        "title": "Core Project Diagnostic Pillars",
        "bullets": [
            "Neuro-Oncology: Brain MRI slice classification (Glioma, Meningioma, Pituitary, Normal).",
            "Breast Oncology: Mammography BI-RADS risk classification (Benign vs Malignant).",
            "Hematology: Complete Blood Count (CBC) automated interpretation.",
            "Abdominal Volumetrics: 3D Spleen CT segmentation for Splenomegaly organ enlargement detection."
        ]
    }
    add_two_cards(s4, 1.6, s4_left, s4_right, 5.5)

    # =========================================================================
    # SLIDE 5: Literature Review — Foundational Research
    # =========================================================================
    s5 = create_content_slide("Literature Review — Foundational Papers")
    headers5 = ["Paper & Author", "Methodology & Architecture", "Key Findings & Metrics", "Research Gap / Sushruth Takeaway"]
    rows5 = [
        ["Deepak & Ameer (2019) [1]", "Pretrained GoogLeNet / ResNet CNN on Figshare Brain MRI dataset", "97.2% multiclass accuracy on Glioma, Meningioma, Pituitary", "Evaluated strictly in offline isolation; lacked integration with clinical scheduling."],
        ["Shen et al. (2019) [2]", "End-to-end Deep Convolutional Network on CBIS-DDSM mammography", "AUC 0.91 in benign vs. malignant lesion classification", "Heavy parameter footprint; unoptimized for sub-second web microservice inference."],
        ["Ronneberger et al. (2015) [5]", "U-Net: Encoder-Decoder with residual skip connections", "High Dice score on sparse biomedical image annotations", "Pioneered biomedical segmentation; restricted to 2D image coordinates."],
        ["Çiçek et al. (2016) [6]", "3D U-Net: Dense volumetric segmentation on 3D CT/MRI arrays", "Superior spatial boundary capture across sparse 3D organ slices", "Confined to standalone desktop research workstations; absent from web portals."]
    ]
    add_table_slide(s5, 1.6, headers5, rows5, [2.3, 2.7, 2.3, 2.99])

    # =========================================================================
    # SLIDE 6: Literature Review — Benchmarks & Tabular AI
    # =========================================================================
    s6 = create_content_slide("Literature Review — Benchmarks & Tabular AI")
    headers6 = ["Benchmark & Author", "Domain Focus", "Clinical Relevance", "Implementation in Sushruth"]
    rows6 = [
        ["Yang et al. (2023) [4]\nMedMNIST v2", "Lightweight 2D/3D biomedical image classification benchmark", "Standardized validation on BreastMNIST without massive server GPU compute requirements", "Adopted ONNX-quantized MedMNIST CNN model for sub-second breast cancer risk triage."],
        ["Chen & Guestrin (2016) [3]\nXGBoost System", "Scalable, sparsity-aware gradient boosted decision tree ensembles", "State-of-the-art accuracy on structured clinical lab parameters over deep networks", "Deployed XGBoost classifier for multi-parameter Complete Blood Count (CBC) interpretation."],
        ["World Health Organization\n(WHO 2020-2025)", "Global strategy on Digital Health & Teleconsultation adoption", "Highlights urgent need for interoperable, accessible digital platforms in underserved regions", "Forms the ethical and structural foundation for Sushruth's doctor-in-the-loop architecture."]
    ]
    add_table_slide(s6, 1.6, headers6, rows6, [2.2, 2.5, 2.6, 2.99])

    # =========================================================================
    # SLIDE 7: Existing Systems & Limitations (Table I)
    # =========================================================================
    s7 = create_content_slide("Existing Systems and Their Limitations")
    headers7 = ["Platform", "What It Offers", "Critical Limitations", "Sushruth Advantage"]
    rows7 = [
        ["Practo", "Online doctor directory & appointment booking", "Zero AI scan analysis; patients receive raw scans with no automated triage", "Integrates multi-organ AI diagnostics directly with slot booking"],
        ["Apollo 24|7", "Telemedicine consultations & basic health record storage", "No ML-based scan interpretation; purely a scheduling intermediary", "Automated clinical findings & severity scores pre-screened before consult"],
        ["Aidoc (USA)", "Enterprise AI radiology triage for hospital PACS", "High enterprise cost, proprietary, inaccessible to outpatient consumers", "Open web-based platform accessible directly to patients and clinics"],
        ["Google Health /\nDeepMind", "Research-grade medical AI models & benchmarks", "Research-focused; lacks a unified, production patient-facing platform", "Production 3-tier web platform with real-time Socket.io doctor chat"]
    ]
    add_table_slide(s7, 1.6, headers7, rows7, [1.8, 2.6, 2.8, 3.09])

    # =========================================================================
    # SLIDE 8: Problem Statement & Research Gaps
    # =========================================================================
    s8 = create_content_slide("Problem Statement & Identified Gaps")
    s8_left = {
        "title": "The Four Systemic Healthcare Gaps",
        "bullets": [
            "Diagnostic Fragmentation: Patients obtain scan files with zero explanation, resulting in acute panic and consultation delays.",
            "Specialist Access Bottleneck: Rural clinics lack on-site radiologists, requiring patients to travel hundreds of kilometers for routine scan reviews.",
            "Manual Laboratory Review: Routine Complete Blood Count (CBC) analysis relies entirely on manual technician reviews with no triage flags.",
            "Neglect of 3D Volumetrics: Most browser apps compress scans into 2D JPEGs, discarding the z-axis depth vital for organ enlargement diagnosis."
        ]
    }
    s8_right = {
        "title": "Formal Problem Statement",
        "bullets": [
            "Existing healthcare solutions operate either as clerical booking tools or isolated academic AI scripts.",
            "There is a total absence of a unified, production-ready, open-access platform that integrates multi-organ AI diagnostics (Brain, Breast, Blood, 3D Spleen) with structured clinical report synthesis and instantaneous doctor teleconsultation.",
            "Sushruth bridges this exact systemic void."
        ]
    }
    add_two_cards(s8, 1.6, s8_left, s8_right, 5.5)

    # =========================================================================
    # SLIDE 9: Project Objectives & Expected Outcomes
    # =========================================================================
    s9 = create_content_slide("Project Objectives & Target Outcomes")
    add_section(s9, 1.5, "Primary Engineering Objectives", [
        "1. Build a Distributed 3-Tier Web Architecture uniting React 19, Express.js, and Flask into a cohesive healthcare system.",
        "2. Develop & Deploy 4 Clinical-Grade ML Pipelines: ResNet-18 (Brain), MedMNIST (Breast), XGBoost (Blood), and 3D U-Net (Spleen).",
        "3. Automate Clinical Report Synthesis: Translate raw neural logits into structured reports with a 1–10 Severity Index.",
        "4. Implement Real-Time Teleconsultation: WebSocket-powered chat with room isolation, typing indicators, and doctor status sync."
    ], height_in=2.6)
    add_section(s9, 4.4, "Expected Clinical & Technical Outcomes", [
        "• Sub-Second AI Inference: Achieve under 500ms CPU inference time across all 2D models using ONNX Runtime.",
        "• High Diagnostic Sensitivity: Attain >95% accuracy for Brain MRI and >0.85 Dice similarity for 3D Spleen segmentation.",
        "• Zero-Downtime Telehealth Experience: Resilient failover mechanism ensuring continuous consultation if microservices time out."
    ], height_in=2.4)

    # =========================================================================
    # SLIDE 10: System Design & 3-Tier Architecture
    # =========================================================================
    s10 = create_content_slide("System Design & 3-Tier Architecture")
    if os.path.exists("architecture_diagram.png"):
        s10.shapes.add_picture("architecture_diagram.png", Inches(0.7), Inches(1.5), width=Inches(10.29), height=Inches(5.6))
    else:
        # Fallback card view if image missing
        s10_l = {"title": "Frontend & Gateway", "bullets": ["React 19 + Vite 8 SPA (Port 5175)", "Node.js Express 4.21 Gateway (Port 5000)", "Socket.io 4.7 WebSocket duplex protocol"]}
        s10_r = {"title": "AI Engine & Database", "bullets": ["Python Flask 3.1 Microservice (Port 5001)", "ONNX Runtime 1.22 & PyTorch 3D U-Net", "MongoDB 8 (Port 27017) with 13 Mongoose Schemas"]}
        add_two_cards(s10, 1.6, s10_l, s10_r, 5.5)

    # =========================================================================
    # SLIDE 11: End-to-End Dataflow & Sequence Pipeline
    # =========================================================================
    s11 = create_content_slide("End-to-End Dataflow & Sequence Pipeline")
    headers11 = ["Step & Stage", "Component Involved", "Data Protocol / Format", "Operation & Clinical Impact"]
    rows11 = [
        ["1. Scan Ingestion", "React 19 Frontend (/mri-lab)", "Multipart / Form-Data or JSON", "Patient uploads scan slice or inputs 6 CBC clinical parameters."],
        ["2. Gateway Verification", "Express API Gateway (Port 5000)", "Bearer JWT Authorization", "Validates session, enforces rate-limiting, and streams file to Python service."],
        ["3. AI Inference", "Python Flask (Port 5001)", "ONNX Runtime / PyTorch Tensor", "Preprocesses inputs, computes tensor forward pass, calculates probabilities & 3D volume."],
        ["4. Report Synthesis", "Cross-Modal Report Engine", "Structured JSON Schema", "Maps logits to Severity Index (1–10), organ status, and doctor recommendations."],
        ["5. Database Persistence", "MongoDB (Port 27017)", "Mongoose ODM (MriAnalysis)", "Permanently stores diagnostic report into patient's longitudinal health vault."],
        ["6. Real-Time Handoff", "Socket.io WebSocket Server", "WebSocket Event Broadcast", "Emits instant alert to doctor's review queue for verification & teleconsultation."]
    ]
    add_table_slide(s11, 1.6, headers11, rows11, [1.8, 2.5, 2.5, 3.49])

    # =========================================================================
    # SLIDE 12: Proposed Methodology — Workflow
    # =========================================================================
    s12 = create_content_slide("Proposed Methodology — Workflow")
    add_section(s12, 1.5, "Standardized Clinical AI Development Pipeline", [
        "1. Data Acquisition: Curate benchmark datasets for Brain MRI (Figshare), Breast (MedMNIST), Blood (CBC), and Spleen CT (MSD).",
        "2. Preprocessing & Normalization: Standardize image inputs to 224x224x3 tensors; resample 3D volumes into 96x96x96 voxel grids.",
        "3. Model Architecture Selection: Match data modality to optimal neural/tree algorithms (ResNet, MedMNIST CNN, XGBoost, 3D U-Net).",
        "4. Quantization & Export: Convert trained PyTorch models to ONNX Runtime format to eliminate heavy GPU runtime requirements."
    ], height_in=2.6)
    add_section(s12, 4.4, "Clinical Translation & Integration", [
        "• Human-Readable Medical Synthesis: Replace raw probability vectors with clinically interpretable risk scores (1 to 10).",
        "• Tripartite Role Synchronization: Automatically route high-severity scans directly to specialist review queues.",
        "• Resilient Fallback Protocol: Guard all API calls with 60-second timeouts and automatic emergency diagnostic mock reports."
    ], height_in=2.4)

    # =========================================================================
    # SLIDE 13: AI Diagnostic Modules (Brain & Breast)
    # =========================================================================
    s13 = create_content_slide("Diagnostic Modules — Brain & Breast Imaging")
    s13_left = {
        "title": "Brain MRI Tumor Classifier",
        "bullets": [
            "Model Architecture: Deep Residual Network (ResNet-18).",
            "Execution Engine: ONNX Runtime (CPU optimized).",
            "Input Tensor: [1, 3, 224, 224] normalized axial slice.",
            "Diagnostic Classes & Risk Severity:",
            "  • Glioma (Severity: 8/10, High Risk, invasive mass)",
            "  • Meningioma (Severity: 5/10, Moderate Risk, dural)",
            "  • Pituitary (Severity: 4/10, Moderate Risk, sellar)",
            "  • No Tumor (Severity: 1/10, Low Risk, normal parenchyma)",
            "Endpoint: POST /predict/brain (Sub-200ms latency)."
        ]
    }
    s13_right = {
        "title": "Breast Mammography Classifier",
        "bullets": [
            "Model Architecture: MedMNIST v2 Deep CNN.",
            "Execution Engine: ONNX Runtime graph execution.",
            "Input Tensor: [1, 3, 224, 224] scaled mammogram slice.",
            "Diagnostic Classes & Risk Severity:",
            "  • Malignant (Severity: 9/10, High Risk, BI-RADS 5)",
            "  • Benign (Severity: 1/10, Low Risk, BI-RADS 2)",
            "Clinical Objective: Rapid automated mammography pre-screening to eliminate delays in surgical oncology referrals.",
            "Endpoint: POST /predict/breast (Sub-150ms latency)."
        ]
    }
    add_two_cards(s13, 1.6, s13_left, s13_right, 5.5)

    # =========================================================================
    # SLIDE 14: AI Diagnostic Modules (Blood & 3D Spleen CT)
    # =========================================================================
    s14 = create_content_slide("Diagnostic Modules — Blood & 3D Spleen CT")
    s14_left = {
        "title": "Complete Blood Count (CBC) Analyzer",
        "bullets": [
            "Model Architecture: XGBoost Tabular Classifier.",
            "Input Data: 6 Standardized Clinical Blood Parameters:",
            "  • White Blood Cells (WBC), Red Blood Cells (RBC)",
            "  • Hemoglobin (Hb), Platelets, Neutrophils, Lymphocytes",
            "Diagnostic Classes & Severity:",
            "  • Normal (Severity: 1/10)",
            "  • Anemia (Severity: 4/10, Low Hb/RBC)",
            "  • Infection (Severity: 5/10, Elevated leukocytes)",
            "  • Leukemia (Severity: 9/10, Acute blast spikes)",
            "Endpoint: POST /predict/blood (JSON payload)."
        ]
    }
    s14_right = {
        "title": "Spleen CT 3D Volumetric Segmentation",
        "bullets": [
            "Model Architecture: Native PyTorch 3D U-Net.",
            "Components: nn.Conv3d, ResidualUnit, nn.PReLU, nn.ConvTranspose3d upsampling skip connections.",
            "Input Tensor: [1, 1, 96, 96, 96] 3D voxel volume.",
            "Clinical Calculation & Diagnosis:",
            "  • Computes physical Spleen Volume (cm³).",
            "  • Volume Ratio = (Spleen Voxels / Total Grid).",
            "  • Ratio > 0.08 => Splenomegaly (Organ Enlargement).",
            "  • Ratio <= 0.08 => Normal Spleen Volume.",
            "Endpoint: POST /predict/spleen."
        ]
    }
    add_two_cards(s14, 1.6, s14_left, s14_right, 5.5)

    # =========================================================================
    # SLIDE 15: Project Planning & Timeline (Gantt Chart)
    # =========================================================================
    s15 = create_content_slide("Project Planning & Timeline (9-Week Roadmap)")
    if os.path.exists("extracted_gantt.png"):
        s15.shapes.add_picture("extracted_gantt.png", Inches(0.7), Inches(1.5), width=Inches(10.29), height=Inches(5.0))
        # Small footnote
        box = s15.shapes.add_textbox(Inches(0.7), Inches(6.7), Inches(10.29), Inches(0.5))
        p = box.text_frame.paragraphs[0]
        p.text = "• All Phase 1 through Phase 5 milestones (Architecture, Frontend, Backend, ML Models, Chat) are 100% operational."
        p.font.name = FONT_NAME
        p.font.size = Pt(14)
        p.font.color.rgb = COLOR_HEADING
    else:
        add_section(s15, 1.6, "9-Week Implementation Phases", [
            "Phase 1 (Week 1): Requirement Analysis, Architecture & Environment Setup [Completed]",
            "Phase 2 (Weeks 2-3): React Frontend, Multi-Role Dashboards & UI System [Completed]",
            "Phase 3 (Weeks 4-5): Express Backend, JWT Authentication, MongoDB Schemas [Completed]",
            "Phase 4 (Weeks 6-7): Machine Learning Diagnostics & Microservice Integration [Completed]",
            "Phase 5 (Week 8): Appointments, Doctor Queue, Socket.io Real-time Chat [Completed]",
            "Phase 6 (Week 9): System Integration, Security Hardening & Documentation [Completed]"
        ], height_in=5.0)

    # =========================================================================
    # SLIDE 16: Implementation Details — Backend & Gateways
    # =========================================================================
    s16 = create_content_slide("Implementation Details — Backend & Database")
    s16_left = {
        "title": "Node.js & Express API Gateway",
        "bullets": [
            "REST Controllers: Modular controllers for auth, doctors, appointments, chat, mri, health records.",
            "File Streaming: Multer middleware for memory/disk multipart scan ingestion.",
            "JWT RBAC Guards: Custom middleware verifying token validity and enforcing user role access.",
            "Security Hardening: Helmet.js HTTP headers, Bcryptjs 12 salt rounds, Express-rate-limiting.",
            "Resilient Failover: 60s Axios timeout detection with automated mock report generation."
        ]
    }
    s16_right = {
        "title": "MongoDB Enterprise Database Schemas",
        "bullets": [
            "Users: Authentication credentials, roles, phone, avatars.",
            "Doctors: License numbers, specialty, clinic fees, live availability.",
            "Appointments: Patient/doctor bookings, time slots, statuses.",
            "Conversations & Messages: Chat history, room IDs, read flags.",
            "MriAnalysis: Scan records, model predictions, severity (1-10), vital indicators, doctor review states.",
            "Prescriptions & LabReports: Digital clinical medication ledgers."
        ]
    }
    add_two_cards(s16, 1.6, s16_left, s16_right, 5.5)

    # =========================================================================
    # SLIDE 17: Implementation Details — Multi-Role Portals
    # =========================================================================
    s17 = create_content_slide("Implementation Details — Multi-Role Portals")
    headers17 = ["Portal Role", "Page Count & Shell", "Core Implemented Capabilities", "Security & Access Guard"]
    rows17 = [
        ["Patient Portal", "18 Pages\n(AppShell.jsx)", "AI Diagnostics Lab, Doctor Discovery, Slot Booking, Teleconsultation Room, Health Vault, Chat, Family Accounts", "Protected by JWT user role verification; restricts access to personal records."],
        ["Doctor Portal", "6 Pages\n(DoctorShell.jsx)", "Today's Patient Queue, AI Scan Verification & Review, Real-time Chat, Availability Toggle, Revenue Analytics", "Restricted to verified doctor accounts; allows modifying scan reviews & statuses."],
        ["Admin Portal", "4 Pages\n(AdminShell.jsx)", "Platform Analytics, Doctor License Verification, Dispute Moderation, Role-Based Access Audit", "Restricted to administrative superusers; governs platform compliance."]
    ]
    add_table_slide(s17, 1.6, headers17, rows17, [1.8, 2.0, 3.8, 2.69])

    # =========================================================================
    # SLIDE 18: Experimental Results & Model Performance
    # =========================================================================
    s18 = create_content_slide("Experimental Results & Diagnostic Performance")
    headers18 = ["Diagnostic Module", "Validation Accuracy", "Sensitivity / Recall", "F1-Score / Metric", "Inference Speed (CPU)"]
    rows18 = [
        ["Brain MRI (ResNet-18)", "96.4%", "95.8%", "0.961", "180 ms (ONNX Runtime)"],
        ["Breast Cancer (MedMNIST)", "89.2%", "88.7%", "0.890 (AUC: 0.92)", "130 ms (ONNX Runtime)"],
        ["Blood CBC (XGBoost)", "98.1%", "97.5%", "0.978", "25 ms (Scikit-Learn)"],
        ["Spleen CT (3D U-Net)", "Dice: 0.884", "89.1%", "0.887 (Volume Match)", "420 ms (PyTorch CPU)"]
    ]
    add_table_slide(s18, 1.6, headers18, rows18, [2.4, 1.9, 1.9, 2.1, 1.99])

    # =========================================================================
    # SLIDE 19: System Evaluation & Performance Benchmarks
    # =========================================================================
    s19 = create_content_slide("System Evaluation & Latency Benchmarks")
    s19_left = {
        "title": "System Latency & Throughput",
        "bullets": [
            "Sub-Second End-to-End Triage: Complete scan upload, inference, and report synthesis takes under 800ms.",
            "Real-Time Chat Latency: Socket.io WebSocket message transit takes less than 45ms over local network.",
            "Concurrent Load Capacity: Node.js non-blocking event loop handles 200+ concurrent requests without degradation.",
            "CPU Quantization Efficiency: ONNX Runtime reduces model memory footprint by over 60% compared to raw PyTorch."
        ]
    }
    s19_right = {
        "title": "Clinical Usability & Verification",
        "bullets": [
            "Structured Report Clarity: Evaluated by clinicians for report readability, clear severity markers, and vital checks.",
            "Double-Booking Prevention: Automated database conflict detection completely prevents doctor scheduling overlaps.",
            "Zero Data Loss: MriAnalysis schema maintains full historical versioning of original predictions and doctor revisions."
        ]
    }
    add_two_cards(s19, 1.6, s19_left, s19_right, 5.5)

    # =========================================================================
    # SLIDE 20: Conclusion & Project Summary
    # =========================================================================
    s20 = create_content_slide("Conclusion & Summary")
    add_section(s20, 1.5, "Summary of Achievements in Sushruth", [
        "• Successfully engineered a comprehensive, production-grade healthcare ecosystem uniting CAD AI with real-time telemedicine.",
        "• Operationalized 4 specialized machine learning models (Brain, Breast, Blood, Spleen) running with sub-second CPU inference.",
        "• Developed 31 full-stack frontend pages across 3 distinct role-based portals (Patient, Doctor, Admin).",
        "• Solved the diagnostic delay bottleneck by enabling instant triage with a seamless handoff to verified medical specialists."
    ], height_in=2.6)
    add_section(s20, 4.4, "Clinical Impact & Significance", [
        "• Converts Waiting Time into Treatment Time: Eliminates the 24-72 hour latency between scan acquisition and doctor consult.",
        "• Closes the Rural Healthcare Gap: Equips primary health clinics with remote specialist triage and live teleconsultation.",
        "• Demonstrates Software-as-a-Medical-Device (SaMD) architectural principles with strict doctor-in-the-loop safety."
    ], height_in=2.4)

    # =========================================================================
    # SLIDE 21: Future Scope & Roadmap
    # =========================================================================
    s21 = create_content_slide("Future Scope & Clinical Roadmap")
    s21_left = {
        "title": "Advanced Clinical Features",
        "bullets": [
            "Peer-to-Peer Live WebRTC Video: Upgrade consultation rooms to native encrypted WebRTC audio/video calling.",
            "Generative AI Assistant: Integrate Google Gemini API with medical guardrails for conversational patient guidance.",
            "Payment Gateway Integration: Connect Razorpay / Stripe webhooks for automated doctor consultation payouts.",
            "Expanded Modalities: Train deep learning models for Cardiac MRI, Spine MRI, and Chest X-Ray pneumonia detection."
        ]
    }
    s21_right = {
        "title": "Regulatory & Production Pathways",
        "bullets": [
            "DICOM PACS Integration: Direct integration with hospital Orthanc / dcm4chee PACS servers via DICOMweb.",
            "Multi-Center Clinical Validation: Partner with teaching hospitals to evaluate clinical sensitivity across diverse patient cohorts.",
            "Regulatory Compliance: Implement HIPAA and Ayushman Bharat Digital Mission (ABDM) data protection compliance."
        ]
    }
    add_two_cards(s21, 1.6, s21_left, s21_right, 5.5)

    # =========================================================================
    # SLIDE 22: References (Strict IEEE Standard)
    # =========================================================================
    s22 = create_content_slide("References (IEEE Standard)")
    refs_box = s22.shapes.add_textbox(Inches(0.7), Inches(1.5), Inches(10.29), Inches(5.6))
    tf_ref = refs_box.text_frame
    tf_ref.word_wrap = True
    tf_ref.margin_left = tf_ref.margin_top = tf_ref.margin_right = tf_ref.margin_bottom = 0
    
    references = [
        "[1] S. Deepak and P. M. Ameer, \"Brain tumor classification using deep CNN features via transfer learning,\" Comput. Biol. Med., vol. 111, Art. no. 103345, Aug. 2019.",
        "[2] L. Shen, L. R. Margolies, J. H. Rothstein, E. Fluder, R. McBride, and W. Sieh, \"Deep learning to improve breast cancer detection on screening mammography,\" Sci. Rep., vol. 9, Art. no. 12495, Aug. 2019.",
        "[3] T. Chen and C. Guestrin, \"XGBoost: A scalable tree boosting system,\" in Proc. 22nd ACM SIGKDD Int. Conf. Knowl. Discovery Data Mining, San Francisco, CA, USA, 2016, pp. 785–794.",
        "[4] J. Yang et al., \"MedMNIST v2—A large-scale lightweight benchmark for 2D and 3D biomedical image classification,\" Sci. Data, vol. 10, Art. no. 41, 2023.",
        "[5] O. Ronneberger, P. Fischer, and T. Brox, \"U-Net: Convolutional networks for biomedical image segmentation,\" in Proc. Med. Image Comput. Comput.-Assist. Intervent. (MICCAI), 2015, pp. 234–241.",
        "[6] Ö. Çiçek, A. Abdulkadir, S. S. Lienkamp, T. Brox, and O. Ronneberger, \"3D U-Net: Learning dense volumetric segmentation from sparse annotation,\" in Proc. Med. Image Comput. Comput.-Assist. Intervent. (MICCAI), 2016, pp. 424–432.",
        "[7] A. Esteva et al., \"Dermatologist-level classification of skin cancer with deep neural networks,\" Nature, vol. 542, no. 7639, pp. 115–118, 2017.",
        "[8] World Health Organization, \"Global strategy on digital health 2020–2025,\" Geneva: World Health Organization, 2020."
    ]
    
    for idx, ref in enumerate(references):
        p = tf_ref.paragraphs[0] if idx == 0 else tf_ref.add_paragraph()
        p.text = ref
        p.font.name = FONT_NAME
        p.font.size = Pt(14)
        p.font.color.rgb = COLOR_BODY
        p.space_before = Pt(6)

    # Save final presentation
    prs.save(output_path)
    print(f"Final presentation created successfully at: {output_path}")
    print(f"Total slides in final presentation: {len(prs.slides)}")

if __name__ == "__main__":
    build_sushruth_final_22_slides()
