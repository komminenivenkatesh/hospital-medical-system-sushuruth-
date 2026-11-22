from pptx import Presentation

prs = Presentation('Sushuruth_Review1_PPT.pptx')
print(f"Slide Width: {prs.slide_width.inches} in, Height: {prs.slide_height.inches} in")
for i, slide in enumerate(prs.slides):
    print(f"\n=== Slide {i+1} (layout: {slide.slide_layout.name}) ===")
    print(f"Shape count: {len(slide.shapes)}")
    for s in slide.shapes:
        print(f"  Shape: name='{s.name}', type={s.shape_type}, left={s.left.inches:.2f}, top={s.top.inches:.2f}, w={s.width.inches:.2f}, h={s.height.inches:.2f}")
        if s.has_text_frame:
            for p_idx, p in enumerate(s.text_frame.paragraphs):
                txt = p.text.strip().encode('ascii', errors='replace').decode('ascii')
                if txt:
                    font_name = p.font.name if p.font else 'None'
                    font_size = p.font.size.pt if p.font and p.font.size else 'None'
                    bold = p.font.bold if p.font else 'None'
                    color = p.font.color.rgb if p.font and p.font.color and hasattr(p.font.color, 'rgb') else 'None'
                    print(f"    P{p_idx} [font={font_name}, size={font_size}, bold={bold}, color={color}]: {txt[:70]}")
