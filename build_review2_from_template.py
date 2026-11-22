import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def build_review2_from_template():
    template_path = "Sushuruth_Review1_PPT.pptx"
    primary_output = "Sushuruth_Review2_Template_PPT.pptx"
    alt_output = "Sushuruth_Review2_PPT.pptx"

    prs = Presentation(template_path)
    
    # Colors matching Review 1 template
    COLOR_PRIMARY_BLUE = RGBColor(0, 102, 204)  # #0066CC - Header highlight color in Review 1
    COLOR_DARK_TEXT = RGBColor(30, 41, 59)      # #1E293B - Crisp readable text
    
    # Slide 1: Update Title & Review Details
    s1 = prs.slides[0]
    
    # Update main title in shape 0
    if len(s1.shapes) > 0 and s1.shapes[0].has_text_frame:
        tf0 = s1.shapes[0].text_frame
        tf0.paragraphs[0].text = "Sushruth \u2014 AI-Powered Healthcare Platform"
        tf0.paragraphs[0].font.size = Pt(36)
        tf0.paragraphs[0].font.bold = True
        tf0.paragraphs[0].font.color.rgb = COLOR_PRIMARY_BLUE

    # Update Department in shape 4
    if len(s1.shapes) > 4 and s1.shapes[4].has_text_frame:
        tf4 = s1.shapes[4].text_frame
        tf4.paragraphs[0].text = "Department of Computer Science & Engineering"
        tf4.paragraphs[0].font.size = Pt(20)
        tf4.paragraphs[0].font.bold = True

    # Update Academic Year in shape 5
    if len(s1.shapes) > 5 and s1.shapes[5].has_text_frame:
        tf5 = s1.shapes[5].text_frame
        tf5.paragraphs[0].text = "Minor Project: Review \u2013 II (Academic Year 2026-27)"
        tf5.paragraphs[0].font.size = Pt(18)
        tf5.paragraphs[0].font.bold = True

    # Helper function to populate Title & Content slides cleanly
    def populate_slide(slide, title_text, sections):
        # Set Title
        if slide.shapes.title:
            slide.shapes.title.text = title_text
            p_t = slide.shapes.title.text_frame.paragraphs[0]
            p_t.font.size = Pt(28)
            p_t.font.bold = True
            p_t.font.color.rgb = RGBColor(15, 23, 42)

        # Find Content Placeholder (shape 1)
        content_shape = None
        for sh in slide.shapes:
            if sh != slide.shapes.title and sh.has_text_frame:
                content_shape = sh
                break

        if not content_shape:
            return

        tf = content_shape.text_frame
        tf.clear() # Clear existing paragraphs

        is_first = True
        for header, bullets in sections:
            # Section Header Paragraph
            if is_first:
                p_head = tf.paragraphs[0]
                is_first = False
            else:
                p_head = tf.add_paragraph()
                p_head.space_before = Pt(12)

            p_head.level = 0
            r_h = p_head.add_run()
            r_h.text = header
            r_h.font.size = Pt(20)
            r_h.font.bold = True
            r_h.font.color.rgb = COLOR_PRIMARY_BLUE

            # Bullets under this section
            for bullet in bullets:
                p_b = tf.add_paragraph()
                p_b.level = 0
                p_b.space_before = Pt(3)
                r_b = p_b.add_run()
                r_b.text = bullet
                r_b.font.size = Pt(17)
                r_b.font.color.rgb = COLOR_DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 2: Background and Domain
    # -------------------------------------------------------------
    s2_sections = [
        ("Healthcare Domain \u2014 Digital Health & Medical AI", [
            "\u2022 India faces an acute doctor-to-patient ratio of 1:1,456 (WHO recommends 1:1,000)",
            "\u2022 Over 70% of specialist diagnostic facilities are concentrated in tier-1 metro cities",
            "\u2022 Diagnostic delays in rural and semi-urban regions significantly elevate mortality rates"
        ]),
        ("The Role of AI in Computer-Aided Diagnosis (CAD)", [
            "\u2022 Deep learning delivers sub-second automated pre-screening with high sensitivity",
            "\u2022 Early triage for critical conditions: Brain Tumors, Breast Cancer, and Blood Disorders",
            "\u2022 Volumetric 3D analysis enables organ quantification (Spleen) beyond manual 2D inspection"
        ]),
        ("Domain Scope of Sushruth", [
            "\u2022 Multi-Organ Imaging: Brain MRI, Breast Mammography, and Abdominal Spleen CT",
            "\u2022 Clinical Data Analytics: Automated Complete Blood Count (CBC) report interpretation",
            "\u2022 Doctor-in-the-Loop Telemedicine: Direct handoff to real-time doctor teleconsultation"
        ])
    ]
    populate_slide(prs.slides[1], "Background and Domain", s2_sections)

    # -------------------------------------------------------------
    # SLIDE 3: Literature Review
    # -------------------------------------------------------------
    s3_sections = [
        ("Survey of Foundational Research Papers", [
            "\u2022 Deepak & Ameer (2019): Brain Tumor Classification using Transfer Learning on MRI (97.2% accuracy)",
            "\u2022 Shen et al. (2019): Deep Learning to Improve Breast Cancer Detection on Mammography (AUC 0.91)",
            "\u2022 Ronneberger et al. (2015) & \u00c7i\u00e7ek et al. (2016): 2D & 3D U-Net for dense volumetric segmentation",
            "\u2022 Yang et al. (2023): MedMNIST v2 lightweight benchmark for clinical image classification",
            "\u2022 Chen & Guestrin (2016): XGBoost scalable gradient tree boosting for clinical tabular records"
        ]),
        ("Critical Literature Insights & Synthesis", [
            "\u2022 Existing research heavily focuses on isolated single-organ models in academic isolation",
            "\u2022 Prior models lack multi-organ consolidation and direct integration into patient teleconsultation platforms",
            "\u2022 3D volumetric segmentation is rarely deployed in consumer-accessible web healthcare systems"
        ])
    ]
    populate_slide(prs.slides[2], "Literature Review", s3_sections)

    # -------------------------------------------------------------
    # SLIDE 4: Existing Systems & Comparative Analysis
    # -------------------------------------------------------------
    s4_sections = [
        ("Analysis of Current Healthcare Platforms", [
            "\u2022 Practo / Apollo 24|7: Online doctor booking & consultations, but zero AI-based diagnostic scan analysis",
            "\u2022 Aidoc / Zebra Medical: High-performance AI radiology tools, but closed-source, expensive & hospital-only",
            "\u2022 Academic CAD Research: High accuracy benchmarks, but lack deployable patient/doctor web interfaces"
        ]),
        ("Common Limitations of Existing Systems", [
            "\u2022 Siloed Ecosystems: Single-purpose platforms offer either booking OR diagnostics, never both in one app",
            "\u2022 Lack of Multi-Modal AI: No platform unifies Brain + Breast + Blood + Spleen 3D CT under one roof",
            "\u2022 High Commercial Barriers: Advanced CAD tools are inaccessible to common patients in tier-2/rural areas",
            "\u2022 Absence of Real-Time Doctor Verification: AI outputs are detached from live physician consultation"
        ])
    ]
    populate_slide(prs.slides[3], "Existing Systems & Comparative Analysis", s4_sections)

    # -------------------------------------------------------------
    # SLIDE 5: Problem Identification & Limitations of Existing Systems
    # -------------------------------------------------------------
    s5_sections = [
        ("Key Problems Identified in Current Healthcare Systems", [
            "\u2022 Fragmented Healthcare: Patients receive raw radiology scans without explanation, creating anxiety and delay",
            "\u2022 Multi-Specialist Burden: Patients must visit separate clinics for brain, breast, abdominal, and blood analyses",
            "\u2022 Manual Blood Interpretation: Routine CBC analysis still relies on manual lab technician review without triage flags",
            "\u2022 Omission of 3D Volumetrics: Standard consumer apps ignore 3D voxel depth essential for Splenomegaly"
        ]),
        ("Research & Engineering Gaps Addressed by Sushruth", [
            "\u2022 No unified platform combines multi-organ AI diagnostics, structured clinical reports, and live doctor chat",
            "\u2022 Most systems lack comprehensive tripartite role-based access (Patient, Doctor, Admin) in a single application",
            "\u2022 Sushruth translates opaque neural logits into structured clinical findings with 1\u201310 severity ratings"
        ])
    ]
    populate_slide(prs.slides[4], "Problem Identification & Limitations of Existing Systems", s5_sections)

    # -------------------------------------------------------------
    # SLIDE 6: Project Planning & Proposal (Review – II Milestone)
    # -------------------------------------------------------------
    s6_sections = [
        ("Project Proposal & Core Objectives", [
            "\u2022 Build Sushruth: A unified healthcare platform integrating multi-organ AI screening with telemedicine",
            "\u2022 Deploy 4 operational ML models under 500ms latency with automated clinical report synthesis",
            "\u2022 Implement Tripartite Role-Based Portals: Patient (18 pages), Doctor (6 pages), Admin (4 pages)"
        ]),
        ("Review \u2013 II Implementation Progress Status", [
            "\u2022 [Completed] Core 3-Tier Distributed Architecture: React 19 + Node.js API Gateway + Python Flask ML",
            "\u2022 [Completed] 4 Operational ML Pipelines: Brain ResNet-18, Breast MedMNIST, Blood XGBoost, Spleen 3D U-Net",
            "\u2022 [Completed] Real-Time Socket.io Chat: Bidirectional messaging with live doctor availability synchronization",
            "\u2022 [Completed] MongoDB Schemas & Seeder: Users, Doctors, Appointments, Conversations, and Scan History active",
            "\u2022 [In Progress for Final Review]: WebRTC live video consultation room & Gemini conversational assistant"
        ])
    ]
    populate_slide(prs.slides[5], "Project Planning & Proposal (Review \u2013 II)", s6_sections)

    # -------------------------------------------------------------
    # SLIDE 7: Methodology — Multi-Organ AI Engine
    # -------------------------------------------------------------
    s7_sections = [
        ("Multi-Model Diagnostic Pipelines & Architectures", [
            "\u2022 Brain MRI Classifier (ResNet-18 ONNX): 224x224x3 slice \u2192 4 classes (Glioma, Meningioma, Pituitary, Normal)",
            "\u2022 Breast Mammography (MedMNIST CNN ONNX): 224x224x3 slice \u2192 Binary BI-RADS risk (Benign vs Malignant)",
            "\u2022 Blood Report Analyzer (XGBoost): 6 CBC parameters (WBC, RBC, Hb, Platelets, etc.) \u2192 4 diagnostic states",
            "\u2022 Spleen CT 3D Segmentation (PyTorch 3D U-Net): [1,1,96,96,96] voxel volume \u2192 Voxel mask, volume (cm\u00b3), Splenomegaly flag (>0.08 ratio)"
        ]),
        ("Automated Medical Report Generation Pipeline", [
            "\u2022 Raw Scan Upload \u2192 Tensor Normalization \u2192 Model Logits / Softmax \u2192 Clinical Severity Index (1\u201310)",
            "\u2022 Generates structured clinical findings, organ health status, vital checks, and recommended follow-up care",
            "\u2022 Resilient Architecture: Built-in failover in Express gateway ensures zero downtime during ML inference"
        ])
    ]
    populate_slide(prs.slides[6], "Methodology \u2014 AI Diagnostics Engine", s7_sections)

    # -------------------------------------------------------------
    # SLIDE 8: System Architecture & Tech Stack
    # -------------------------------------------------------------
    s8_sections = [
        ("3-Tier Distributed Microservices Blueprint", [
            "\u2022 Frontend Client: React 19, Vite 8, Material UI v9, Zustand 5, Recharts, Socket.io-client (Port 5175)",
            "\u2022 API Gateway: Node.js & Express 4.21, JWT Auth, Bcrypt 12 rounds, Multer file upload, Socket.io (Port 5000)",
            "\u2022 ML Microservice: Python Flask, ONNX Runtime 1.22, PyTorch, Scikit-learn, XGBoost, NumPy (Port 5001)",
            "\u2022 Database: MongoDB 8 on Port 27017 (Users, Doctors, Appointments, Conversations, MriAnalysis collections)"
        ]),
        ("End-to-End Dataflow & Integration", [
            "\u2022 Patient uploads scan via React UI \u2192 Express authenticates JWT & streams file via Axios to Python Flask",
            "\u2022 Flask executes ONNX/PyTorch inference & generates structured diagnostic report with severity rating",
            "\u2022 Express stores report in MongoDB MriAnalysis & triggers real-time Socket.io alert to assigned doctor's queue"
        ])
    ]
    populate_slide(prs.slides[7], "System Architecture & Integration", s8_sections)

    # -------------------------------------------------------------
    # SLIDE 9: References (Strict IEEE Standard)
    # -------------------------------------------------------------
    # For Slide 9, populate references in IEEE standard with very visible 16pt font
    s9 = prs.slides[8]
    if s9.shapes.title:
        s9.shapes.title.text = "References"
        s9.shapes.title.text_frame.paragraphs[0].font.size = Pt(28)
        s9.shapes.title.text_frame.paragraphs[0].font.bold = True
        s9.shapes.title.text_frame.paragraphs[0].font.color.rgb = RGBColor(15, 23, 42)

    content_shape9 = None
    for sh in s9.shapes:
        if sh != s9.shapes.title and sh.has_text_frame:
            content_shape9 = sh
            break

    if content_shape9:
        tf9 = content_shape9.text_frame
        tf9.clear()

        p_rh = tf9.paragraphs[0]
        r_rh = p_rh.add_run()
        r_rh.text = "IEEE Standard Citations:"
        r_rh.font.size = Pt(20)
        r_rh.font.bold = True
        r_rh.font.color.rgb = COLOR_PRIMARY_BLUE

        ieee_refs = [
            "[1] S. Deepak and P. M. Ameer, \"Brain tumor classification using deep CNN features via transfer learning,\" Comput. Biol. Med., vol. 111, p. 103345, Aug. 2019.",
            "[2] L. Shen et al., \"Deep learning to improve breast cancer detection on screening mammography,\" Sci. Rep., vol. 9, no. 1, p. 12495, Aug. 2019.",
            "[3] O. Ronneberger, P. Fischer, and T. Brox, \"U-Net: Convolutional networks for biomedical image segmentation,\" in Proc. MICCAI, Cham: Springer, 2015, pp. 234\u2013241.",
            "[4] \u00d6. \u00c7i\u00e7ek et al., \"3D U-Net: Learning dense volumetric segmentation from sparse annotation,\" in Proc. MICCAI, Cham: Springer, 2016, pp. 424\u2013432.",
            "[5] J. Yang et al., \"MedMNIST v2: A large-scale lightweight benchmark for 2D and 3D biomedical image classification,\" Sci. Data, vol. 10, no. 1, p. 41, 2023.",
            "[6] T. Chen and C. Guestrin, \"XGBoost: A scalable tree boosting system,\" in Proc. 22nd ACM SIGKDD Int. Conf. Knowl. Discovery Data Mining, 2016, pp. 785\u2013794.",
            "[7] World Health Organization, \"Global strategy on digital health 2020\u20132025,\" Geneva: World Health Organization, 2020.",
            "[8] A. Esteva et al., \"Dermatologist-level classification of skin cancer with deep neural networks,\" Nature, vol. 542, no. 7639, pp. 115\u2013118, 2017."
        ]

        for ref in ieee_refs:
            p_ref = tf9.add_paragraph()
            p_ref.space_before = Pt(3)
            r_ref = p_ref.add_run()
            r_ref.text = ref
            r_ref.font.size = Pt(15)
            r_ref.font.color.rgb = COLOR_DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 10: Thank You! & Demonstration Readiness
    # -------------------------------------------------------------
    s10 = prs.slides[9]
    if s10.shapes.title:
        s10.shapes.title.text = "Thank You!"
        s10.shapes.title.text_frame.paragraphs[0].font.size = Pt(32)
        s10.shapes.title.text_frame.paragraphs[0].font.bold = True
        s10.shapes.title.text_frame.paragraphs[0].font.color.rgb = RGBColor(15, 23, 42)

    content_shape10 = None
    for sh in s10.shapes:
        if sh != s10.shapes.title and sh.has_text_frame:
            content_shape10 = sh
            break

    if content_shape10:
        tf10 = content_shape10.text_frame
        tf10.clear()

        p1 = tf10.paragraphs[0]
        r1 = p1.add_run()
        r1.text = "Sushruth \u2014 AI-Powered Healthcare Platform"
        r1.font.size = Pt(22)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY_BLUE

        bullets10 = [
            "\u2022 Minor Project Review \u2013 II Milestone Accomplished & Fully Operational",
            "\u2022 4 Real Multi-Organ ML Pipelines (Brain ResNet-18, Breast MedMNIST, Blood XGBoost, Spleen 3D U-Net)",
            "\u2022 31 Full-Stack Frontend Portals for Patients, Doctors, and Administrators with MongoDB Persistence",
            "\u2022 Real-time Doctor-Patient Teleconsultation via Socket.io WebSocket Rooms",
            "\u2022 System Seeded & Prepared for Live Evaluation Demonstration"
        ]
        for b in bullets10:
            p = tf10.add_paragraph()
            p.space_before = Pt(6)
            r = p.add_run()
            r.text = b
            r.font.size = Pt(18)
            r.font.color.rgb = COLOR_DARK_TEXT

        p_q = tf10.add_paragraph()
        p_q.space_before = Pt(18)
        r_q = p_q.add_run()
        r_q.text = "Questions & Feedback Welcome from the Review Panel"
        r_q.font.size = Pt(20)
        r_q.font.bold = True
        r_q.font.color.rgb = COLOR_PRIMARY_BLUE

        p_quote = tf10.add_paragraph()
        p_quote.space_before = Pt(6)
        r_quote = p_quote.add_run()
        r_quote.text = "\"Technology is best when it brings people closer to better health.\""
        r_quote.font.size = Pt(16)
        r_quote.font.italic = True
        r_quote.font.color.rgb = RGBColor(100, 116, 139)

    prs.save(primary_output)
    print(f"Successfully generated Review 2 presentation using Review 1 template at: {primary_output}")
    try:
        prs.save(alt_output)
        print(f"Also updated: {alt_output}")
    except Exception as e:
        print(f"Note: {alt_output} is currently open in PowerPoint ({e}). {primary_output} is available.")

if __name__ == "__main__":
    build_review2_from_template()
