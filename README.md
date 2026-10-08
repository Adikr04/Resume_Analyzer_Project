# 🎯 Smart AI Resume Builder

A full-stack AI-powered resume builder for students targeting specific companies.
Built with React, Node.js, MongoDB, and the Anthropic Claude API.

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Optimization | Grammar, bullet points, impact statements via Claude API |
| 🏢 Company Targeting | Google, Microsoft, Amazon, TCS, Infosys, Accenture |
| 📊 Resume Scoring | ATS score out of 100 with improvement suggestions |
| 🎨 4 Templates | ATS Friendly, Modern Dev, Minimal, Corporate |
| 👁 Live Preview | Real-time preview as you type |
| 📥 PDF Export | One-click professional PDF download |
| 🌙 Dark Mode | Full dark/light theme toggle |
| 🔐 Auth | JWT + Google OAuth |
| 💾 Auto Save | Resume state auto-saved to MongoDB |

---

## 📁 Folder Structure

```
smart-resume-builder/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ScoreRing.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   └── TemplateSelector.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Builder.jsx
│   │   ├── constants/
│   │   │   └── companies.js
│   │   ├── hooks/
│   │   │   └── useAutoSave.js
│   │   ├── utils/
│   │   │   └── scoreCalculator.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resume.js
│   │   └── ai.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Anthropic API key
- Google OAuth credentials (optional)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/smart-resume-builder.git
cd smart-resume-builder

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 2. Environment Variables

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resumebuilder
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

### 3. Run Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open http://localhost:5173 🎉

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel Dashboard:
- `VITE_API_URL` = your Railway/Render backend URL
- `VITE_GOOGLE_CLIENT_ID` = your Google OAuth client ID

### Backend → Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo → Set environment variables
4. Railway auto-detects Node.js and deploys

**Or → Render.com:**
1. New Web Service → Connect GitHub
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Add environment variables in dashboard

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/resume` | Get all user resumes |
| POST | `/api/resume` | Create new resume |
| PUT | `/api/resume/:id` | Update resume |
| DELETE | `/api/resume/:id` | Delete resume |
| POST | `/api/ai/optimize` | AI resume optimization |
| POST | `/api/ai/score` | Get resume score |

---

## 🎨 Resume Templates

1. **ATS Friendly** — Clean black/white, standard formatting for ATS parsers
2. **Modern Dev** — Dark header, tech stack chips, two-column layout
3. **Minimal** — Elegant typography, gold accents, lots of whitespace
4. **Corporate** — Navy blue header, professional formatting, traditional layout

---

## 🤖 AI Features (Anthropic Claude)

The `/api/ai/optimize` endpoint sends resume data to Claude and returns:
- Improved career objective
- Enhanced project descriptions with action verbs
- Strengthened experience bullet points
- Suggested missing skills
- Company-specific keyword recommendations

---

## 📜 License

MIT — free to use and modify.
