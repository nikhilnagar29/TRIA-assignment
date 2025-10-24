# Tria - Frontend Assignment (Contact List)

This is a high-performance React contact management application built for the Tria frontend assignment using Vite. It interacts with a provided Node.js API to efficiently manage and display contact data.

The application is designed to be robust, scalable, and professional, capable of handling 5,000+ contacts smoothly through techniques like API-driven pagination/search and UI list virtualization.

### 🔗 Live Demo

**[https://tria-assignment-lilac.vercel.app/](https://tria-assignment-lilac.vercel.app/)**

*(**Note:** The free backend hosting service may take 30-60 seconds to "wake up" on the first visit if it hasn't been accessed recently.)*

---

## ✨ Features

This project implements all core requirements and adds several notable features:

* **High-Performance List (5,000+ Items):**
    * Efficiently handles large datasets by consuming API features like **server-side pagination** (implemented with infinite scrolling).
    * Features **debounced server-side search**, ensuring the UI remains responsive even during searches on large lists.
    * Utilizes **List Virtualization** (`@tanstack/react-virtual`) to render only the visible contact rows, maintaining a high frame rate and smooth scrolling.
* **Full CRUD Operations:**
    * **Create:** Add new contacts via a polished modal interface.
    * **Read:** View all contacts and display expanded details in a sliding panel.
    * **Update:** Toggle contacts as "Favorite" and manage assigned tags.
    * **Delete:** Remove contacts with a user-friendly **"Undo"** option provided via toast notifications (`react-hot-toast`).
* **Tag Management System:**
    * Create custom tags (e.g., "Family", "Work") via a dedicated modal.
    * Filter the contact list dynamically by any tag, including default "All" and "Favourite" options.
    * Assign or unassign multiple tags to contacts within the expanded view.
* **Polished UI/UX:**
    * Incorporates smooth animations using `framer-motion` for modals, the expanded contact panel, and header transitions.
    * Provides comprehensive state handling: includes **skeleton loaders** during data fetching, informative **empty states** for no results or errors, and basic form validation.
    * Features a fully **responsive design**, adapting cleanly to both mobile and desktop viewports.

---

## 🛠 Tech Stack & Libraries Used

This section outlines the main frontend technologies used and the rationale behind their selection:

* **React (with Vite):** The required framework for the assignment. State management is handled primarily through `useReducer` within a custom hook (`useContacts.jsx`) to centralize logic for fetching, filtering, and optimistic updates.
* **Tailwind CSS:** A utility-first CSS framework chosen for its ability to rapidly build a clean, modern, and responsive UI without writing extensive custom CSS.
* **`@tanstack/react-virtual`:** Implements list virtualization. Selected to guarantee high performance and a smooth user experience when displaying potentially thousands of contacts.
* **`framer-motion`:** Used for all UI animations (modals, panels, header transitions). Chosen for its simple and declarative API that enables fluid and professional-looking animations.
* **`axios`:** Handles API requests. Preferred for its widespread adoption, ease of use, and features like interceptors and robust error handling.
* **`react-hot-toast`:** Provides notifications. Specifically chosen for its flexibility in creating custom toast components, enabling the "Undo Delete" functionality.
* **`lucide-react`:** Supplies icons. Selected for its lightweight nature, tree-shakability, and clean icon design.

---

## 🚀 Setup and Running Locally

Follow these instructions to run the React frontend application on your local machine:

#### Prerequisites

* Node.js (v18 or later recommended)
* npm (usually comes with Node.js)

#### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/nikhilnagar29/tria-assignment.git](https://github.com/nikhilnagar29/tria-assignment.git)
    cd tria-assignment/tria-ass
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `tria-ass` directory (the same level as `package.json`). Add the following line, pointing to the backend API:
    ```env
    VITE_API_URL=[https://tria-assignment.onrender.com/api](https://tria-assignment.onrender.com/api)
    ```
    *(This is the default backend URL used for the deployed version)*

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:5173`.

---

## 📝 Assumptions & Design Choices

* **API Interaction:** The frontend assumes the presence of the specific API endpoints defined in `src/api/contactApi.js`. All data fetching, searching, and filtering logic relies on this API structure.
* **State Management:** `useReducer` combined with a custom hook (`useContacts.jsx`) was chosen over context or external libraries (like Redux/Zustand) for managing the contact-related state. This approach keeps the state logic co-located and avoids unnecessary prop drilling without adding external dependencies for this specific scope.
* **Performance:** List virtualization (`@tanstack/react-virtual`) was implemented proactively to ensure the application scales well even with the requirement of handling 5,000+ contacts. Server-side pagination and search were leveraged via the API for the same reason.
* **UI/UX:**
    * **Optimistic Updates:** CRUD actions (add, delete, update favorite/tags) update the UI immediately before waiting for the API response to provide a faster perceived performance. Error handling reverts these changes if the API call fails.
    * **Debouncing:** Search input is debounced (`useDebounce.js`) to prevent excessive API calls while the user is typing.
    * **Modals & Panels:** Modals (`AddContactModal`, `AddTagModal`) and the `ExpandedContact` panel are implemented using React Portals and `framer-motion` for smooth transitions and consistent layering.

---