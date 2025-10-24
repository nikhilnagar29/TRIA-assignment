import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Copy, Trash2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Avatar from './Avatar';

/**
 * @param {object} contact - The contact object.
 * @param {function} onClose - Function to close this view.
 * @param {function} onToggleFavorite - Function to toggle favorite state.
 * @param {string[]} allTags - Array of all available tags.
 * @param {function} onUpdateTags - Function to update contact's tags.
 */
function ExpandedContact({
  contact,
  onClose,
  onToggleFavorite,
  onDelete,
  allTags = [], // Default to empty array
  onUpdateTags,
}) {
  const [justCopied, setJustCopied] = useState(false);

  // --- 1. FIXED: Handle null contact ---
  // Use optional chaining (?.) and provide a default empty array [].
  // This prevents the 'null.tags' error.
  const [localTags, setLocalTags] = useState(contact?.tags || []);
  const [isFavorite, setIsFavorite] = useState(contact?.isFavorite || false);

  // --- 2. FIXED: Handle null contact in useEffect ---
  // This will now safely update localTags when contact changes,
  // or reset it to [] if contact becomes null (e.g., when panel closes)
  useEffect(() => {
    setLocalTags(contact?.tags || []);
    setIsFavorite(contact?.isFavorite || false);
  }, [contact]); // Depend on the whole 'contact' object


  const panelVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.phone);
    setJustCopied(true);
    toast.success('Phone number copied!');
    setTimeout(() => setJustCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(contact);
    onClose();
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    onToggleFavorite(contact);
  }

  // --- Handle Tag Toggle (This logic is fine) ---
  const handleTagToggle = (tagName) => {
    const hasTag = localTags.includes(tagName);

    let newTags = [];

    if (hasTag) {
      newTags = localTags.filter((t) => t !== tagName);
    } else {
      newTags = [...localTags, tagName];
    }
    
    setLocalTags(newTags);
    
    // We still call onUpdateTags, but we check if contact exists first
    if (contact) {
      onUpdateTags(contact, newTags);
    }
  };

  return (
    <AnimatePresence>
      {contact && ( // This check is still important!
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className="absolute inset-0 z-10 flex flex-col w-full h-full bg-gray-50"
        >
          {/* --- Header --- */}
          <header className="flex items-center flex-shrink-0 p-4 border-b border-gray-200">
            <button
              onClick={onClose}
              className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
              aria-label="Back to contacts"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="ml-4 text-xl font-semibold">Contact Details</h2>
          </header>

          {/* --- Main Content --- */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* ... Avatar & Name (No change) ... */}
            <div className="flex flex-col items-center mb-8">
              <Avatar
                name={contact.name}
                imageUrl={contact.imageUrl}
                size="large"
              />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {contact.name}
              </h1>
            </div>

            {/* ... Action Buttons (No change) ... */}
            <div className="flex justify-center mb-8 space-x-4">
              <button
                onClick={handleToggleFavorite}
                className="flex flex-col items-center p-3 text-gray-600 rounded-lg w-24 hover:bg-gray-100"
              >
                <Heart
                  size={24}
                  className={
                    isFavorite ? 'text-red-500 fill-red-500' : ''
                  }
                />
                <span className="mt-1 text-sm">
                  {isFavorite ? 'Favorite' : 'Add Favorite'}
                </span>
              </button>
              <button
                onClick={handleCopy}
                className="flex flex-col items-center p-3 text-gray-600 rounded-lg w-24 hover:bg-gray-100"
              >
                <Copy size={24} />
                <span className="mt-1 text-sm">
                  {justCopied ? 'Copied!' : 'Copy Phone'}
                </span>
              </button>
            </div>

            {/* ... Contact Info (No change) ... */}
            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="pb-3 mb-3 text-lg font-semibold text-gray-900 border-b border-gray-200">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-base text-gray-900">{contact.phone}</p>
                </div>
                {contact.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-base text-gray-900 truncate">
                      {contact.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* --- NEW TAGS SECTION (This logic is fine) --- */}
            {allTags.length > 0 && (
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="pb-3 mb-3 text-lg font-semibold text-gray-900 border-b border-gray-200">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isTagged = localTags.includes(tag); // Reads from safe local state
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`
                          flex items-center px-3 py-1 text-sm font-medium rounded-full
                          transition-colors
                          ${isTagged
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }
                        `}
                      >
                        {isTagged && <Check size={16} className="mr-1 -ml-1" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
          </main>

          {/* --- FIXED FOOTER --- */}
          {/*
            We add `pb-8` (more bottom padding) on mobile to avoid the "safe area" / home bar.
            We reset it to `md:pb-4` on desktop.
            We also add `bg-gray-50` to match the panel's background.
          */}
          <footer className="flex-shrink-0 p-4 pb-8 bg-gray-50 border-t border-gray-200 md:pb-4">
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-full px-4 py-3 font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
            >
              <Trash2 size={20} className="mr-2" />
              Delete Contact
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExpandedContact;