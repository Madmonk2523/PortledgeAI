# PortledgeAI v1 - School Information Assistant

## 🎯 Target Audience (Priority Order)
1. **Teachers & Staff** - Quick access to school information
2. **Parents** - Information about their child's school environment  
3. **Students** - Specific factual queries about classes, clubs, schedules

## Overview
PortledgeAI v1 is a **professional information assistant** for the Portledge School community. It provides fast, accurate answers about teachers, schedules, facilities, clubs, events, and school policies using a local knowledge base—no Blackbaud dependency.

---

## ✨ Key Features

### 1. School Information Lookup
Answer common questions instantly:
- "Who teaches AP Biology?"
- "What day is it in the rotation?"
- "Where is room 302?"
- "When is the next parent-teacher conference?"
- "What clubs meet on Tuesdays?"

### 2. Faculty & Staff Directory
- Complete teacher listings with subjects, rooms, emails
- Office hours and contact information
- Department information

### 3. Schedule & Calendar
- 6-day rotation calendar (A-F Days)
- Bell schedules (regular & early dismissal)
- Upcoming school events
- Academic calendar dates

### 4. Facilities Information
- Building and room locations
- Facility features and capacities
- Campus navigation help

### 5. Clubs & Activities
- Complete club directory
- Meeting times and locations
- Advisor contact information

### 6. School Policies
- Student handbook reference
- Attendance policies
- Dress code guidelines
- Academic integrity rules

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React + TailwindCSS |
| Backend | Node.js + Express |
| AI Engine | OpenAI GPT-4 |
| Data Storage | Local JSON + ICS files |
| Database | Firebase (auth & user data) |
| Calendar | ical.js parser |
| Hosting | Vercel (frontend) + Railway (backend) |

---

## 📁 Project Structure

```
PortledgeAI/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── chat.js           # AI chat endpoints
│   │   ├── knowledge.js      # School data queries
│   │   └── user.js           # User preferences
│   ├── services/
│   │   ├── aiService.js      # OpenAI integration
│   │   ├── knowledgeService.js  # Data parsing
│   │   └── userService.js    # User management
│   └── utils/
├── data/
│   └── portledge/
│       ├── teachers.json     # Faculty directory
│       ├── schedule.json     # Rotation calendar
│       ├── rooms.json        # Building/room data
│       ├── calendar.ics      # School events
│       ├── handbook.md       # Policy summary
│       └── clubs.json        # Activities directory
└── frontend/
    ├── public/
    └── src/
        ├── components/       # React components
        ├── services/         # API clients
        ├── styles/           # Tailwind styles
        └── utils/            # Helper functions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key
- Firebase project (optional for v1)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Firebase (optional for v1)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Development
SKIP_AUTH=true
```

4. **Start the server:**
```bash
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend Setup (Coming Next)

Frontend will be built with React + Tailwind for a clean, professional interface.

---

## 📡 API Endpoints

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get conversation history
- `DELETE /api/chat/history` - Clear history

### Knowledge Base
- `GET /api/knowledge/teachers` - List all teachers
- `GET /api/knowledge/schedule` - Get schedule info
- `GET /api/knowledge/current-day` - Get rotation day
- `GET /api/knowledge/clubs` - List clubs
- `GET /api/knowledge/events` - Upcoming events
- `GET /api/knowledge/handbook` - Policy information
- `GET /api/knowledge/rooms` - Facility info

### User (Authenticated)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/schedule` - Get saved schedule
- `POST /api/user/schedule` - Save schedule

---

## 💬 Chat Modes

### Quick Mode (Default)
Fast, factual answers for specific questions.

**Example:**
- User: "What room is Chemistry in?"
- AI: "Chemistry is in Science Lab 103 in the Academic Center, taught by Ms. Amanda Foster."

### Info Mode
Detailed information with context and references.

**Example:**
- User: "Tell me about the Robotics Club"
- AI: "The Robotics Team is advised by Mr. David Kim and meets Tuesday/Thursday 3:30-5:00 PM in Robotics Lab 403..."

### Guide Mode
Navigate school procedures and resources.

**Example:**
- User: "How do I find my child's teacher's office hours?"
- AI: "Each teacher lists their office hours in the directory. For example, to contact Ms. Walsh (English), her office hours are..."

---

## 🎨 Design Philosophy

### Professional & Efficient
- Clean, modern interface
- Fast information retrieval
- Mobile-responsive design
- Portledge Blue color scheme

### User-Focused
- Teachers: Quick lookups during busy days
- Parents: Easy access to school info
- Students: Factual answers to "where/when/who" questions

### Privacy-First
- No personal student data shared
- Local knowledge base only
- Secure authentication
- No external data sharing

---

## 🔐 Security

- Firebase Authentication
- JWT token verification
- Rate limiting (100 req/15min)
- Helmet.js security headers
- CORS protection
- Input validation

---

## 📊 Knowledge Base

All data is stored locally in `/data/portledge/`:

- **10 Teachers** with subjects, rooms, contact info
- **6-Day Rotation** schedule with bell times
- **10+ Clubs** with meeting times
- **School Calendar** with events and breaks
- **Handbook Summary** with key policies
- **Building/Room Directory** with locations

**Easy to Update:** Simply edit JSON/ICS files—no database needed!

---

## 🎯 Future Enhancements (v2+)

- Real-time calendar sync
- Multi-language support
- Parent portal integration
- SMS notifications
- Mobile app (iOS/Android)
- Advanced analytics dashboard
- Blackbaud integration (if needed)

---

## 📝 Environment Variables

Create `.env` in backend directory:

```env
# Required
OPENAI_API_KEY=sk-...

# Optional (defaults shown)
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_MODEL=gpt-4-turbo-preview
SKIP_AUTH=true
```

---

## 🤝 Contributing

This is a school project. To update information:

1. Edit files in `/data/portledge/`
2. Restart the backend server
3. Changes take effect immediately

---

## 📞 Support

For questions about PortledgeAI:
- Technical issues: Check logs in terminal
- Content updates: Edit JSON files in `/data/portledge/`
- Feature requests: Document in project notes

---

## 📜 License

MIT License - Portledge School 2025

---

**PortledgeAI v1** - Built with 💙 for the Portledge Community
