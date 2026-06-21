# 🤖 AI-Powered Resume Builder

A modern web application that leverages Large Language Models (LLM) to help job seekers create professional, ATS-friendly resumes with AI-enhanced content, parse existing PDFs, and generate customized interview prep.

## ✨ Features

### Core Functionality
- **📄 Smart PDF Auto-Fill**: Upload an existing PDF resume and let our AI instantly parse and populate your profile fields.
- **🎯 AI Content Enhancement**: Transform basic job descriptions into compelling, metric-driven bullet points using the STAR method.
- **📝 Smart Summary Generator**: Create tailored professional summaries based on experience and target role.
- **📈 ATS Match Analysis**: Compare your resume against a target job description to get an objective ATS match score and keyword gap analysis.
- **🗣️ Custom Interview Prep**: Generate 5 highly specific, challenging interview questions you are likely to face, complete with strategic STAR-method answering tips.
- **👁️ Real-Time Preview**: Live split-screen view showing the resume as it's being built.
- **📥 PDF Export**: Download resumes as clean, professionally formatted PDFs.

### User Experience & Security
- **Secure Authentication**: Traditional Email/Password (bcrypt + JWT) and seamless **Google OAuth** login integration.
- **Cloud Auto-Save**: Resumes are automatically saved and synced to your account database.
- **Rate Limiting**: Secure AI endpoints protected against abuse via IP rate limiting.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## 🏗️ Architecture & Logic

### Tech Stack

**Frontend:**
- **Next.js 14** (React Framework, App Router)
- **Tailwind CSS** (Styling & Animations)
- **@react-oauth/google** (Google Sign-In)
- **html2pdf.js** (Client-side PDF Generation)

**Backend:**
- **Node.js + Express.js**
- **Prisma ORM** (Database mapping)
- **PostgreSQL Database** (Hosted on Neon)
- **Multer** (In-memory file processing for PDF uploads)

**AI Integration (@google/genai):**
- **Gemini 3.1 Flash-Lite** model for content generation and PDF parsing.
- Strict JSON-structured schemas to guarantee valid frontend parsing.
- Robust fallback logic and robust system prompting.

---

## 🚀 Getting Started & Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon DB URI)
- Google Gemini API key
- Google Cloud Console Client ID (for OAuth)

### 1. Installation
Clone the repository and install dependencies concurrently using the root package.json:
```bash
git clone <repository-url>
cd ai-resume-builder
npm run install:all
```

### 2. Environment Variables

Create `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_resume_builder?sslmode=require"
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=a_secure_random_string
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
```

Create `frontend/.env` (or `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Database Setup
Navigate into the backend and push the Prisma schema:
```bash
cd backend
npx prisma db push
npx prisma generate
cd ..
```

### 4. Running Both Servers Locally
The project is configured with `concurrently` in the root `package.json` to make running both servers incredibly easy.

**Option A: One Command (Recommended)**
Open a terminal in the **root** folder (`ai-resume-builder/`) and run:
```bash
npm run dev
```
*This spins up the Express backend on Port 5001 and the Next.js frontend on Port 3000 simultaneously.*

**Option B: Separate Terminals**
If you prefer seeing the logs separated:
1. Open Terminal 1: `cd backend && npm run dev`
2. Open Terminal 2: `cd frontend && npm run dev`

---

## 📚 API Documentation

### Auth & User Endpoints
- `POST /api/auth/signup` - Traditional email/password registration.
- `POST /api/auth/login` - Standard login returning a JWT.
- `POST /api/auth/google` - **Google OAuth Flow:** Accepts a Google ID token, verifies it directly with Google servers, creates a user if they don't exist, and returns a unified custom JWT.
- `GET /api/auth/me` - Verifies the JWT and returns the current user.

### AI Endpoints (Rate Limited)

- **`POST /api/parse-pdf`**
  - **Logic**: Accepts a `multipart/form-data` PDF file. Multer stores it securely in memory (no disk writes). The buffer is sent to Gemini to extract all text into structured JSON.

- **`POST /api/interview-prep`**
  - **Logic**: Analyzes the parsed resume JSON against an optional job description. Returns 5 highly specific interview questions and answering tips.

- **`POST /api/analyze-ats`**
  - **Logic**: Compares the user's resume data against a target job description, generating a strict match score (0-100) based on keyword overlap.

- **`POST /api/generate-bullet`** & **`POST /api/enhance-bullet`**
  - **Logic**: Rewrites user input into compelling, metric-driven bullet points using the STAR method without using buzzwords.

### Resume CRUD Endpoints
- `GET /api/resumes/me` - Fetch the user's resume data.
- `PUT /api/resumes/save` - Auto-save the complete resume document directly to the cloud.

---

## 📝 User Flow & Architecture Explained

1. **Authentication Layer**: Users arrive and can sign in via standard email/password or seamless Google One-Tap Login. A JWT is securely stored in `localStorage`.
2. **Onboarding (PDF Parsing)**: Instead of manually typing out a 5-page resume, users drag-and-drop their existing PDF. The Express backend buffers the file in memory, utilizes Gemini Vision/Text to structure the data, and pre-fills the React state instantly.
3. **Data Refinement**: Users navigate through Personal Info, Experience, Education, and Skills. The AI acts as a co-pilot, actively rewriting bullet points to be "ATS-Friendly".
4. **ATS & Interview Mode**: Users paste a target job description. The app calculates their match score, highlights missing keywords, and automatically generates an interactive Interview Prep modal with predicted recruiter questions.
5. **Live Export**: As the user modifies data, a live iframe/component reflects the changes. `html2pdf.js` captures the DOM tree of the chosen template and exports a high-fidelity PDF.

---

## 📁 Project Structure

```text
ai-resume-builder/
├── frontend/               # Next.js 14 App Router
│   ├── src/
│   │   ├── app/            # Pages (login, signup, build)
│   │   ├── components/     # Reusable UI & Forms (Tailwind)
│   │   ├── contexts/       # React Context (Auth)
│   │   └── lib/            # Axios API utilities
│   ├── .env
│   └── package.json
├── backend/                # Express API
│   ├── middleware/         # JWT Verification & Rate Limiters
│   ├── prisma/             # PostgreSQL Schema & Migrations
│   ├── routes/             # Express Routers (ai, auth, resumes)
│   ├── services/           # Gemini API Logic
│   ├── index.js            # Server Entry Point
│   ├── .env
│   └── package.json
└── package.json            # Root Concurrently Scripts
```

---

**Built with ❤️ to help job seekers land their dream jobs!**
