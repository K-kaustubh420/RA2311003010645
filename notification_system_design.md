# Campus Notifications System – Design Notes

---

## System Architecture

### How everything flows (high level)

The application is a Next.js frontend connected to a hosted evaluation service. The frontend handles the UI and token management, while authentication, notifications, and logging are handled by the backend service.

Key parts of the system:
- Registration and authentication flow
- Notifications dashboard
- Background logging system

Frontend runs on:
http://localhost:3000

Backend service:
http://20.207.122.201

All communication with the backend is done using a bearer token after authentication.

---

### What happens when a user opens the app

1. User opens the application  
2. The app checks for a saved token in localStorage  
3. If no token is found → show registration/auth form  
4. User enters credentials  
5. Request is sent to `/api/auth` (Next.js route)  
6. That request is forwarded to `/evaluation-service/auth`  
7. Token is returned and stored in context + localStorage  
8. Notifications are fetched and displayed  
9. All actions are logged in the background  

---

## Feature Implementation

### 1. Authentication Flow

#### Step 1: Register (one-time)

POST /evaluation-service/register

Body:
clientId, clientSecret

Response:
clientId, clientSecret (store securely)

---

#### Step 2: Authenticate (per session)

POST /evaluation-service/auth

Response:
{ token: "..." }

---

#### Token storage

- Stored in React context (runtime usage)  
- Stored in localStorage (session persistence)  
- Sent with every request:

Authorization: Bearer <token>

---

### 2. Notifications API

#### Fetch notifications

GET /evaluation-service/notifications

Query parameters:
- limit → number of items per page  
- page → page number  
- notification_type → optional filter  

---

#### Notification structure

```ts
{
  id: string;
  title: string;
  message: string;
  notification_type: "Event" | "Result" | "Placement";
  priority?: number;
  timestamp: string;
}
````

---

### 3. Priority Logic

Steps:

1. Take all notifications
2. Sort by priority (descending)
3. Select top 5
4. Display them separately as “Top Priority”

```ts
function getPriorityNotifications(notifications, limit = 5) {
  return notifications
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, limit);
}
```

---

### 4. Filters & Pagination

#### Filters

Options:

* All
* Event
* Result
* Placement

On filter change:

* Reset page to 1
* Fetch new data
* Update UI

---

#### Pagination

* Shows current page
* Previous button disabled on page 1
* Next button always enabled

Each page change is logged.

---

### 5. Responsive Design

#### Desktop

* 3-column grid layout
* Centered pagination
* Clean spacing

#### Mobile

* Single-column layout
* Stacked buttons
* Touch-friendly spacing

---

#### CSS approach

* CSS Grid for layout
* Flexbox for controls
* No heavy frameworks used

---

## Logging Strategy

### Logger location

logging_middleware/logger.ts

---

### Function signature

```ts
Log(token, stack, level, package, message)
```

---

### Allowed values

* stack → "frontend"
* level → debug | info | warn | error | fatal
* package → api, component, hook, page, state, etc.
* message → free text

---

### Logging points

* Page load
* API success
* API failure
* Filter changes
* Pagination

Example:

```ts
Log(token, "frontend", "info", "page", "Loading notifications")
```

---

### Logging endpoint

POST [http://20.207.122.201/evaluation-service/logs](http://20.207.122.201/evaluation-service/logs)

Headers:
Authorization: Bearer <token>
Content-Type: application/json

---

### Behavior

* Wrapped in try-catch
* Never interrupts UI
* Fails silently

---

## Error Handling

| Scenario        | Handling                |
| --------------- | ----------------------- |
| Auth failure    | Show error, allow retry |
| Network issue   | Show error, allow retry |
| Invalid token   | Clear token, redirect   |
| API failure     | Show message            |
| Logging failure | Ignore silently         |

---

### UX approach

* No popups
* Inline error messages
* Minimal and clean

---

## Performance Considerations

### Load performance

* Next.js code splitting
* Minimal dependencies
* No CSS frameworks

---

### API efficiency

* Pagination reduces load
* Filtering handled server-side

---

### Logging performance

* Asynchronous
* Does not block UI

---

### Bundle size

* Lightweight setup
* Only required modules included

---

### Expected metrics

* FCP < 2 seconds
* LCP < 3 seconds
* Logging overhead negligible

---

## File Structure

```
notification_app_fe/
  app/
  lib/
  public/

logging_middleware/
  logger.ts
  config.ts
  types.ts
```

---

## Testing & Deployment

### Run locally

```bash
npm install
npm run dev
```


### Security

* No hardcoded secrets
* Token-based authentication
* Safe storage practices

---

### Code quality

* TypeScript strict mode
* Modular structure
* No console.log usage

---

### Repository hygiene

* Proper .gitignore
* Clean commits
* Organized structure

---

## Version

| Version | Date       | Notes         |
| ------- | ---------- | ------------- |
| 1.0     | 2026-05-02 | Initial build |
