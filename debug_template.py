from pptx import Presentation

prs = Presentation('Sushuruth .pptx')
slide2 = prs.slides[1]
print("Slide 2 shapes details:")
for idx, s in enumerate(slide2.shapes):
    print(f"Shape {idx}: name={s.name}, type={s.shape_type}")
    if s.has_text_frame:
        for p_idx, p in enumerate(s.text_frame.paragraphs):
            runs = []
            for r in p.runs:
                col = r.font.color.rgb if r.font.color and hasattr(r.font.color, 'rgb') else None
                sz = r.font.size.pt if r.font.size else None
                runs.append((r.text[:20], r.font.name, sz, r.font.bold, col))
            print(f"  P{p_idx}: runs={runs}")
