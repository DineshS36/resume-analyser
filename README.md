# 🤖 AI-Powered Resume Builder

A modern web application that leverages Large Language Models (LLM) to help job seekers create professional, ATS-friendly resumes with AI-enhanced content.

## ✨ Features

### Core Functionality
- **🎯 AI Content Enhancement**: Transform basic job descriptions into compelling, metric-driven bullet points
- **📝 Smart Summary Generator**: Create tailored professional summaries based on experience and target role
- **👁️ Real-Time Preview**: Live split-screen view showing resume as it's being built
- **📄 PDF Export**: Download resumes as clean, professionally formatted PDFs
- **🎨 Multiple Templates**: Choose from Classic, Modern, and Minimal ATS-friendly layouts

### User Experience
- **Step-by-Step Builder**: Intuitive multi-step form for data entry
- **AI Suggestions**: Accept, reject, or manually edit AI-generated content
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progress Tracking**: Visual progress indicator through the resume building process

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React Framework)
- Tailwind CSS (Styling)
- html2pdf.js (PDF Generation)
- Axios (API Client)

**Backend:**
- Node.js + Express
- Google Gemini AI API
- Prisma ORM
- PostgreSQL Database

**AI Integration:**
- Gemini Pro model for content generation
- Custom system prompts for resume writing
- JSON-structured responses for bullet points

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ai-resume-builder
```

2. **Install all dependencies:**
```bash
npm run install:all
```

3. **Set up environment variables:**

Create `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_resume_builder?schema=public"
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Set up the database:**
```bash
npm run db:migrate
npm run db:generate
```

5. **Start the development servers:**
```bash
npm run dev
```

This will start both the backend server (port 5001) and frontend client (port 3000).

## 📚 API Documentation

### AI Endpoints

#### POST `/api/generate-bullet`
Transform raw job descriptions into professional bullet points.

**Request:**
```json
{
  "rawInput": "I fixed bugs and worked on features",
  "targetJobTitle": "Senior Software Engineer"
}
```

**Response:**
```json
{
  "success": true,
  "bullets": [
    "Resolved 50+ critical software bugs, improving system uptime by 15%",
    "Developed and deployed 8 new features that increased user engagement by 25%",
    "Collaborated with cross-functional teams to deliver projects 20% ahead of schedule"
  ]
}
```

#### POST `/api/generate-summary`
Generate a professional summary based on user data.

**Request:**
```json
{
  "experiences": [...],
  "skills": ["React", "Node.js", "Python"],
  "targetJobTitle": "Full Stack Developer"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Results-driven Full Stack Developer with 5+ years of experience..."
}
```

### Resume CRUD Endpoints

- `GET /api/resumes?userId={id}` - Get all resumes for a user
- `GET /api/resumes/:id` - Get single resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Experience Endpoints

- `POST /api/resumes/:id/experiences` - Add experience
- `PUT /api/resumes/:id/experiences/:expId` - Update experience
- `DELETE /api/resumes/:id/experiences/:expId` - Delete experience

### Education Endpoints

- `POST /api/resumes/:id/educations` - Add education
- `DELETE /api/resumes/:id/educations/:eduId` - Delete education

### Skills Endpoints

- `POST /api/resumes/:id/skills` - Add skill
- `DELETE /api/resumes/:id/skills/:skillId` - Delete skill

## 🎨 Templates

### Classic
Traditional, professional layout with:
- Centered header with contact information
- Clear section dividers
- Serif typography
- ATS-optimized formatting

### Modern
Contemporary design featuring:
- Color accent header
- Visual timeline for experience
- Sans-serif typography
- Modern card-based layout

### Minimal
Clean, elegant design with:
- Generous whitespace
- Light typography
- Subtle styling
- Focus on content

## 🤖 AI Prompting Strategy

### Bullet Point Generation
System Prompt:
```
You are an expert executive resume writer. Your goal is to take the user's 
raw job description and rewrite it into three distinct, highly professional 
bullet points. Use strong action verbs, emphasize quantifiable metrics, 
and ensure the tone is objective and ATS-friendly. Do not use buzzwords. 
Return only the three bullet points in a JSON array.
```

### Summary Generation
System Prompt:
```
You are an expert executive resume writer. Create a compelling 3-4 sentence 
professional summary based on the user's experience, skills, and target 
job title. Focus on key achievements, years of experience, and core 
competencies. Make it ATS-friendly with relevant keywords.
```

## 📁 Project Structure

```
ai-resume-builder/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   └── lib/           # API utilities
│   ├── package.json
│   └── tailwind.config.js
├── backend/                # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── prisma/            # Database schema
│   ├── index.js           # Server entry
│   └── package.json
├── package.json           # Root workspace config
└── README.md
```

## 🛠️ Development Scripts

- `npm run install:all` - Install dependencies for all packages
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔒 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `CORS_ORIGINS` | Allowed CORS origins | No |

### Frontend (.env.local)
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## 📝 User Flow

1. **Landing Page** → User clicks "Build Your Resume"
2. **Personal Info** → Enter contact details and target job title
3. **Experience** → Add work history with AI enhancement
4. **Education** → Add academic background
5. **Skills** → Add technical and soft skills
6. **Preview** → Select template and review final resume
7. **Export** → Download as PDF

## 🎯 Key Features Explained

### AI Enhancement Workflow
1. User enters raw job description
2. Clicks "Enhance with AI" button
3. Backend sends prompt to Gemini API
4. AI returns 3 optimized bullet points
5. User reviews and accepts/rejects each suggestion
6. Accepted bullets added to resume

### Real-Time Preview
- Live updates as user types
- Three template options
- Responsive layout preview
- Print-ready formatting

### PDF Generation
- Client-side generation using html2pdf.js
- A4 format output
- High-quality rendering
- Template-specific styling preserved

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Google Gemini AI for powering the content enhancement
- Tailwind CSS for the beautiful styling
- Next.js team for the excellent React framework
- Prisma for the type-safe database client

---

**Built with ❤️ to help job seekers land their dream jobs!**

