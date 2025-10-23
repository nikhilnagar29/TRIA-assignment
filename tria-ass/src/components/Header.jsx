// client/src/components/Header.jsx

import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

function Header({ onSearchClick, onAddClick }) {
  return (
    <motion.header
      // Simple fade in/out
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // --- THE FIX ---
      // 1. Make it 'absolute' to fit the parent
      // 2. Make it 'h-full' to fill the h-16 container
      // 3. Remove border (it's on the parent now)
      className="absolute top-0 left-0 flex items-center justify-between w-full h-full p-4 bg-white"
    >
      {/* --- Title --- */}
      <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>

      {/* --- Action Icons --- */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSearchClick}
          className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="Search contacts"
        >
          <Search size={22} />
        </button>
        <button
          onClick={onAddClick}
          className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
          aria-label="Add new contact"
        >
          <UserPlus size={22} />
        </button>
      </div>
    </motion.header>
  );
}

export default Header;