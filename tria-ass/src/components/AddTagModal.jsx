// client/src/components/AddTagModal.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';

function AddTagModal({ isOpen, onClose, onSave }) {
  const tagRef = useRef('');
  const inputRef = useRef(null);

  // focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // small timeout so animation/backdrop render finishes
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [isOpen]);

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = tagRef.current.value?.trim();
    if (name) {
      onSave(name);
      onClose();
    }
  };

  // stop propagation to avoid closing when clicking inside the modal
  const stop = (e) => e.stopPropagation();

  // If there's no `document` (SSR), render nothing
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          onClick={onClose} // clicking backdrop closes
        >
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black"
            style={{ backdropFilter: 'blur(4px)' }}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={stop}
            className="relative w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl z-[10000]"
            role="document"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center p-2 bg-blue-100 rounded-full">
                  <Tag size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Add New Tag</h2>
                  <p className="text-sm text-gray-500">Create a tag to organize contacts.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">
                  Tag Name
                </label>
                <input
                  id="tagName"
                  ref={(el) => {
                    inputRef.current = el;
                    tagRef.current = el;
                  }}
                  type="text"
                  placeholder="e.g., 'Work' or 'Family'"
                  className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border-0 rounded-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end pt-2 space-x-3">
                <button
                  type="button"
                  onClick={onClose}
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
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default AddTagModal;
