# Website Cloner

A full-stack AI-powered website cloning tool that takes in a public website URL, scrapes its HTML/CSS design context, and regenerates it using a language model. 
---

## 💡 Features

- 🌐 Clone any public website by entering its URL
- 🕷️ Web scraping with Playwright for JS-heavy sites (and optional fallback to BeautifulSoup)
- 🤖 HTML generation using Hugging Face Zephyr-7B
- 🌗 Dark & Light mode toggle with persistent local preference
- 🎨 Animated, responsive, stylish UI (Tailwind CSS + custom effects)
- 🧪 Raw HTML preview + live iframe rendering
- 🌀 Loader animation during processing
- 🧩 Error handling and smooth UX transitions

---

## 🧱 Tech Stack

| Layer    | Technology                           |
|----------|---------------------------------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend  | FastAPI, Python, Playwright, BS4     |
| LLM API  | Hugging Face Inference API (Zephyr)  |

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abhijnya002/Web-cloner.git
cd Web-cloner
```

---

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
```

#### Create `.env` in `backend/`

```env
HF_TOKEN=your_huggingface_token_here
```

> This token is used to query Hugging Face’s Zephyr-7B model for HTML generation.

---

### 3. Start the FastAPI Server

```bash
uvicorn main:app --reload
```

> Server runs at: `http://localhost:8000`  
> Docs available at: `http://localhost:8000/docs`

---

### 4. Frontend Setup (Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

> App runs at: `http://localhost:3000`

---

## 🔁 How It Works

1. **User Input**: Enter a URL → Press “Clone Website”
2. **Scraping**: Frontend sends POST to `/scrape/` with URL  
   - `method = playwright`: Launches headless Chromium and retrieves HTML + stylesheet URLs + screenshot
3. **Cloning**: Sends HTML + stylesheets to `/clone/`
   - Zephyr LLM receives system prompt + HTML context and returns a reconstructed single-file HTML document
4. **Rendering**: Shows live iframe preview and raw HTML

---

## 📂 Project Structure

```
Web-cloner/
├── backend/
│   ├── main.py             # FastAPI server
│   ├── .env                # Hugging Face API token
│   └── requirements.txt    # Python deps
├── frontend/
│   ├── src/app/page.tsx    # UI logic & animations
│   ├── tailwind.config.js  # Custom theme
│   ├── globals.css         # Styling
│   └── public/             # Assets
└── README.md
```

---

## 🎥 Submission Video

The walkthrough video explains:

- App UI and features
- Scraping flow and API interactions
- How LLM is used for HTML generation
- Result rendering in iframe
- Vercel Deployment (Demo link)

> 📹 https://drive.google.com/file/d/1HjA20YFAdNb5-aaxthwxFdgU-Ifru26u/view?usp=sharing

---

## 🧠 Notes

- ✅ Supports modern Tailwind UI animations and transitions
- ✅ Fully responsive on mobile and desktop
- ✅ Handles slow-loading websites with loading animation
- ✅ Hugging Face response is trimmed for optimal prompt size

---

## 👤 Author

**Abhijnya K G**  
M.S. Computer Science @ Syracuse University  
[GitHub](https://github.com/Abhijnya002) · abhijnya002@gmail.com

