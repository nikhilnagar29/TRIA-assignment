import React from 'react';
import { Plus } from 'lucide-react';

import './Tagbar.css'
/**
 * A horizontal bar for filtering by tags.
 *
 * @param {string[]} tags - List of user-created tags (e.g., ['Family', 'Work'])
 * @param {string} currentTag - The currently active tag
 * @param {function} onTagSelect - Callback when a tag is clicked
 * @param {function} onAddTag - Callback when the '+' button is clicked
 */
function TagBar({ tags, currentTag, onTagSelect, onAddTag }) {
  // We manually add 'All' and 'Favourite' to the list
  const fullTagList = ['All', 'Favourite', ...tags];

  const TagButton = ({ tagName }) => {
    const isActive = currentTag === tagName;
    return (
      <button
        onClick={() => isActive ? onTagSelect('All') : onTagSelect(tagName)}
        className={`
          px-4 py-2 text-sm font-semibold rounded-full
          transition-colors whitespace-nowrap
          ${isActive
            ? 'bg-pink-500 text-white shadow-md'
            : 'bg-white text-pink-600 hover:bg-pink-50'
          }
        `}
      >
        {tagName}
      </button>
    );
  };

  return (
    // This container is baby pink and allows horizontal scrolling
    <div className="w-full px-4 py-3 bg-pink-100 overflow-x-auto hide-scrollbar">
  <div className="flex items-center space-x-2">
    {fullTagList.map((tag) => (
      <TagButton key={tag} tagName={tag} />
    ))}
    <button
      onClick={onAddTag}
      className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-pink-600 shadow-sm hover:bg-pink-50 transition-colors flex-shrink-0"
      aria-label="Add new tag"
    >
      <Plus size={20} />
    </button>
  </div>
</div>

  );
}

export default TagBar;