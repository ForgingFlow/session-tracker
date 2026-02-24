# Session Tracker — Project Brief

Build a simple web app for tracking movement coaching clients and their session progress.

## Tech Stack

- **React** with Vite for fast dev server
- **Tailwind CSS** for styling
- **localStorage** for data persistence (no backend needed)

## Features to Build (in order)

### 1. Project Setup
- Initialize a Vite + React project
- Install and configure Tailwind CSS
- Create a clean dark-themed layout

### 2. Client List
- Display a list of clients with:
  - Name
  - Program name (e.g. "12-Week Foundation", "Movement Fundamentals")
  - Sessions completed out of total (e.g. "8/12")
  - A visual progress indicator (progress bar or ring)
  - Days since last session
- Start with 3 sample clients hardcoded

### 3. Add New Client
- A form to add a client with:
  - Name (text input, required)
  - Program (dropdown: "12-Week Foundation", "Movement Fundamentals", "Custom Program", "Single Session")
  - Total sessions (number input)
- Form should auto-focus the name field
- Add to the list on submit

### 4. Log a Session
- Each active client card has a "+ Session" button
- Clicking it increments their completed count by 1
- Updates "last session" date to today
- Button disappears when program is complete

### 5. Delete a Client
- Each card has a delete button
- Removes the client from the list

### 6. Filter Clients
- Toggle buttons: All / Active / Complete
- "Active" = sessions remaining
- "Complete" = all sessions done

### 7. Stats Bar
- Show at the top:
  - Total clients
  - Active clients
  - Sessions logged this week

### 8. Persist Data
- Save client list to localStorage
- Load from localStorage on app start
- Fall back to sample data if nothing saved

## Design Notes

- Dark theme (dark gray/black background, light text)
- Accent color: emerald/green for primary actions
- Clean, minimal UI — no clutter
- Mobile-friendly (single column on small screens)

## File Structure Target

```
session-tracker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── components/
│       ├── ClientCard.jsx
│       ├── AddClientForm.jsx
│       ├── FilterBar.jsx
│       └── StatsBar.jsx
```

## How to Build This

Work through each numbered feature above one at a time. After each step:
1. Make sure it works
2. Show me what you built
3. Ask before moving to the next step

Start with Step 1 (project setup) and get the dev server running.
