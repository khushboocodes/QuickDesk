# QuickDesk

**QuickDesk** is an intelligent, lightweight help-desk ticketing system built for rapid support resolution. It supports role-based access (end user, support agent, admin), smart suggestions, upvoting, and visual status tracking with a polished UI.

---

## 🌟 Overview
QuickDesk is a modern, AI-assisted helpdesk ticketing platform designed to streamline support workflows for users, agents, and admins. It provides an intuitive user interface for submitting issues, intelligent suggestions to assist in ticket creation, and role-based dashboards to manage, resolve, and monitor tickets efficiently.

---


## Team Details

-Team Leader Name : Khushboo Khator
-Email: khushboocodes@gmail.com


-Team Member 1
-Name: Anuj Sharma
-Email: anujsharrmmaa@gamil.com

-Team Member 2
-Name: Rohit Prajapati
-Email: rrohit9111@gmail.com

Team Member 3
-Name: tanushka tomar
-Email: tanushkat2005@gmail.com



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

📦 Getting Started

Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
📦 Getting Started

Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
# Clone the repository
git clone <your-repo-url>
cd quickdesk

# Install frontend dependencies
npm install

# If backend is in a separate folder
cd backend
npm install

🧪 API Endpoints (Reference)
🚪 Authentication

Method	Endpoint	Description
GET	/api/me	Get current user info
POST	/api/login	Login user
POST	/api/register	Register new user

🔧 Scripts
# Start backend server
cd backend
node server.js

# Start frontend (React + Vite)
cd ../
npm run dev
