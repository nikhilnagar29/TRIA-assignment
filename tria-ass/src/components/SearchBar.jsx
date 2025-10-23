// client/src/components/SearchBar.jsx

import React, { useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchBar({ searchTerm, onSearchChange, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBack = () => {
    onSearchChange('');
    onClose();
  };

  return (
    <motion.div
      // Simple fade in/out
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // --- THE FIX ---
      // 1. Make it 'absolute'
      // 2. Make it 'h-full'
      // 3. Remove border (it's on the parent now)
      className="absolute top-0 left-0 flex items-center w-full h-full p-4 bg-white"
    >
      {/* --- Back Button --- */}
      <button
        onClick={handleBack}
        className="p-2 mr-2 text-gray-600 rounded-full hover:bg-gray-100"
        aria-label="Close search"
      >
        <ArrowLeft size={22} />
      </button>

      {/* --- Search Input --- */}
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          className="w-full py-2 pl-4 pr-10 text-gray-900 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* --- Clear Button (shows only if there is text) --- */}
        {searchTerm.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onSearchChange('')}
            className="absolute p-1 text-gray-500 transform -translate-y-1/2 rounded-full right-3 top-1/2 hover:bg-gray-200"
            aria-label="Clear search"
          >
            <X size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default SearchBar;