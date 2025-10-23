// client/src/components/AddTagModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react'; // --- CHANGED: Imported Tag icon ---

/**
 * A modal (pop-up) for adding a new tag.
 *
 * @param {boolean} isOpen - Whether the modal is open or not.
 * @param {function} onClose - Function to call when the modal should close.
 * @param {function} onSave - Function to call with the new tag name.
 */
function AddTagModal({ isOpen, onClose, onSave }) {
  const [tagName, setTagName] = useState('');
  const dialogRef = useRef(null);

  // Sync the <dialog> element's state with the 'isOpen' prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return; // Guard against null reference
    
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    setTagName(''); // Reset form
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tagName.trim()) {
      onSave(tagName.trim());
      handleClose();
    }
  };
  
  // Prevents closing the modal when clicking inside it
  const onDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence >
      {isOpen && (
        <dialog
          ref={dialogRef}
          // --- CHANGED: THIS IS THE MAIN FIX ---
          // We removed 'flex items-center justify-center fixed inset-0 z-50'
          // The browser now handles centering automatically.
          className="p-0 bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm"
          onClick={handleClose} // Close when clicking the backdrop
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onDialogClick}
            // --- CHANGED: Made it look nicer ---
            className="relative w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl"
          >
            {/* --- CHANGED: Improved Header --- */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center p-2 bg-blue-100 rounded-full">
                  <Tag size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add New Tag
                  </h2>
                  <p className="text-sm text-gray-500">
                    Create a tag to organize contacts.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Form --- */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">
                  Tag Name
                </label>
                {/* --- CHANGED: Improved Input Field --- */}
                <input
                  type="text"
                  id="tagName"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g., 'Work' or 'Family'"
                  className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border-0 rounded-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  autoFocus
                />
              </div>

              {/* --- CHANGED: Improved Buttons --- */}
              <div className="flex justify-end pt-2 space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Tag
                </button>
              </div>
            </form>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
}

export default AddTagModal;