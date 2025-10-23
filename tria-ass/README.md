# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


client/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── contactApi.js         <-- For all Axios/fetch calls
│   ├── assets/                 <-- For any static images (e.g., logo)
│   ├── components/
│   │   ├── AddContactModal.js    <-- Pop-up form
│   │   ├── Avatar.js             <-- Shows image or "JB"
│   │   ├── ContactCard.js        <-- Each row in the list
│   │   ├── ContactList.js        <-- The virtualized list component
│   │   ├── EmptyState.js         <-- "No contacts found"
│   │   ├── ExpandedContact.js    <-- Details, favorite, delete
│   │   ├── Header.js             <-- Title, Add button
│   │   ├── SearchBar.js          <-- The debounced search input
│   │   └── SkeletonLoader.js     <-- Loading state
│   ├── hooks/
│   │   ├── useContacts.js        <-- *ALL* logic (fetch, search, add, delete)
│   │   └── useDebounce.js        <-- Debounce logic
│   ├── App.js                    <-- Main layout component
│   ├── index.css                 <-- Tailwind imports
│   └── index.js                  <-- React entry point
├── tailwind.config.js          <-- Tailwind config
├── postcss.config.js           <-- Tailwind config
├── package.json
└── package-lock.json