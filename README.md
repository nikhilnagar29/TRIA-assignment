# Tria - Frontend Assignment (Contact List)

This is a full-stack, high-performance contact management application built for the Tria frontend assignment. It features a React (Vite) frontend and a Node.js (Express) backend.

The application is designed to be robust, scalable, and professional, handling 5,000+ contacts with server-side pagination/search and client-side virtualization.

### 🔗 Live Demo

**[https://tria-assignment-lilac.vercel.app/](https://tria-assignment-lilac.vercel.app/)**

*(Note: The free Render backend may take 30-60 seconds to "wake up" on the first load.)*

---

### ✨ Features

[cite_start]This project implements all core requirements  and adds several "standout" features to demonstrate product sense and technical skill:

* **Full-Stack Architecture:** A separate Node.js API handles all business logic and serves data.
* **High-Performance List (5,000+ Items):**
    * **Server-Side Pagination:** The app only fetches contacts as you scroll (infinite scrolling).
    * **Server-Side Search:** Search is debounced and executed on the server, keeping the UI fast.
    * **List Virtualization:** Uses `@tanstack/react-virtual` to render *only* the visible rows, maintaining a high frame rate.
* **Full CRUD Operations:**
    * [cite_start]**Create:** Add new contacts via a polished modal[cite: 7].
    * [cite_start]**Read:** View all contacts [cite: 5] and expanded contact details.
    * **Update:** Toggle contacts as "Favorite" and manage tags.
    * **Delete:** Delete contacts with an **"Undo"** option via `react-hot-toast`.
* **Tag Management System:**
    * Create custom tags (e.g., "Family", "Work").
    * Filter the contact list by any tag, including "All" and "Favourite".
    * Assign or unassign multiple tags to any contact.
* **Polished UI/UX:**
    * Smooth animations with `framer-motion` for modals, panels, and header transitions.
    * **Full State Handling:** Includes skeleton loaders (for loading), empty states (for no results or errors), and clear validation.
    * Fully responsive design for mobile and desktop.

---

### 🛠 Tech Stack & Libraries Used

[cite_start]This section outlines the main technologies used and *why* they were chosen, as requested in the assignment[cite: 24].

#### Client (Frontend)

* [cite_start]**React (with Vite):** Required by the assignment[cite: 12]. `useReducer` and custom hooks (`useContacts.js`) are used to centralize and manage complex state.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building a clean, modern, and responsive UI.
* **`@tanstack/react-virtual`:** A powerful "headless" virtualization library. This was chosen to ensure the UI remains fast and responsive, even with thousands of contacts.
* **`framer-motion`:** Used for all animations. It provides a simple and declarative API to create fluid, professional-grade UI transitions.
* **`axios`:** For robust, clean, and standardized API requests to the backend.
* **`react-hot-toast`:** Used for all notifications, especially the critical "Undo Delete" feature.
* **`lucide-react`:** A lightweight and clean icon library.

#### Server (Backend)

* **Node.js & Express:** Used to create a scalable, fast, and familiar API backend.
* **`@faker-js/faker`:** To generate a realistic mock dataset of 5,000 contacts.
* **`cors`:** To handle cross-origin requests from the React client.

---

### 🚀 Setup and Running Locally

[cite_start]Follow these instructions to run the project on your local machine[cite: 22].

#### Prerequisites

* Node.js (v18 or later)
* npm

#### 1. Server (Backend)

First, set up and run the Node.js server.

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Start the server
npm start
