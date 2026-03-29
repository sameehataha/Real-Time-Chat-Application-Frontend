#  Talkie - Real-Time Chat Application

![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Socket.io](https://img.shields.io/badge/Socket.IO-4.x-010101)
![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9.x-764abc)
![License](https://img.shields.io/badge/license-MIT-blue)

> A modern, feature-rich real-time chat application enabling seamless communication through direct messages and group chats with file sharing capabilities.

##  Live Demo

**[View Live Application](https://real-time-chat-application-frontend-rho.vercel.app/)**


image 

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Features Explained](#key-features-explained)
- [Socket Events](#socket-events)
- [Redux Store Structure](#redux-store-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)



## 📖 Overview

**Talkie** is a modern, real-time chat application that enables users to communicate seamlessly through direct messages and group chats. Built with **React** and **Socket.IO**, it provides a responsive, feature-rich messaging experience with file sharing capabilities, online presence indicators, and an admin dashboard for system monitoring.



##  Features

###  User Features

| Feature | Description |
|---------|-------------|
|  **Authentication** | Secure JWT-based login/signup with profile management |
|  **Real-Time Messaging** | Instant message delivery using WebSockets |
|  **Group Chats** | Create and manage group conversations |
|  **File Sharing** | Send images, videos, audio files, and documents (up to 5 files) |
|  **Online Status** | Real-time online/offline indicators for contacts |
|  **Typing Indicators** | See when someone is typing |
|  **Notifications** | Friend request and message alerts |
|  **Profile Management** | Custom avatars, bio, and username |
|  **User Search** | Find and add new friends |
|  **Responsive Design** | Mobile-friendly interface |

###  Admin Features

| Feature | Description |
|---------|-------------|
|  **Dashboard** | View system statistics and analytics |
|  **User Management** | Monitor and manage all users |
|  **Chat Management** | View all chats and group conversations |
|  **Message Management** | Monitor all messages and attachments |
|  **Analytics** | Message trends and chat distribution charts |


##  Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Redux Toolkit** | State management |
| **RTK Query** | API data fetching & caching |
| **Socket.IO Client** | Real-time communication |
| **Material UI (MUI)** | Component library |
| **React Router v6** | Navigation |
| **Chart.js** | Data visualization |
| **Moment.js** | Date formatting |
| **React Helmet Async** | SEO & document head management |
| **Framer Motion** | Animations |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Vite** | Build tool & dev server |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |



## 📁 Project Structure
src/ <br>
├── api/ <br>
│   └── api.js                 # RTK Query API definitions <br>
├── components/ <br>
│   ├── auth/ <br>
│   │   └── ProtectRoute.jsx   # Route protection wrapper <br>
│   ├── dialog/ <br>
│   │   ├── AddMember.jsx      # Add members to group <br>
│   │   ├── ConfirmDeleteDialog.jsx <br>
│   │   ├── DeleteChatMenu.jsx <br>
│   │   └── FileMenu.jsx       # File attachment menu <br>
│   ├── layout/ <br> 
│   │   ├── AdminLayout.jsx    # Admin dashboard layout <br>
│   │   ├── AppLayout.jsx      # Main app layout with sidebar  <br>
│   │   ├── Header.jsx         # App header/navigation <br>
│   │   └── Loaders.jsx        # Loading skeletons <br>
│   ├── shared/
│   │   ├── AvatarCard.jsx <br>
│   │   ├── ChatItem.jsx       # Individual chat list item <br>
│   │   ├── MessageComponent.jsx <br>
│   │   ├── RenderAttachments.jsx <br>
│   │   ├── Table.jsx          # Reusable data table  <br>
│   │   ├── Title.jsx          # SEO title component  <br>
│   │   └── UserItem.jsx       # User list item <br>
│   └── styles/ <br>
│       └── StyledComponents.jsx <br>
├── constants/ <br>
│   ├── color.js               # Theme colors <br>
│   ├── config.js              # Environment config <br>
│   ├── events.js              # Socket event constants <br>
│   └── SampleData.js          # Mock data for development <br>
├── hooks/ <br>
│   ├── hook.jsx               # Custom hooks <br>
│   └── UseAdminFetch.jsx      # Admin data fetching hook <br>
├── lib/ <br>
│   └── features.js            # Utility functions <br>
├── pages/ <br>
│   ├── Admin/  <br>
│   │   ├── AdminLogin.jsx <br>
│   │   ├── ChatManagement.jsx <br>
│   │   ├── Dashboard.jsx <br>
│   │   ├── MessageManagement.jsx <br>
│   │   └── UserManagement.jsx <br>
│   ├── Chat.jsx               # Main chat interface <br>
│   ├── Groups.jsx             # Group management <br>
│   ├── Home.jsx <br>
│   ├── Login.jsx <br>
│   └── Notfound.jsx <br>
├── redux/ <br>
│   ├── reducers/ <br>
│   │   ├── auth-reducer.js <br>
│   │   ├── chat-reducer.js <br>
│   │   └── misc-reducer-.js <br>
│   ├── store.js <br>
│   └── thunks/ <br>
│       └── admin.js <br>
├── socket.jsx                 # Socket.IO provider <br>
├── utils/ <br> 
│   └── validators.js <br>
├── App.jsx <br>
└── main.jsx <br>

# Installation
## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running

# Setup Steps
# Clone the repository
git clone https://github.com/sameehataha/Real-Time-Chat-Application-Frontend.git <br>
cd talkie-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
 VITE_SERVER=http://localhost:5000

# Start development server
npm run dev

##  Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SERVER` | Backend API server URL | `http://localhost:5000` |

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔌 Socket Events

### Client Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `JOIN_CHAT` | `chatId` | Join a chat room |
| `LEAVE_CHAT` | `chatId` | Leave a chat room |
| `NEW_MESSAGE` | `{ chatId, message, members }` | Send new message |
| `START_TYPING` | `{ chatId }` | User started typing |
| `STOP_TYPING` | `{ chatId }` | User stopped typing |
| `CHAT_JOINED` | `{ userId, members }` | Notify online status |
| `CHAT_LEAVE` | `{ userId, members }` | Notify offline status |

### Client Listens

| Event | Payload | Description |
|-------|---------|-------------|
| `NEW_MESSAGE` | `message` | New message received |
| `NEW_ATTACHMENTS` | `message` | New attachment received |
| `ALERT` | `content` | System alert message |
| `START_TYPING` | `{ chatId }` | Someone started typing |
| `STOP_TYPING` | `{ chatId }` | Someone stopped typing |
| `NEW_MESSAGE_ALERT` | `{ chatId }` | New message notification |
| `NEW_REQUEST` | `-` | New friend request |
| `REFECTCH_CHATS` | `-` | Refresh chat list |
| `ONLINE_USERS` | `string[]` | List of online user IDs |

# 🗃️ Redux Store Structure
```
{
  auth: {
    user: User | null,
    isAdmin: boolean,
    loader: boolean,
    adminLoader: boolean
  },
  chat: {
    notificationCount: number,
    newMessagesAlert: Array<{ chatId: string, count: number }>
  },
  misc: {
    isNewGroup: boolean,
    isAddMember: boolean,
    isNotification: boolean,
    isMobileMenu: boolean,
    isSearch: boolean,
    isFileMenu: boolean,
    isDeleteMenu: boolean,
    uploadingLoader: boolean,
    selectedDeleteChat: { chatId: string, groupChat: boolean }
  },
  api: { ... }
}
```

## 🔗 API Endpoints (RTK Query)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `chat/my` | GET | Get user's chats |
| `chat/my/groups` | GET | Get user's groups |
| `chat/:chatId` | GET | Get chat details |
| `chat/new` | POST | Create new group |
| `chat/:chatId` | PUT | Rename group |
| `chat/:chatId` | DELETE | Delete chat |
| `chat/leave/:chatId` | DELETE | Leave group |
| `chat/message/:chatId` | GET | Get messages (paginated) |
| `chat/message` | POST | Send attachments |
| `chat/addmembers` | PUT | Add group members |
| `chat/removemembers` | PUT | Remove group members |
| `user/search` | GET | Search users |
| `user/sendrequest` | PUT | Send friend request |
| `user/acceptrequest` | PUT | Accept/decline request |
| `user/notifications` | GET | Get notifications |
| `user/friends` | GET | Get available friends |

## Custom Hooks

| Hook | Description |
|------|-------------|
| `useErrors` | Centralized error handling with toast notifications |
| `useAsyncMutation` | Wrapper for mutations with loading and toast states |
| `useSocketEvents` | Socket.IO event listener management |
| `useAdminFetch` | Admin data fetching with loading/error states |

##  Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `xs` (< 600px) | Mobile layout, drawer navigation |
| `sm` (≥ 600px) | Tablet layout, chat list visible |
| `md` (≥ 900px) | Desktop layout, profile card visible |
| `lg` (≥ 1200px) | Full desktop experience |

#  Contributing
1. Fork the repository

2. Create your feature branch (git checkout -b feature/amazing)

3. Commit your changes (git commit -m 'Add amazing feature')

4. Push to the branch (git push origin feature/amazing)

4. Open a Pull Request
   
# License
This project is licensed under the MIT License.

# Acknowledgments
- Material UI for component library

- Socket.IO for real-time communication

- Redux Toolkit for state management

- Vite for blazing fast builds

# ⭐ Star this repository if you find it useful!
## This README includes:
- Professional header with live demo badge
- Comprehensive feature list
- Tech stack table
- Project structure
- Setup instructions
- API endpoints reference
- Contributing guidelines
- License information
  
# Made with ❤️ using React and Socket.IO
