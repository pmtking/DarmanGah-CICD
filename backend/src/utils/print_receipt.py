# file: print_receipt.py
from escpos.printer import Serial
from PIL import Image, ImageDraw, ImageFont, ImageChops
import arabic_reshaper
from bidi.algorithm import get_display
import json
import sys
import os

# ----------------------------
# توابع کمکی
def to_persian_number(number):
    return str(number).translate(str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹"))

def format_price(number):
    return to_persian_number("{:,}".format(number))

def draw_rtl(draw, y, text, font, img_width, padding_outer=16, x_right=None):
    reshaped = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped)
    bbox = draw.textbbox((0,0), bidi_text, font=font)
    text_width = bbox[2]-bbox[0]
    x = x_right - text_width if x_right else img_width - text_width - padding_outer
    draw.text((x, y), bidi_text, font=font, fill=0)

def draw_center(draw, y, text, font, img_width):
    reshaped = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped)
    bbox = draw.textbbox((0,0), bidi_text, font=font)
    text_width = bbox[2]-bbox[0]
    x = (img_width - text_width)//2
    draw.text((x, y), bidi_text, font=font, fill=0)

def draw_dashed_box(draw, xy, dash=6, gap=4, width=1):
    x0, y0, x1, y1 = xy
    for i in range(x0, x1, dash+gap):
        draw.line([(i,y0),(min(i+dash,x1),y0)], fill=0, width=width)
        draw.line([(i,y1),(min(i+dash,x1),y1)], fill=0, width=width)
    for i in range(y0, y1, dash+gap):
        draw.line([(x0,i),(x0,min(i+dash,y1))], fill=0, width=width)
        draw.line([(x1,i),(x1,min(i+dash,y1))], fill=0, width=width)

def crop_white_margin(img):
    if img.mode != "L":
        img = img.convert("L")
    inverted = ImageChops.invert(img)
    bbox = inverted.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def print_chunks(p, image, max_height=1000):
    width, height = image.size
    for y0 in range(0, height, max_height):
        y1 = min(y0 + max_height, height)
        chunk = image.crop((0, y0, width, y1))
        p.image(chunk)

# ----------------------------
# تابع اصلی چاپ
def print_reception(receipt_data, save_for_debug=False):
    try:
        # اتصال به پرینتر COM
        p = Serial(devfile='COM31', baudrate=19200, timeout=1)

        # فونت‌ها
        font_path = os.path.join(os.path.dirname(__file__), "Vazir.ttf")
        font_main = ImageFont.truetype(font_path, 24)
        font_small = ImageFont.truetype(font_path, 18)
        font_small_bold = ImageFont.truetype(font_path, 20)
        font_turn = ImageFont.truetype(font_path, 32)
        font_stamp = ImageFont.truetype(font_path, 20)

        # اطلاعات و محاسبه‌ها
        services = receipt_data['services']
        insurance_base = receipt_data['insurance_base']
        insurance_extra = receipt_data['insurance_extra']
        total_payment = sum(s['price'] for s in services) - insurance_base - insurance_extra

        line_main = 30
        line_small = 22
        padding_outer = 16
        img_width = 576
        footer_min_space = 50

        content_height = font_main.size + font_turn.size + line_main*6 + line_small*len(services) + line_small*5 + 8
        img_height = padding_outer*2 + content_height + footer_min_space

        image = Image.new("L", (img_width,img_height), 255)
        draw = ImageDraw.Draw(image)
        y = padding_outer

        # کادر بیرونی
        draw.rounded_rectangle([5,5,img_width-5,img_height-5], radius=12, outline=0, width=2)

        # سربرگ
        draw_center(draw, y, "هوالشافی", font_main, img_width)
        y += font_main.size + 6

        # لوگو
        try:
            logo = Image.open(receipt_data.get("logo_path","logo.png"))
            logo = crop_white_margin(logo)
            logo_width = 230
            aspect_ratio = logo.height / logo.width
            logo_height = int(logo_width * aspect_ratio)
            logo = logo.resize((logo_width, logo_height), Image.LANCZOS)
            logo_x = (img_width - logo_width)//2
            image.paste(logo.convert("L"), (logo_x, y))
            y += logo_height + 6
        except:
            pass

        # شماره نوبت
        draw_center(draw, y, f"نوبت: {to_persian_number(receipt_data['turn_number'])}", font_turn, img_width)
        y += font_turn.size + 6

        # اطلاعات بیمار
        draw_rtl(draw, y, f"کاربر پذیرش: {receipt_data['reception_user']}", font_main, img_width)
        y += line_main
        draw_rtl(draw, y, f"شماره قبض: {to_persian_number(receipt_data['bill_number'])}    تاریخ: {to_persian_number(receipt_data['date'])}", font_main, img_width)
        y += line_main
        draw_rtl(draw, y, f"ساعت: {to_persian_number(receipt_data['time'])}", font_main, img_width)
        y += line_main
        draw_rtl(draw, y, f"نام بیمار: {receipt_data['patient_name']}", font_main, img_width)
        y += line_main
        draw_rtl(draw, y, f"کد ملی: {to_persian_number(receipt_data['national_code'])}    نوع مراجعه: {receipt_data['visit_type']}", font_main, img_width)
        y += line_main
        draw_rtl(draw, y, f"نام پزشک: {receipt_data['doctor_name']}    تخصص: {receipt_data['doctor_specialty']}", font_main, img_width)
        y += line_main + 6

        # جدول خدمات و پرداخت (مثل نسخه قبلی)
        # ... همانند نسخه قبل ...

        # فوتر
        footer_y = img_height - footer_min_space//2
        draw_center(draw, footer_y, receipt_data.get('footer_text','drfn.ir'), font_small, img_width)

        # ذخیره برای بررسی
        if save_for_debug:
            image.save("receipt_debug.png")

        # چاپ تصویر به قطعات
        final_image = image.convert("1")
        print_chunks(p, final_image)
        p.cut()
        print("Receipt printed successfully!")

    except Exception as e:
        print("Error printing receipt:", e)

# ----------------------------
# اجرا در حالت مستقیم
if __name__ == "__main__":
    try:
        data = json.loads(sys.stdin.read())
        print_reception(data, save_for_debug=True)
    except Exception as e:
        print("Error reading input:", e)
