from pptx import Presentation

prs = Presentation('Sushuruth_Review1_PPT.pptx')
for s_idx in [1, 2, 6, 8]:
    slide = prs.slides[s_idx]
    title = slide.shapes.title.text if slide.shapes.title else 'No Title'
    print(f"\n--- Slide {s_idx+1}: {title} ---")
    for s in slide.shapes:
        if s.has_text_frame and s != slide.shapes.title:
            tf = s.text_frame
            for p_idx, p in enumerate(tf.paragraphs):
                run_info = []
                for r in p.runs:
                    color = r.font.color.rgb if r.font.color and hasattr(r.font.color, 'rgb') else None
                    size = r.font.size.pt if r.font.size else None
                    run_info.append(f"'{r.text[:25]}' sz={size} b={r.font.bold} col={color}")
                print(f"  P{p_idx} (lvl {p.level}): {p.text[:45]} | runs: {run_info}")
