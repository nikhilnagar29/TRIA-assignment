// client/src/components/AddTagModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
    <AnimatePresence>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="p-0 bg-transparent backdrop:bg-black/50"
          onClick={handleClose} // Close when clicking the backdrop
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onDialogClick}
            className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-xl"
          >
            {/* --- Header --- */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Tag
              </h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Form --- */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">
                  Tag Name
                </label>
                <input
                  type="text"
                  id="tagName"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              {/* --- Buttons --- */}
              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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