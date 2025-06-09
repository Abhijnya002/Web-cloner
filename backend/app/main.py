from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from playwright.async_api import async_playwright
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import base64
import requests
import os

# Load environment variables (for HuggingFace API)
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://web-cloner-vwxz.vercel.app"], # Use your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# Models
# ============================
class URLRequest(BaseModel):
    url: str
    method: str = "playwright"  # can be "playwright" or "bs4"

class CloneRequest(BaseModel):
    html: str
    stylesheets: list[str] = []

# ============================
# /scrape/ - Dual Method Support
# ============================
@app.post("/scrape/")
async def scrape_website(request: URLRequest):
    try:
        if request.method == "bs4":
            return scrape_with_bs4(request.url)
        else:
            return await scrape_with_playwright(request.url)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------
# Playwright-based scraping
# ----------------------------
async def scrape_with_playwright(url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, timeout=10000)

        html_content = await page.content()
        stylesheets = await page.eval_on_selector_all(
            "link[rel='stylesheet']", "els => els.map(e => e.href)"
        )
        screenshot_bytes = await page.screenshot(full_page=True)
        screenshot_base64 = base64.b64encode(screenshot_bytes).decode("utf-8")

        await browser.close()

    return {
        "html": html_content,
        "stylesheets": stylesheets,
        "screenshot": screenshot_base64
    }

# ----------------------------
# BeautifulSoup-based scraping (fast + no JS)
# ----------------------------
def scrape_with_bs4(url: str):
    res = requests.get(url, timeout=10)
    if not res.ok:
        raise Exception(f"Failed to load site: {res.status_code}")

    soup = BeautifulSoup(res.text, "html.parser")
    html_content = soup.prettify()

    return {
        "html": html_content,
        "stylesheets": []  # Not handled in BS4 mode
    }

# ============================
# /clone/ - HuggingFace API OR Echo
# ============================
@app.post("/clone/")
async def clone_website(data: CloneRequest):
    # Just return raw HTML for now
    return {"cloned_html": data.html}



# ----------------------------
# HuggingFace Zephyr Cloning
# ----------------------------
async def clone_with_huggingface(data: CloneRequest):
    prompt = f"""
You are a skilled HTML and CSS developer. Based on the following HTML and CSS context, return a single-file HTML page that visually replicates the design.

HTML Content:
{data.html[:4000]}

Stylesheets:
{', '.join(data.stylesheets)}
"""

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 1024,
            "return_full_text": False
        }
    }

    response = requests.post(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        raise Exception(f"Hugging Face API error: {response.status_code} - {response.text}")

    result = response.json()
    cloned_html = result[0]["generated_text"]

    return {"cloned_html": cloned_html}
