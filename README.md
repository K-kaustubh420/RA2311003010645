# Campus Notifications System

A simple frontend application built with Next.js that connects to an evaluation service to display campus notifications with authentication, filtering, and logging.

---

## Features

- User authentication using client credentials  
- Fetch and display notifications  
- Filter by type (Event, Result, Placement)  
- Pagination support  
- Highlight top priority notifications  
- Background logging of user actions  
- Responsive design (mobile + desktop)  

---

## Tech Stack

- Next.js (Frontend)
- TypeScript
- REST APIs
- CSS (Grid + Flexbox)

---

## Getting Started

### 1. Install dependencies
note-make sure u re in the notification_app_fe folder for running next js related part
npm install

### 2. Run the app
npm run dev

### 3. Open in browser
http://localhost:3000

---

## How it Works

1. User logs in using client ID and secret  
2. Token is stored in localStorage  
3. Notifications are fetched using the token  
4. User can filter and paginate results  
5. Important actions are logged to the backend  

---

## API Endpoints Used

- POST /evaluation-service/register  
- POST /evaluation-service/auth  
- GET /evaluation-service/notifications  
- POST /evaluation-service/logs  

---

## Notes

- No secrets are stored in the code  
- Logging failures do not affect UI  
- Built with clean and modular structure  

---

## Version

v1.0 – Initial implementation
