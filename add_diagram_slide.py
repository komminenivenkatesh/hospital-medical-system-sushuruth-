import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

def create_presentation_with_diagram():
    # Load from Review 1 template
    prs = Presentation("Sushuruth_Review1_PPT.pptx")
    
    # Run the same updates as build_review2_from_template
    from build_review2_from_template import build_review2_from_template
    
    # We can import and adapt the logic to insert a dedicated slide with the diagram
    import build_review2_from_template as b
    
    # Let's write the complete deck with the diagram slide inserted
    # Slide 1 to 7 are set up
    # Slide 8: Architecture Details
    # Insert new slide: Visual Diagram
    blank_layout = prs.slide_layouts[6]
    title_content_layout = prs.slide_layouts[1]
    
    # Add slide with diagram before references
    diag_slide = prs.slides.add_slide(title_content_layout)
    if diag_slide.shapes.title:
        diag_slide.shapes.title.text = "System Architecture Blueprint"
        p = diag_slide.shapes.title.text_frame.paragraphs[0]
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = RGBColor(15, 23, 42)
        
    # Remove default content box on this slide
    for sh in list(diag_slide.shapes):
        if sh != diag_slide.shapes.title:
            sp = sh._element
            sp.getparent().remove(sp)
            
    # Insert the generated high-res diagram image
    if os.path.exists("architecture_diagram.png"):
        left = Inches(0.8)
        top = Inches(1.8)
        width = Inches(11.733)
        height = Inches(5.2)
        diag_slide.shapes.add_picture("architecture_diagram.png", left, top, width=width, height=height)

    output_path = "Sushuruth_Review2_Final_With_Diagram.pptx"
    prs.save(output_path)
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    create_presentation_with_diagram()
