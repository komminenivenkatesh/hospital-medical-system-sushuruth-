import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation(output_path="Sushuruth_Review2_PPT.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Color Palette Definitions
    COLOR_NAVY_DARK = RGBColor(15, 23, 42)      # #0F172A - Dominant dark
    COLOR_NAVY_LIGHT = RGBColor(30, 41, 59)     # #1E293B
    COLOR_CYAN_ACCENT = RGBColor(2, 132, 199)   # #0284C7 - Primary accent
    COLOR_CYAN_LIGHT = RGBColor(224, 242, 254)  # #E0F2FE - Light cyan card
    COLOR_TEAL_ACCENT = RGBColor(13, 148, 136)  # #0D9488 - Secondary accent
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)    # #F8FAFC - Main content slide BG
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)      # Deep slate for main text
    COLOR_TEXT_MUTED = RGBColor(71, 85, 105)    # Slate 600 for subtext
    COLOR_CARD_BORDER = RGBColor(226, 232, 240) # Border for cards
    COLOR_CARD_BG = RGBColor(255, 255, 255)     # Card fill
    COLOR_BADGE_BG = RGBColor(238, 242, 255)    # Badge background
    COLOR_GREEN = RGBColor(16, 185, 129)        # Emerald green
    COLOR_RED = RGBColor(239, 68, 68)           # Coral red

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text, dark_mode=False):
        # Category / Super-header
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_right = tf_cat.margin_top = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(13)
        p_cat.font.bold = True
        p_cat.font.name = "Calibri"
        p_cat.font.color.rgb = COLOR_CYAN_ACCENT if not dark_mode else RGBColor(56, 189, 248)

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.name = "Calibri"
        p_title.font.color.rgb = COLOR_NAVY_DARK if not dark_mode else COLOR_WHITE

        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(11.733), Inches(0.03))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_CYAN_ACCENT
        line.line.fill.background()

    def add_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: Title of the Project
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_NAVY_DARK)

    # Accent top border
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = COLOR_CYAN_ACCENT
    top_bar.line.fill.background()

    # Subtitle Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.1), Inches(4.5), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = COLOR_NAVY_LIGHT
    badge.line.color.rgb = COLOR_CYAN_ACCENT
    badge.line.width = Pt(1.5)
    tb_badge = badge.text_frame
    p_b = tb_badge.paragraphs[0]
    p_b.text = "MINOR PROJECT — REVIEW II PRESENTATION"
    p_b.font.size = Pt(13)
    p_b.font.bold = True
    p_b.font.color.rgb = RGBColor(56, 189, 248)
    p_b.alignment = PP_ALIGN.CENTER

    # Project Title
    t_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(1.8))
    tf = t_box.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "SUSHRUTH"
    p1.font.size = Pt(48)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.font.name = "Calibri"

    p2 = tf.add_paragraph()
    p2.text = "AI-Powered Multi-Organ Diagnostic & Integrated Telemedicine Platform"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(56, 189, 248)
    p2.font.name = "Calibri"
    p2.space_before = Pt(8)

    # Key Tech Highlights Bar
    tech_bar = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(3.8), Inches(11.33), Inches(0.7))
    tech_bar.fill.solid()
    tech_bar.fill.fore_color.rgb = COLOR_NAVY_LIGHT
    tech_bar.line.fill.background()
    tb_tech = tech_bar.text_frame
    p_tech = tb_tech.paragraphs[0]
    p_tech.text = "PyTorch 3D U-Net  |  ResNet-18 ONNX  |  XGBoost CBC Analyzer  |  React 19 & Node.js  |  Socket.io Real-Time"
    p_tech.font.size = Pt(15)
    p_tech.font.bold = True
    p_tech.font.color.rgb = RGBColor(224, 242, 254)
    p_tech.alignment = PP_ALIGN.CENTER

    # Team & Department Info Cards
    card_left = add_card(s1, Inches(1.0), Inches(4.8), Inches(5.4), Inches(2.0), COLOR_NAVY_LIGHT, COLOR_CYAN_ACCENT)
    tf_cl = card_left.text_frame
    tf_cl.margin_left = tf_cl.margin_right = tf_cl.margin_top = Inches(0.2)
    p_cl0 = tf_cl.paragraphs[0]
    p_cl0.text = "PROJECT CANDIDATE(S)"
    p_cl0.font.size = Pt(14)
    p_cl0.font.bold = True
    p_cl0.font.color.rgb = RGBColor(56, 189, 248)
    p_cl1 = tf_cl.add_paragraph()
    p_cl1.text = "• Student Name(s): [Your Name / Team Names]\n• Roll Number(s): [Your Roll No. / Hall Ticket]\n• Degree: Bachelor of Technology (B.Tech)"
    p_cl1.font.size = Pt(15)
    p_cl1.font.color.rgb = COLOR_WHITE
    p_cl1.space_before = Pt(6)

    card_right = add_card(s1, Inches(6.9), Inches(4.8), Inches(5.4), Inches(2.0), COLOR_NAVY_LIGHT, COLOR_CYAN_ACCENT)
    tf_cr = card_right.text_frame
    tf_cr.margin_left = tf_cr.margin_right = tf_cr.margin_top = Inches(0.2)
    p_cr0 = tf_cr.paragraphs[0]
    p_cr0.text = "SUPERVISION & INSTITUTION"
    p_cr0.font.size = Pt(14)
    p_cr0.font.bold = True
    p_cr0.font.color.rgb = RGBColor(56, 189, 248)
    p_cr1 = tf_cr.add_paragraph()
    p_cr1.text = "• Project Supervisor / Guide: [Supervisor Name]\n• Department of Computer Science & Engineering\n• Academic Year: 2026 – 2027"
    p_cr1.font.size = Pt(15)
    p_cr1.font.color.rgb = COLOR_WHITE
    p_cr1.space_before = Pt(6)

    # =========================================================================
    # SLIDE 2: Background and Domain
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, COLOR_BG_LIGHT)
    add_header(s2, "Healthcare Domain & Real-World Clinical Context", "Section 2: Background and Domain")

    # 3 Structured Columns / Cards
    # Card 1: Healthcare Domain & Crisis
    c1 = add_card(s2, Inches(0.8), Inches(1.7), Inches(3.7), Inches(5.3))
    tf1 = c1.text_frame
    tf1.margin_left = tf1.margin_right = tf1.margin_top = Inches(0.25)
    p = tf1.paragraphs[0]
    p.text = "THE HEALTHCARE CHALLENGE"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK
    
    bullets1 = [
        ("Severe Doctor Deficit:", " India's doctor-to-patient ratio stands at 1:1,456, significantly worse than the WHO recommended 1:1,000 threshold."),
        ("Rural Diagnostic Desert:", " Over 70% of specialist radiologists and oncologists are concentrated in top tier-1 metro cities."),
        ("Diagnostic Latency:", " Patients wait days to weeks for specialized scan readings, causing disease progression and elevated mortality rates.")
    ]
    for b_title, b_desc in bullets1:
        p = tf1.add_paragraph()
        p.space_before = Pt(10)
        run_b = p.add_run()
        run_b.text = b_title
        run_b.font.bold = True
        run_b.font.size = Pt(14)
        run_b.font.color.rgb = COLOR_CYAN_ACCENT
        run_d = p.add_run()
        run_d.text = b_desc
        run_d.font.size = Pt(14)
        run_d.font.color.rgb = COLOR_TEXT_MAIN

    # Card 2: Computer-Aided Diagnosis (CAD)
    c2 = add_card(s2, Inches(4.8), Inches(1.7), Inches(3.7), Inches(5.3))
    tf2 = c2.text_frame
    tf2.margin_left = tf2.margin_right = tf2.margin_top = Inches(0.25)
    p = tf2.paragraphs[0]
    p.text = "WHY MEDICAL AI IN CAD?"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK
    
    bullets2 = [
        ("Sub-Second Triage:", " Deep learning architectures can pre-screen complex imaging modalities in fractions of a second."),
        ("Multi-Class Pathology:", " Capable of differentiating subtle tumor margins (Glioma vs. Meningioma vs. Pituitary)."),
        ("Volumetric Precision:", " 3D Convolutional networks capture continuous slice-depth volumetric data impossible via manual 2D inspection."),
        ("Objective Blood Screening:", " Tabular classifiers instantly detect acute hematological abnormalities from routine CBC markers.")
    ]
    for b_title, b_desc in bullets2:
        p = tf2.add_paragraph()
        p.space_before = Pt(10)
        run_b = p.add_run()
        run_b.text = b_title
        run_b.font.bold = True
        run_b.font.size = Pt(14)
        run_b.font.color.rgb = COLOR_CYAN_ACCENT
        run_d = p.add_run()
        run_d.text = b_desc
        run_d.font.size = Pt(14)
        run_d.font.color.rgb = COLOR_TEXT_MAIN

    # Card 3: Domain Focus of Sushruth
    c3 = add_card(s2, Inches(8.8), Inches(1.7), Inches(3.7), Inches(5.3))
    tf3 = c3.text_frame
    tf3.margin_left = tf3.margin_right = tf3.margin_top = Inches(0.25)
    p = tf3.paragraphs[0]
    p.text = "SUSHRUTH DOMAIN FOCUS"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK
    
    bullets3 = [
        ("Multi-Organ Imaging:", " Brain MRI slices, Breast Mammograms, and 3D Abdominal Spleen CT volumes."),
        ("Clinical Blood Analytics:", " Automated CBC analysis for Anemia, systemic Infection, and Leukemia flags."),
        ("Doctor-in-the-Loop:", " Not a replacement for physicians, but an integrated diagnostic copilot with verified reporting."),
        ("Unified Telemedicine:", " Instant handoff from AI diagnostic flags directly to live doctor consultation via Socket.io.")
    ]
    for b_title, b_desc in bullets3:
        p = tf3.add_paragraph()
        p.space_before = Pt(10)
        run_b = p.add_run()
        run_b.text = b_title
        run_b.font.bold = True
        run_b.font.size = Pt(14)
        run_b.font.color.rgb = COLOR_CYAN_ACCENT
        run_d = p.add_run()
        run_d.text = b_desc
        run_d.font.size = Pt(14)
        run_d.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 3: Literature Review
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, COLOR_BG_LIGHT)
    add_header(s3, "Comprehensive Literature Survey of Diagnostic Models", "Section 3: Literature Review")

    # Table of papers
    rows, cols = 6, 5
    left = Inches(0.8)
    top = Inches(1.7)
    width = Inches(11.733)
    height = Inches(4.3)
    table_shape = s3.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    # Column widths
    table.columns[0].width = Inches(1.2) # Ref / Author
    table.columns[1].width = Inches(2.4) # Paper Title
    table.columns[2].width = Inches(2.2) # Methodology & Dataset
    table.columns[3].width = Inches(2.3) # Key Findings / Metrics
    table.columns[4].width = Inches(3.633) # Research Gap / Takeaway

    headers = ["Author & Year", "Research Paper Title", "Methodology & Data", "Reported Metrics", "Research Gap / Sushruth Takeaway"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(14)
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.CENTER

    paper_data = [
        ("[1] Deepak & Ameer (2019)", "Brain Tumor Classification using Deep CNN via Transfer Learning", "ResNet/GoogLeNet on Figshare Brain MRI dataset (3,064 slices)", "97.2% overall accuracy across Glioma, Meningioma, Pituitary", "Standalone classification model; lacked integration into clinical appointment & doctor review systems."),
        ("[2] Shen et al. (2019)", "Deep Learning to Improve Breast Cancer Detection on Screening Mammography", "End-to-end Deep Convolutional Network on CBIS-DDSM & private sets", "AUC 0.91 in distinguishing benign vs malignant lesions", "High computational overhead; not optimized for sub-second web microservice inference."),
        ("[3] Ronneberger / Cicek (2015-16)", "U-Net & 3D U-Net: Biomedical Image Volumetric Segmentation", "Encoder-decoder with residual skip connections on 3D CT/MRI volumes", "High Dice score on sparse annotations for multi-organ boundaries", "Absence of real-time 3D volumetric segmentation in patient-accessible healthcare web applications."),
        ("[4] Yang et al. (2023)", "MedMNIST v2: Lightweight Benchmark for Biomedical Imaging", "Standardized 2D/3D biomedical image classification benchmark", "Proven generalization on BreastMNIST with minimal parameter footprint", "Validated feasibility of deploying ONNX-quantized lightweight models in responsive web apps."),
        ("[5] Chen & Guestrin (2016)", "XGBoost: A Scalable Tree Boosting System", "Sparsity-aware gradient boosted decision tree ensembles", "State-of-the-art tabular inference speed and non-linear risk scoring", "Demonstrates superior efficacy for multi-parameter clinical lab analysis over traditional heuristics.")
    ]

    for row_idx, data in enumerate(paper_data, start=1):
        for col_idx, text in enumerate(data):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_WHITE if row_idx % 2 == 1 else RGBColor(241, 245, 249)
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.size = Pt(12)
            p.font.color.rgb = COLOR_TEXT_MAIN
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_CYAN_ACCENT

    # Literature Synthesis Banner below table
    syn_card = add_card(s3, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.9), COLOR_CYAN_LIGHT, COLOR_CYAN_ACCENT)
    tf_syn = syn_card.text_frame
    tf_syn.margin_left = tf_syn.margin_top = Inches(0.15)
    p_syn = tf_syn.paragraphs[0]
    run_sb = p_syn.add_run()
    run_sb.text = "CRITICAL LITERATURE INSIGHT: "
    run_sb.font.bold = True
    run_sb.font.size = Pt(13)
    run_sb.font.color.rgb = COLOR_NAVY_DARK
    run_st = p_syn.add_run()
    run_st.text = "Existing literature focuses overwhelmingly on isolated single-organ models in academic isolation. No peer platform successfully integrates multi-organ AI (Brain + Breast + Blood + 3D Spleen) with role-based clinical teleconsultation and real-time messaging."
    run_st.font.size = Pt(13)
    run_st.font.color.rgb = COLOR_NAVY_DARK

    # =========================================================================
    # SLIDE 4: Existing Systems & Comparative Analysis
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, COLOR_BG_LIGHT)
    add_header(s4, "Existing Healthcare Systems & Feature Matrix", "Section 3 (Contd.): Existing Systems")

    # Comparative Matrix Table
    rows, cols = 6, 6
    table_shape4 = s4.shapes.add_table(rows, cols, Inches(0.8), Inches(1.7), Inches(11.733), Inches(3.6))
    tab4 = table_shape4.table

    tab4.columns[0].width = Inches(2.733) # Evaluation Parameter
    tab4.columns[1].width = Inches(1.8)   # Practo
    tab4.columns[2].width = Inches(1.8)   # Apollo 24|7
    tab4.columns[3].width = Inches(1.8)   # Aidoc (Radiology AI)
    tab4.columns[4].width = Inches(1.8)   # Standalone CAD
    tab4.columns[5].width = Inches(1.8)   # SUSHRUTH (Ours)

    matrix_headers = ["Key Feature / Capability", "Practo", "Apollo 24|7", "Aidoc AI", "Research CAD", "SUSHRUTH (Ours)"]
    for i, h in enumerate(matrix_headers):
        cell = tab4.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY_DARK if i < 5 else COLOR_CYAN_ACCENT
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.CENTER

    matrix_rows = [
        ("Multi-Organ AI Diagnostic Support", "❌ None", "❌ None", "⚠️ Single/Select", "⚠️ Uni-modal", "✅ 4 Clinical Models"),
        ("3D Volumetric CT Segmentation", "❌ None", "❌ None", "✅ Proprietary", "⚠️ Offline code", "✅ 3D U-Net PyTorch"),
        ("Integrated Telemedicine & Chat", "✅ Booking/Chat", "✅ Booking Only", "❌ No Patient Chat", "❌ None", "✅ Live Socket.io"),
        ("Automated Structured Clinical Report", "❌ None", "❌ Basic Lab PDF", "⚠️ Doctor Only", "❌ Raw Numbers", "✅ Severity + Findings"),
        ("Patient, Doctor, Admin Tri-Role RBAC", "⚠️ Limited", "⚠️ Limited", "❌ Radiology Only", "❌ None", "✅ 31 Full Portals")
    ]

    for row_idx, rdata in enumerate(matrix_rows, start=1):
        for col_idx, val in enumerate(rdata):
            cell = tab4.cell(row_idx, col_idx)
            cell.fill.solid()
            if col_idx == 5:
                cell.fill.fore_color.rgb = RGBColor(240, 253, 250) # Light emerald / cyan for Sushruth
            else:
                cell.fill.fore_color.rgb = COLOR_WHITE if row_idx % 2 == 1 else RGBColor(248, 250, 252)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(13)
            p.alignment = PP_ALIGN.CENTER if col_idx > 0 else PP_ALIGN.LEFT
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_NAVY_DARK
            elif col_idx == 5:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEAL_ACCENT

    # Summary of Existing Systems Failures
    bot_card = add_card(s4, Inches(0.8), Inches(5.5), Inches(11.733), Inches(1.6), COLOR_WHITE, COLOR_CARD_BORDER)
    tf_b = bot_card.text_frame
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = Inches(0.2)
    p_b0 = tf_b.paragraphs[0]
    p_b0.text = "CRITICAL LIMITATION OF EXISTING COMMERCIAL PARADIGMS:"
    p_b0.font.size = Pt(14)
    p_b0.font.bold = True
    p_b0.font.color.rgb = COLOR_NAVY_DARK

    p_b1 = tf_b.add_paragraph()
    p_b1.text = "• Telehealth portals (Practo, Apollo) function purely as clerical directory aggregators without diagnostic intelligence."
    p_b1.font.size = Pt(13)
    p_b1.font.color.rgb = COLOR_TEXT_MUTED
    p_b1.space_before = Pt(4)

    p_b2 = tf_b.add_paragraph()
    p_b2.text = "• Enterprise Radiology CAD systems (Aidoc, Zebra Med) are prohibitively expensive, closed-source, and isolated from patient communication channels."
    p_b2.font.size = Pt(13)
    p_b2.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 5: Problem Identification & Limitations of Existing Systems
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, COLOR_BG_LIGHT)
    add_header(s5, "Identified Gaps & Clinical Limitations in Current Solutions", "Section 4: Problem Identification")

    # 4 Quadrants / Cards
    cards_info = [
        (Inches(0.8), Inches(1.7), "1. Siloed Healthcare Architecture", 
         [("Diagnostic Fragmentation:", " Patients receive scan files from diagnostic centers with zero contextual explanation, creating anxiety and panic."),
          ("Disconnected Workflow:", " Consultations require booking separate appointments on external portals without seamless scan record transfer.")]),
        
        (Inches(6.8), Inches(1.7), "2. Single-Organ / Uni-modal Narrow AI", 
         [("Lack of Consolidation:", " Existing academic models tackle either only brain tumors or only mammography; patients must use multiple disjointed tools."),
          ("Absence of Blood Triaging:", " Routine lab test parameters (CBC) still rely solely on manual lab technician review without instant triage flags.")]),
        
        (Inches(0.8), Inches(4.5), "3. Omission of 3D Volumetric Processing", 
         [("2D Slice Limitation:", " Most consumer AI tools only inspect 2D PNG/JPEG slices, losing vital depth context in volumetric organs like the Spleen and Liver."),
          ("No Splenomegaly Volumetrics:", " Calculating organ-to-cavity volume ratio requires computationally heavy 3D convolution, absent in web apps.")]),
        
        (Inches(6.8), Inches(4.5), "4. Opaque Predictions & No Doctor Handoff", 
         [("Raw Probabilities vs. Reports:", " Existing tools return raw numbers without structured medical findings, severity levels (1-10), or vital checks."),
          ("Absence of Real-Time Doctor Loop:", " No platform directly attaches AI-generated diagnostic history to live doctor chat rooms for immediate physician verification.")])
    ]

    for c_left, c_top, c_title, c_bullets in cards_info:
        card = add_card(s5, c_left, c_top, Inches(5.733), Inches(2.6), COLOR_WHITE, COLOR_CARD_BORDER)
        tf_c = card.text_frame
        tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = Inches(0.2)
        p = tf_c.paragraphs[0]
        p.text = c_title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY_DARK

        for b_title, b_desc in c_bullets:
            p = tf_c.add_paragraph()
            p.space_before = Pt(6)
            run_b = p.add_run()
            run_b.text = "• " + b_title
            run_b.font.bold = True
            run_b.font.size = Pt(13)
            run_b.font.color.rgb = COLOR_CYAN_ACCENT
            run_d = p.add_run()
            run_d.text = b_desc
            run_d.font.size = Pt(13)
            run_d.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 6: Project Planning & Proposal (Review - II Milestone)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, COLOR_BG_LIGHT)
    add_header(s6, "Project Planning, Proposal & Review II Progress Milestone", "Section 5: Project Planning & Proposal")

    # Left: Project Proposal & Objectives
    left_card = add_card(s6, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.3))
    tf_lp = left_card.text_frame
    tf_lp.margin_left = tf_lp.margin_right = tf_lp.margin_top = Inches(0.25)
    p = tf_lp.paragraphs[0]
    p.text = "PROJECT PROPOSAL & OBJECTIVES"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK

    prop_bullets = [
        ("Multi-Organ Diagnostics Engine:", " Unify 4 specialized machine learning models (Brain MRI, Breast Cancer, Blood CBC, Spleen CT) into a single sub-second API."),
        ("Medical Report Synthesis:", " Translate model logits into clinical reports featuring severity metrics (1-10), organ status, and physician recommendations."),
        ("Full-Stack Telemedicine Portal:", " Implement 3 distinct role-based portals (Patient: 18 pages, Doctor: 6 pages, Admin: 4 pages) with secure JWT authorization."),
        ("Real-Time Teleconsultation:", " Build WebSocket-based bidirectional messaging (Socket.io) with room isolation and doctor availability synchronization."),
        ("Scan Record Persistence:", " Archive complete diagnostic history in MongoDB for longitudinal patient record tracking.")
    ]
    for b_title, b_desc in prop_bullets:
        p = tf_lp.add_paragraph()
        p.space_before = Pt(8)
        rb = p.add_run()
        rb.text = "• " + b_title
        rb.font.bold = True
        rb.font.size = Pt(13)
        rb.font.color.rgb = COLOR_CYAN_ACCENT
        rd = p.add_run()
        rd.text = b_desc
        rd.font.size = Pt(13)
        rd.font.color.rgb = COLOR_TEXT_MAIN

    # Right: Review II Milestone & Implementation Status
    right_card = add_card(s6, Inches(6.8), Inches(1.7), Inches(5.733), Inches(5.3))
    tf_rp = right_card.text_frame
    tf_rp.margin_left = tf_rp.margin_right = tf_rp.margin_top = Inches(0.25)
    p = tf_rp.paragraphs[0]
    p.text = "REVIEW — II IMPLEMENTATION STATUS"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK

    status_items = [
        ("✅ Core 3-Tier Distributed Architecture", "React 19 + Express Gateway + Flask ML + MongoDB running concurrently via start.bat launcher."),
        ("✅ 4 Operational ML Inference Pipelines", "ResNet-18 ONNX, MedMNIST ONNX, XGBoost PKL, and PyTorch 3D U-Net fully tested."),
        ("✅ Real-Time Chat & Availability Sync", "Socket.io real-time chat rooms, typing indicators, and doctor status toggles implemented."),
        ("✅ MongoDB Schema Design & Seeder", "Users, Doctors, Appointments, Conversations, and MriAnalysis collections active with mock seeds."),
        ("✅ Tripartite Role-Based Authentication", "Bcrypt 12-round hashing, JWT verification middleware, and role-protected route guards."),
        ("⏳ Work in Progress for Review III", "WebRTC live video consultation room, Google Gemini LLM API integration, Razorpay gateway.")
    ]
    for s_title, s_desc in status_items:
        p = tf_rp.add_paragraph()
        p.space_before = Pt(6)
        rb = p.add_run()
        rb.text = s_title + "\n"
        rb.font.bold = True
        rb.font.size = Pt(13)
        rb.font.color.rgb = COLOR_GREEN if "✅" in s_title else COLOR_CYAN_ACCENT
        rd = p.add_run()
        rd.text = "   " + s_desc
        rd.font.size = Pt(12)
        rd.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 7: Methodology - AI Diagnostics Engine
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, COLOR_BG_LIGHT)
    add_header(s7, "Multi-Model AI Diagnostic Methodology & Pipelines", "Section 6: Methodology")

    # 4 Model Cards
    m_cards = [
        (Inches(0.8), Inches(1.7), Inches(2.75), "Brain MRI Classifier", "ResNet-18 (ONNX Runtime)",
         "• Input: 224x224x3 Normalized Tensor\n• Architecture: 18-layer Deep Residual CNN with skip connections\n• Classes: Glioma, Meningioma, Pituitary, Normal\n• Severity: 1 to 8/10 risk rating\n• Endpoint: POST /predict/brain"),
        
        (Inches(3.8), Inches(1.7), Inches(2.75), "Breast Mammography", "MedMNIST ResNet (ONNX)",
         "• Input: 224x224x3 Scaled Tensor\n• Preprocessing: Contrast normalization & center cropping\n• Output: Binary BI-RADS risk classification (Benign vs. Malignant)\n• Severity: Benign (1/10) vs Malignant (9/10)\n• Endpoint: POST /predict/breast"),
         
        (Inches(6.8), Inches(1.7), Inches(2.75), "Blood Report Analyzer", "XGBoost Classifier (PKL)",
         "• Input: 6 Clinical Parameters:\n  WBC, RBC, Hemoglobin, Platelets, Neutrophils, Lymphocytes\n• Architecture: Gradient Boosted Trees\n• Classes: Normal, Anemia, Infection, Leukemia\n• Endpoint: POST /predict/blood"),
         
        (Inches(9.8), Inches(1.7), Inches(2.733), "Spleen CT Volumetric", "3D U-Net (PyTorch)",
         "• Input: Standardized [1, 1, 96, 96, 96] 3D CT voxel volume\n• Architecture: 3D Conv + PReLU + Transposed Conv Skip connections\n• Output: Spleen volume (cm³) & Splenomegaly ratio (> 0.08 threshold)\n• Endpoint: POST /predict/spleen")
    ]

    for c_left, c_top, c_width, c_title, c_tech, c_content in m_cards:
        card = add_card(s7, c_left, c_top, c_width, Inches(4.1), COLOR_WHITE, COLOR_CARD_BORDER)
        tf_m = card.text_frame
        tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = Inches(0.18)
        
        p = tf_m.paragraphs[0]
        p.text = c_title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY_DARK

        p_t = tf_m.add_paragraph()
        p_t.text = c_tech
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_CYAN_ACCENT
        p_t.space_before = Pt(2)

        p_c = tf_m.add_paragraph()
        p_c.text = c_content
        p_c.font.size = Pt(12)
        p_c.font.color.rgb = COLOR_TEXT_MAIN
        p_c.space_before = Pt(8)

    # Diagnostic Report Synthesis Workflow Banner
    flow_card = add_card(s7, Inches(0.8), Inches(6.0), Inches(11.733), Inches(1.05), COLOR_NAVY_DARK, COLOR_CYAN_ACCENT)
    tf_f = flow_card.text_frame
    tf_f.margin_left = tf_f.margin_right = tf_f.margin_top = Inches(0.15)
    p_f0 = tf_f.paragraphs[0]
    p_f0.text = "AUTOMATED CLINICAL REPORT SYNTHESIS PIPELINE:"
    p_f0.font.size = Pt(13)
    p_f0.font.bold = True
    p_f0.font.color.rgb = RGBColor(56, 189, 248)

    p_f1 = tf_f.add_paragraph()
    p_f1.text = "Raw Scan Upload  ➔  Tensor Transformation  ➔  Model Logits / Softmax Inference  ➔  Severity Mapping (1–10)  ➔  Structured Clinical Findings & Recommendations  ➔  Doctor Verification Queue"
    p_f1.font.size = Pt(13)
    p_f1.font.bold = True
    p_f1.font.color.rgb = COLOR_WHITE
    p_f1.space_before = Pt(4)

    # =========================================================================
    # SLIDE 8: System Architecture & Integration
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, COLOR_BG_LIGHT)
    add_header(s8, "3-Tier Distributed Microservices Architecture & Dataflow", "Section 7: System Architecture")

    # 3 Architecture Tier Cards
    # Tier 1: Frontend Client
    t1_card = add_card(s8, Inches(0.8), Inches(1.7), Inches(3.7), Inches(3.6), COLOR_WHITE, COLOR_CARD_BORDER)
    tf_t1 = t1_card.text_frame
    tf_t1.margin_left = tf_t1.margin_right = tf_t1.margin_top = Inches(0.2)
    p = tf_t1.paragraphs[0]
    p.text = "CLIENT PRESENTATION TIER"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK

    p_sub = tf_t1.add_paragraph()
    p_sub.text = "React 19 + Vite 8 (Port 5175)"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_CYAN_ACCENT

    t1_points = [
        "• 31 Distinct Portals & Views (Patient, Doctor, Admin)",
        "• State Management: Zustand 5.0",
        "• UI Framework: Material UI v9 & Emotion",
        "• Charts & Graphics: Recharts & Framer Motion",
        "• Real-time Client: Socket.io-client 4.8",
        "• API Interceptor: Axios with JWT auth headers"
    ]
    for pt in t1_points:
        p = tf_t1.add_paragraph()
        p.text = pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(4)

    # Tier 2: API Gateway
    t2_card = add_card(s8, Inches(4.8), Inches(1.7), Inches(3.7), Inches(3.6), COLOR_WHITE, COLOR_CARD_BORDER)
    tf_t2 = t2_card.text_frame
    tf_t2.margin_left = tf_t2.margin_right = tf_t2.margin_top = Inches(0.2)
    p = tf_t2.paragraphs[0]
    p.text = "API GATEWAY & CONTROLLER"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK

    p_sub = tf_t2.add_paragraph()
    p_sub.text = "Node.js + Express (Port 5000)"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_CYAN_ACCENT

    t2_points = [
        "• RESTful Routing: /auth, /doctors, /appointments, /mri",
        "• WebSockets: Socket.io 4.7 for bidirectional chat",
        "• Security: JWT Verification, Bcrypt 12 rounds, Helmet",
        "• File Ingestion: Multer multipart form processing",
        "• ODM & Persistence: Mongoose 8.6 on MongoDB",
        "• Resilient Fallback: Auto-mock failover on timeout"
    ]
    for pt in t2_points:
        p = tf_t2.add_paragraph()
        p.text = pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(4)

    # Tier 3: ML Microservice
    t3_card = add_card(s8, Inches(8.8), Inches(1.7), Inches(3.7), Inches(3.6), COLOR_WHITE, COLOR_CARD_BORDER)
    tf_t3 = t3_card.text_frame
    tf_t3.margin_left = tf_t3.margin_right = tf_t3.margin_top = Inches(0.2)
    p = tf_t3.paragraphs[0]
    p.text = "DIAGNOSTIC ML ENGINE"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK

    p_sub = tf_t3.add_paragraph()
    p_sub.text = "Python Flask (Port 5001)"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_CYAN_ACCENT

    t3_points = [
        "• Inference Engine: ONNX Runtime 1.22 & PyTorch",
        "• Image Processing: PIL, NumPy, SciPy",
        "• Endpoints: /predict/brain, /breast, /blood, /spleen",
        "• 3D Volumetrics: Custom 3D U-Net residual architecture",
        "• Tabular Engine: Scikit-learn & XGBoost Classifier",
        "• Cross-Origin: Flask-CORS with JSON/Multipart responses"
    ]
    for pt in t3_points:
        p = tf_t3.add_paragraph()
        p.text = pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(4)

    # Dataflow Diagram / Process Banner
    proc_card = add_card(s8, Inches(0.8), Inches(5.5), Inches(11.733), Inches(1.6), COLOR_WHITE, COLOR_CYAN_ACCENT)
    tf_p = proc_card.text_frame
    tf_p.margin_left = tf_p.margin_right = tf_p.margin_top = Inches(0.18)
    p_proc = tf_p.paragraphs[0]
    p_proc.text = "END-TO-END DATAFLOW PIPELINE (UPLOAD TO CONSULTATION):"
    p_proc.font.size = Pt(14)
    p_proc.font.bold = True
    p_proc.font.color.rgb = COLOR_NAVY_DARK

    p_flow1 = tf_p.add_paragraph()
    p_flow1.text = "1. Patient uploads scan via React UI  ➔  2. Express gateway authenticates JWT & streams file via Axios  ➔  3. Python ML runs ONNX/PyTorch model"
    p_flow1.font.size = Pt(13)
    p_flow1.font.color.rgb = COLOR_TEXT_MAIN
    p_flow1.space_before = Pt(4)

    p_flow2 = tf_p.add_paragraph()
    p_flow2.text = "4. Flask synthesizes severity & clinical findings  ➔  5. Mongoose archives report in MongoDB MriAnalysis  ➔  6. Real-time Socket.io triggers doctor review queue"
    p_flow2.font.size = Pt(13)
    p_flow2.font.color.rgb = COLOR_TEXT_MAIN
    p_flow2.space_before = Pt(4)

    # =========================================================================
    # SLIDE 9: References (Strict IEEE Standard)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, COLOR_BG_LIGHT)
    add_header(s9, "References (Strict IEEE Citation Standard)", "Section 8: References")

    # Reference List Card
    ref_card = add_card(s9, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.3), COLOR_WHITE, COLOR_CARD_BORDER)
    tf_ref = ref_card.text_frame
    tf_ref.margin_left = tf_ref.margin_right = tf_ref.margin_top = Inches(0.3)
    
    references = [
        ("[1]", " S. Deepak and P. M. Ameer, \"Brain tumor classification using deep CNN features via transfer learning,\" Comput. Biol. Med., vol. 111, p. 103345, Aug. 2019."),
        ("[2]", " L. Shen et al., \"Deep learning to improve breast cancer detection on screening mammography,\" Sci. Rep., vol. 9, no. 1, p. 12495, Aug. 2019."),
        ("[3]", " O. Ronneberger, P. Fischer, and T. Brox, \"U-Net: Convolutional networks for biomedical image segmentation,\" in Medical Image Computing and Computer-Assisted Intervention (MICCAI), Cham: Springer, 2015, pp. 234–241."),
        ("[4]", " Ö. Çiçek, A. Abdulkadir, S. S. Lienkamp, T. Brox, and O. Ronneberger, \"3D U-Net: Learning dense volumetric segmentation from sparse annotation,\" in MICCAI, Cham: Springer, 2016, pp. 424–432."),
        ("[5]", " J. Yang et al., \"MedMNIST v2: A large-scale lightweight benchmark for 2D and 3D biomedical image classification,\" Sci. Data, vol. 10, no. 1, p. 41, Jan. 2023."),
        ("[6]", " T. Chen and C. Guestrin, \"XGBoost: A scalable tree boosting system,\" in Proc. 22nd ACM SIGKDD Int. Conf. Knowl. Discovery Data Mining, 2016, pp. 785–794."),
        ("[7]", " World Health Organization, \"Global strategy on digital health 2020–2025,\" Geneva: World Health Organization, 2020."),
        ("[8]", " A. Esteva et al., \"Dermatologist-level classification of skin cancer with deep neural networks,\" Nature, vol. 542, no. 7639, pp. 115–118, Jan. 2017.")
    ]

    p_r0 = tf_ref.paragraphs[0]
    p_r0.text = "PRIMARY ACADEMIC & CLINICAL CITATIONS:"
    p_r0.font.size = Pt(15)
    p_r0.font.bold = True
    p_r0.font.color.rgb = COLOR_NAVY_DARK

    for idx, (num, text) in enumerate(references):
        p = tf_ref.add_paragraph()
        p.space_before = Pt(8)
        run_n = p.add_run()
        run_n.text = num
        run_n.font.bold = True
        run_n.font.size = Pt(13)
        run_n.font.color.rgb = COLOR_CYAN_ACCENT
        run_t = p.add_run()
        run_t.text = text
        run_t.font.size = Pt(13)
        run_t.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 10: Conclusion & Ready for Demonstration / Q&A
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, COLOR_NAVY_DARK)

    # Accent top border
    top_bar10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar10.fill.solid()
    top_bar10.fill.fore_color.rgb = COLOR_CYAN_ACCENT
    top_bar10.line.fill.background()

    # Center Heading
    c_box = s10.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.5))
    tf_c = c_box.text_frame
    tf_c.word_wrap = True
    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "THANK YOU"
    p_c1.font.size = Pt(44)
    p_c1.font.bold = True
    p_c1.font.color.rgb = COLOR_WHITE
    p_c1.alignment = PP_ALIGN.CENTER

    p_c2 = tf_c.add_paragraph()
    p_c2.text = "Sushruth: AI-Powered Multi-Organ Diagnostic & Integrated Telemedicine Platform"
    p_c2.font.size = Pt(20)
    p_c2.font.bold = True
    p_c2.font.color.rgb = RGBColor(56, 189, 248)
    p_c2.alignment = PP_ALIGN.CENTER
    p_c2.space_before = Pt(6)

    # 3 Summary Highlights Cards
    h1 = add_card(s10, Inches(1.5), Inches(3.5), Inches(3.2), Inches(2.2), COLOR_NAVY_LIGHT, COLOR_CYAN_ACCENT)
    tf_h1 = h1.text_frame
    tf_h1.margin_left = tf_h1.margin_right = tf_h1.margin_top = Inches(0.2)
    p = tf_h1.paragraphs[0]
    p.text = "4 CLINICAL MODELS"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = RGBColor(56, 189, 248)
    p_sub = tf_h1.add_paragraph()
    p_sub.text = "Brain ResNet-18, Breast MedMNIST, Blood XGBoost, and Spleen 3D U-Net operational."
    p_sub.font.size = Pt(13)
    p_sub.font.color.rgb = COLOR_WHITE
    p_sub.space_before = Pt(6)

    h2 = add_card(s10, Inches(5.1), Inches(3.5), Inches(3.2), Inches(2.2), COLOR_NAVY_LIGHT, COLOR_CYAN_ACCENT)
    tf_h2 = h2.text_frame
    tf_h2.margin_left = tf_h2.margin_right = tf_h2.margin_top = Inches(0.2)
    p = tf_h2.paragraphs[0]
    p.text = "FULL-STACK PLATFORM"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = RGBColor(56, 189, 248)
    p_sub = tf_h2.add_paragraph()
    p_sub.text = "React 19 (31 pages), Node Express gateway, MongoDB database, and Socket.io chat."
    p_sub.font.size = Pt(13)
    p_sub.font.color.rgb = COLOR_WHITE
    p_sub.space_before = Pt(6)

    h3 = add_card(s10, Inches(8.7), Inches(3.5), Inches(3.2), Inches(2.2), COLOR_NAVY_LIGHT, COLOR_CYAN_ACCENT)
    tf_h3 = h3.text_frame
    tf_h3.margin_left = tf_h3.margin_right = tf_h3.margin_top = Inches(0.2)
    p = tf_h3.paragraphs[0]
    p.text = "REVIEW II READY"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = RGBColor(56, 189, 248)
    p_sub = tf_h3.add_paragraph()
    p_sub.text = "All core inference endpoints and UI flows seeded and prepared for live demonstration."
    p_sub.font.size = Pt(13)
    p_sub.font.color.rgb = COLOR_WHITE
    p_sub.space_before = Pt(6)

    # Bottom invitation text
    b_box = s10.shapes.add_textbox(Inches(1.0), Inches(6.1), Inches(11.3), Inches(0.8))
    tf_bb = b_box.text_frame
    p_bb = tf_bb.paragraphs[0]
    p_bb.text = "Questions & Feedback from the Review Panel Welcome"
    p_bb.font.size = Pt(18)
    p_bb.font.bold = True
    p_bb.font.color.rgb = RGBColor(224, 242, 254)
    p_bb.alignment = PP_ALIGN.CENTER

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    build_presentation()
