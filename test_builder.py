import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_final_presentation():
    # Load base template to preserve slide masters and theme
    prs = Presentation('Sushuruth .pptx')
    
    # Target 22-slide structure
    print(f"Original slide count: {len(prs.slides)}")
    print(f"Slide dimensions: {prs.slide_width.inches:.3f} x {prs.slide_height.inches:.3f}")
    
    # We want to create exactly 22 slides formatted cleanly matching the exact SRM template.
    # Color palette matching template:
    COLOR_TITLE = RGBColor(31, 31, 31)       # #1F1F1F Times New Roman Bold 32pt
    COLOR_SUBTITLE = RGBColor(31, 31, 31)    # 22pt Bold
    COLOR_BODY = RGBColor(51, 51, 51)        # 16-18pt Regular
    COLOR_ACCENT = RGBColor(0, 102, 204)     # SRM Royal Blue for highlights / tags
    COLOR_GRAY_LINE = RGBColor(127, 127, 127)# Gray accent line under titles
    COLOR_CARD_BG = RGBColor(248, 250, 252)  # Clean light card background
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)
    
    # Clear existing slides and rebuild systematically
    # Or clone slides and modify
    # Let's see the layouts available
    blank_layout = prs.slide_layouts[6]
    
    # We can delete all slides except slide 0 (title slide) and rebuild or use prs
    # Actually python-pptx doesn't have a direct slide.delete() method on prs.slides.
    # Standard way in python-pptx to clear or manipulate slides:
    rId_list = [rId for rId in prs.slides._sldIdLst]
    print(f"Found {len(rId_list)} slides in sldIdLst")

if __name__ == "__main__":
    build_final_presentation()
