# QuickDesk

**QuickDesk** is an intelligent, lightweight help-desk ticketing system built for rapid support resolution. It supports role-based access (end user, support agent, admin), smart suggestions, upvoting, and visual status tracking with a polished UI.

---

## 🌟 Overview
QuickDesk is a modern, AI-assisted helpdesk ticketing platform designed to streamline support workflows for users, agents, and admins. It provides an intuitive user interface for submitting issues, intelligent suggestions to assist in ticket creation, and role-based dashboards to manage, resolve, and monitor tickets efficiently.

---


## 🎯 Key Goals
- Fast creation and tracking of support tickets.
- Crowd-prioritization via upvotes to surface common issues.
- Smart suggestions to reduce friction in ticket submission.
- Clean, responsive UI with visual status/priority cues.

---

## 🚀 Features

### Core Features
- User authentication with roles: End User, Support Agent, Admin.
- Ticket creation with:
  - Title, description
  - Category selection
  - Priority
  - Attachments (file upload)
  - Tags
- Ticket listing & filtering (status-based).
- Status lifecycle: Open → In Progress → Resolved → Closed.
- Commenting on tickets (threaded).
- Role-aware dashboards (personal vs. global views).

### Uniqueness / Standout Enhancements
- **Auto-category & priority suggestion** via LLM analysis of title/description.
- **Similar issue recommendation** to avoid duplicates.
- **Upvote system** for users to boost visibility of recurring problems.
- **Agent avatar & assignee display** for personalization.
- **Estimated resolution time** based on priority.
- **Color-coded badges** for status and priority for fast scanning.
- **Activity timeline** showing history of changes/comments.
- **Animated microinteractions** (status change feedback, suggestion reveal, upvote interaction).
- **Quick templates / smart tags** to accelerate common ticket creation.

---

### 🧠 UX Flow Summary
- User logs in (end user or agent).
- End user creates a ticket; smart suggestions prefill category/priority/tags.
- Similar resolved tickets are surfaced to avoid duplicates.
- Submitted tickets appear in dashboards; other users can upvote.
- Support agents view tickets in list/kanban, change status, and comment.
- Users get visual feedback via status badges, timeline, and estimated resolution time.

### 🎨 UI/Design Highlights
- Gradient backgrounds for header and call-to-action areas.
- Status & priority clearly distinguishable via color-coded badges.
- Animated feedback for key interactions (status updates, suggestions).
- Compact stats overview plus recent activity feed.
- Personalized touches: greeting, assigned agent avatar, quick action shortcuts.

---

### Tech Stack
| Layer         | Technology              | Description                               |
|--------------|--------------------------|-------------------------------------------|
| Frontend     | React.js, Tailwind CSS   | UI library and styling                    |
| UI Components| shadcn/ui, Lucide-react  | Accessible components and icons           |
| Forms & Date | React Hook Form, date-fns| Form handling and date formatting         |
| AI Features  | InvokeLLM / OpenAI API   | Smart suggestions for tickets             |
| Backend      | Node.js + Express        | REST API and business logic               |
| Database     |  PostgreSQL              | Ticket, user, and comment storage         |
| File Upload  | Cloudinary / AWS S3      | Attachment handling                       |
| Auth | JWT / Firebase Auth     | User authentication & session management |

---

## 📦 Getting Started

### Prerequisites
- Node.js (>=16)
- npm or yarn

### Installation

bash
# clone repo
git clone <your-repo-url>
cd quickdesk

# install dependencies
npm install

# if backend is separate, navigate to backend folder and install too
cd backend
npm install

---

🧪 API Endpoints (reference)
Authentication
GET /api/me → current user info
POST /api/login → login user
POST /api/register → create user

---

## 🔧 Scripts
bash
Copy
Edit
# start backend
node backend/server.js

# start frontend (if using Vite/React)
npm run dev
