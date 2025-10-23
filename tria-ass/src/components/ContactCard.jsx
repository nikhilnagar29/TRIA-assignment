import React, { memo } from 'react';
import Avatar from './Avatar.jsx';

/**
 * A memoized component for a single contact row.
 * NOTE: This version does NOT take a 'style' prop,
 * as positioning is handled by the parent list.
 */
const ContactCard = ({ contact, onClick }) => {
  if (!contact) {
    return null;
  }

  return (
    // No more `style={style}` prop here!
    <div
      className="flex items-center p-3 pr-4 transition-colors border-b border-gray-100 cursor-pointer hover:bg-gray-50 h-full"
      onClick={() => onClick(contact)}
      role="button"
      tabIndex={0}
    >
      {/* --- Avatar --- */}
      <div className="flex-shrink-0 mr-4">
        <Avatar
          name={contact.name}
          imageUrl={contact.imageUrl}
          size="medium"
        />
      </div>

      {/* --- Contact Info --- */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-gray-900 truncate">
          {contact.name}
        </p>
        <p className="text-sm text-gray-500 truncate">{contact.phone}</p>
      </div>
    </div>
  );
};

export default memo(ContactCard);