import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Avatar from './Avatar.jsx';

/**
 * A modal (pop-up) component for adding a new contact.
 * It is controlled by the 'isOpen' prop.
 *
 * @param {boolean} isOpen - Whether the modal is open or not.
 * @param {function} onClose - Function to call when the modal should close.
 * @param {function} onSave - Function to call with new contact data.
 */
function AddContactModal({ isOpen, onClose, onSave }) {
  // --- State for the form ---
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);

  // --- Modal <dialog> element ---
  const dialogRef = useRef(null);

  // Sync the <dialog> element's state with the 'isOpen' prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return; // Guard against null reference
    
    if (isOpen) {
      dialog.showModal(); // Built-in browser function to open dialog
    } else {
      dialog.close(); // Built-in browser function to close dialog
    }
  }, [isOpen]);

  // --- Functions ---
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple Validation
    if (!name || !phone) {
      setError('Name and Phone are required.');
      return;
    }

    // Call the onSave function from useContacts hook
    onSave({ name, phone, email, imageUrl });
    
    // Close and reset the form
    handleClose();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setImageUrl('');
    setError(null);
  };
  
  // This prevents the dialog from closing when clicking inside it
  const onDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    // AnimatePresence is needed for exit animations
    <AnimatePresence>
      {isOpen && (
        <dialog
          ref={dialogRef}
          // 'backdrop::' is a pseudo-element for the <dialog> background
          className="p-0 bg-transparent backdrop:bg-black/50"
          onClick={handleClose} // Close when clicking the backdrop
        >
          <motion.div
            // Animation properties
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            
            // Clicks inside the modal won't close it
            onClick={onDialogClick}
            className="relative w-full max-w-md p-6 overflow-hidden bg-white rounded-lg shadow-xl"
          >
            {/* --- Header --- */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Contact
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
              {/* --- Avatar Preview --- */}
              <div className="flex justify-center mb-6">
                <Avatar 
                  name={name} 
                  imageUrl={imageUrl} 
                  size="large" 
                />
              </div>

              {/* --- Form Fields --- */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://.../avatar.png"
                />
              </div>

              {/* --- Error Message --- */}
              {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
              )}

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
                  Save Contact
                </button>
              </div>
            </form>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
}

export default AddContactModal;