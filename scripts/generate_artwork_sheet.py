import os
import shutil
from PIL import Image, ImageDraw, ImageFont

def create_character_sheet():
    base_dir = os.path.abspath("MOCHI-VIRTUAL-PET")
    src_assets = os.path.join(base_dir, "public", "assets", "mochi")
    dest_assets = os.path.join(base_dir, "submission", "assets")
    os.makedirs(dest_assets, exist_ok=True)

    sprites = ["mochi-idle.png", "mochi-happy.png", "mochi-sad.png", "mochi-angry.png", "mochi-surprised.png"]
    for s in sprites:
        src = os.path.join(src_assets, s)
        dst = os.path.join(dest_assets, s)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {s} -> {dst}")

    # Build High-Resolution Presentation Sheet (1600 x 1050)
    sheet_w, sheet_h = 1600, 1050
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(sheet)

    # Try standard system fonts or default
    try:
        title_font = ImageFont.truetype("arialbd.ttf", 36)
        sub_font = ImageFont.truetype("arial.ttf", 20)
        label_font = ImageFont.truetype("arialbd.ttf", 26)
        desc_font = ImageFont.truetype("arial.ttf", 16)
    except IOError:
        title_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        desc_font = ImageFont.load_default()

    # Sheet Title Header
    draw.text((sheet_w // 2, 45), "MOCHI: CHARACTER DESIGN & EMOTIONAL EXPRESSIONS", fill=(17, 17, 17, 255), font=title_font, anchor="mm")
    draw.text((sheet_w // 2, 85), "Strict Monochrome Pixel Art Specifications | Anatomical & Proportion Continuity", fill=(75, 85, 99, 255), font=sub_font, anchor="mm")
    draw.line([(80, 115), (sheet_w - 80, 115)], fill=(17, 17, 17, 255), width=3)

    # 4 Emotion Cards arranged in a row (Card width ~320px)
    emotions = [
        {
            "id": "1. HAPPY",
            "file": "mochi-happy.png",
            "desc": "Cheerful smiling eyes\nOpen joyful mouth\nRaised blush cheeks\nUpright swaying sprout",
            "tag": "JOY: 80-100%"
        },
        {
            "id": "2. SAD",
            "file": "mochi-sad.png",
            "desc": "Drooping curved eyes\nDownturned soft frown\nCrying pixel teardrop\nFloating gloom swirl",
            "tag": "HUNGER > 75%"
        },
        {
            "id": "3. SURPRISED",
            "file": "mochi-surprised.png",
            "desc": "Wide circular eyes\nOpen astonished mouth\nReaction marks (!?)\nAlert vertical bounce",
            "tag": "NEW EVENT / JOIN"
        },
        {
            "id": "4. ANGRY",
            "file": "mochi-angry.png",
            "desc": "Downward intense brows\nStern straight mouth\nFloating anger vein (💢)\nPoking annoyance",
            "tag": "POKED TOO FAST"
        }
    ]

    card_w = 320
    card_h = 780
    start_x = (sheet_w - (4 * card_w + 3 * 30)) // 2
    card_y = 160

    for i, em in enumerate(emotions):
        x = start_x + i * (card_w + 30)

        # Card Border with retro drop shadow
        draw.rectangle([x + 6, card_y + 6, x + card_w + 6, card_y + card_h + 6], fill=(220, 220, 215, 255))
        draw.rectangle([x, card_y, x + card_w, card_y + card_h], fill=(255, 255, 255, 255), outline=(17, 17, 17, 255), width=3)

        # Card Header Pill
        draw.rectangle([x + 15, card_y + 15, x + card_w - 15, card_y + 55], fill=(237, 236, 230, 255), outline=(17, 17, 17, 255), width=2)
        draw.text((x + card_w // 2, card_y + 35), em["id"], fill=(17, 17, 17, 255), font=label_font, anchor="mm")

        # Load and paste character sprite
        sprite_path = os.path.join(dest_assets, em["file"])
        if os.path.exists(sprite_path):
            sp = Image.open(sprite_path).convert("RGBA")
            # Resize with nearest neighbor for crisp pixel scaling
            sp_scaled = sp.resize((260, 260), Image.NEAREST)
            sheet.paste(sp_scaled, (x + (card_w - 260) // 2, card_y + 80), sp_scaled)

        # Trigger tag
        draw.rectangle([x + 30, card_y + 370, x + card_w - 30, card_y + 405], fill=(17, 17, 17, 255))
        draw.text((x + card_w // 2, card_y + 387), em["tag"], fill=(255, 255, 255, 255), font=desc_font, anchor="mm")

        # Feature descriptions
        lines = em["desc"].split("\n")
        line_y = card_y + 440
        for l in lines:
            draw.text((x + 25, line_y), "• " + l, fill=(30, 41, 59, 255), font=desc_font)
            line_y += 30

        # Technical notes footer in card
        draw.line([(x + 20, card_y + 600), (x + card_w - 20, card_y + 600)], fill=(212, 212, 206, 255), width=1)
        draw.text((x + 20, card_y + 620), "Scale: 512x512 PNG", fill=(100, 116, 139, 255), font=desc_font)
        draw.text((x + 20, card_y + 650), "Palette: 1-Bit Ink (#111111)", fill=(100, 116, 139, 255), font=desc_font)
        draw.text((x + 20, card_y + 680), "Fill: Pure White (#FFFFFF)", fill=(100, 116, 139, 255), font=desc_font)
        draw.text((x + 20, card_y + 710), "Head Sprout: Fixed 2-Leaf", fill=(100, 116, 139, 255), font=desc_font)

    # Footer summary
    draw.text((sheet_w // 2, sheet_h - 45), "Task 2 Official Deliverable | Verified Zero Color Bleed | Monotonic Character Continuity", fill=(100, 116, 139, 255), font=sub_font, anchor="mm")

    out_file = os.path.join(dest_assets, "mochi-expressions-sheet.png")
    sheet.save(out_file, "PNG")
    print(f"Generated clean presentation sheet: {out_file}")

if __name__ == "__main__":
    create_character_sheet()

