from clients import openai_client
import concurrent.futures
from io import BytesIO
import fitz  # PyMuPDF
from PIL import Image
import mimetypes
import tempfile
import base64
import random
import json
import csv
import os
import io

def ensure_storage_path(path: str) -> str:
    norm = os.path.normpath(path)
    parts = norm.split(os.sep)

    if '.storage' in parts:
        return path

    dir_parts, basename = parts[:-1], parts[-1]

    if not basename.startswith('.'):
        basename = '.' + basename

    storage_dir = os.path.join('.', '.storage', *dir_parts)
    os.makedirs(storage_dir, exist_ok=True)

    return os.path.join(storage_dir, basename)

def generate_data_url(path: str) -> str:
    mime, _ = mimetypes.guess_type(path)
    if not mime:
        mime = "application/octet-stream"
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    return f"data:{mime};base64,{b64}"

def generate_prompt(sample_images: list, user_prompt: str) -> str:
    prompt_text = (
        f"Consider this user request: {user_prompt}\n\n"
        "Use sample pages from a PDF document to:\n"
        "1. Identify the key fields to extract from each page.\n"
        "2. Provide a flat JSON template (no nested fields) representing a single CSV record "
        "with only the most relevant elements.\n\n"
        "Please explain in simple terms which fields you selected.\n\n"
        "Finally, include an example of the JSON structure, like this:\n"
        "```json\n"
        "{\n"
        "  \"field1\": \"\",\n"
        "  \"field2\": \"\",\n"
        "  \"field3\": \"\"\n"
        "}\n"
        "```"
    )

    content = [{"type": "text", "text": prompt_text}]

    for img in sample_images:
        # if it's a PIL image, encode it to a data-URL
        if isinstance(img, Image.Image):
            buf = BytesIO()
            img.save(buf, format="PNG")
            b64 = base64.b64encode(buf.getvalue()).decode("ascii")
            url = f"data:image/png;base64,{b64}"
        else:
            # assume it's a path
            url = generate_data_url(img)

        content.append({
            "type": "image_url",
            "image_url": {"url": url}
        })

    resp = openai_client.chat.completions.create(
        model="o4-mini",
        messages=[{"role": "user", "content": content}],
    )
    return resp.choices[0].message.content

def convert_PDF_to_images(
pdf_path: str,
    dpi: int = 200
) -> list:
    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")

    images = []
    with fitz.open(pdf_path) as doc:
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        gray = fitz.csGRAY

        for page_number in range(doc.page_count):
            page = doc.load_page(page_number)
            pix = page.get_pixmap(matrix=mat, colorspace=gray, alpha=False)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            images.append(img)
            print(f"Reading page {page_number + 1} 📖")

    return images

def image_analyzer(image_path: str, prompt: str) -> dict:
    url = generate_data_url(image_path)
    resp = openai_client.chat.completions.create(
        model="o4-mini",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": url}},
            ],
        }],
        response_format={"type": "json_object"}
    )
    return resp.choices[0].message.content

def generate_csv_based_pdf(user_prompt: str, pdf_path: str) -> str:
    filename = os.path.basename(pdf_path).rsplit('.', 1)[0].replace('.', '')

    # 0) Validate path
    pdf_path = ensure_storage_path(pdf_path)

    # 1) Convert PDF to images
    images = convert_PDF_to_images(pdf_path, dpi=200)

    # 2) Generate JSON template from 5 pages
    prompt = generate_prompt(
        random.sample(images, min(len(images), 5)),
        user_prompt
    )

    records = []

    # 3) Analyze all pages in parallel (no sorting)
    with tempfile.TemporaryDirectory() as tmpdir:
        def analyze_page(idx_img):
            idx, img = idx_img
            img_path = os.path.join(tmpdir, f"page_{idx}.png")
            img.save(img_path, format="PNG")

            prompt_template = (
                f"Generate a JSON file with one or multiple records; attach only to the following keys: {prompt}\n"
                "Organize and return each record inside of a records list like this:\n"
                "{\n"
                "  \"records\": [\n"
                "    {\n"
                "    }\n"
                "  ]\n"
                "}\n"
            )
            raw = image_analyzer(img_path, prompt_template)
            data = json.loads(raw) if isinstance(raw, str) else raw
            print("Page added to CSV ✅")
            return data.get("records", [])

        max_workers = os.cpu_count() or 4
        idx_imgs = list(enumerate(images, start=1))
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            for page_records in executor.map(analyze_page, idx_imgs):
                for rec in page_records:
                    # lowercase all keys
                    lowercased = {k.lower(): v for k, v in rec.items()}
                    records.append(lowercased)

    # 4) Save to CSV
    all_keys = []
    if records:
        all_keys = list(records[0].keys())
        for rec in records[1:]:
            for k in rec.keys():
                if k not in all_keys:
                    all_keys.append(k)

    os.makedirs("./.storage", exist_ok=True)
    out_csv = f"./.storage/{filename}.csv"
    with open(out_csv, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=all_keys)
        writer.writeheader()
        writer.writerows(records)

    return f"File has been procesed and a CSV file was generated -> '{filename}.csv'"

generate_csv_based_pdf_description = {
    "type": "function",
    "function": {
        "name": "generate_csv_based_pdf",
        "description": "Reads the PDF file at the given path, extracts from each page as tabular data (guided by the provided prompt), and writes it into a CSV file at the specified output path.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "pdf_path": {
                    "type": "string",
                    "description": "Path to the input PDF file to be converted."
                },
                "user_prompt": {
                    "type": "string",
                    "description": "User prompt rompt to guide the extraction or summarization of tabular data from each page based on user request."
                }
            },
            "required": ["pdf_path", "user_prompt"],
            "additionalProperties": False
        }
    }
}