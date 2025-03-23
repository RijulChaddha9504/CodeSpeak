# 🧠 CodeSpeak

> Code with voice. Navigate with clarity.  
> A minimalist, voice-powered IDE for blind and low-sight programmers.

---

## 🚀 About the Project

Modern IDEs are cluttered, visually dense, and largely inaccessible to blind and low-sight users. Inspired by research from Penn State University, **CodeSpeak** reimagines programming with accessibility at its core — combining a grid-based layout, large readable blocks, keyboard-friendly navigation, and AI-powered speech interaction.

CodeSpeak empowers visually impaired coders to read, write, and edit code in a structured, low-clutter environment — without needing to rely on traditional visual-heavy IDEs.

---

## 💡 Features

- 🎙️ **Voice Interaction** – Speak your code aloud and have it transcribed, parsed, and inserted in real-time.
- 🧱 **Grid-Based Editor** – Code is visualized as rows and blocks, each expandable and clearly outlined.
- 🔁 **Inline Editing** – Select any block to enlarge and edit with precision.
- 🧑‍💻 **AI Assistance** – Use AI to generate or explain code when needed.
- 📢 **Audio Feedback** – Real-time speech feedback using Google TTS for line-level accessibility.

---

## 🏗️ How We Built It

- **Frontend**: React + Tailwind + Vite
- **Backend**: Flask (Python), Node.js, Express
- **AI Model**: Gemini + custom neural verification layer
- **Speech Services**: Google Cloud TTS + custom speech recognition
- **Database**: SQLAlchemy + SQL
- **Cloud**: Google Cloud Storage (for audio/data transfer)

---

## 📚 Research Inspiration

This project was inspired by the work of [Dr. Syed Billah at Penn State](https://www.psu.edu/news/information-sciences-and-technology/story/new-coding-tool-could-aid-computer-programmers-who-are), whose Grid Editor proposed a spreadsheet-like layout for accessible coding. We built on these concepts by integrating generative AI and voice-driven workflows.

---

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/codespeak.git
cd codespeak

# Install frontend website display
cd Frontend/client
npm install
npm run dev

# Run nodejs server to allow for Google Cloud Storage Fetch
cd Frontend/server
npm install
npm start

# In a separate terminal, run backend
cd backend
pip install -r requirements.txt
flask run
