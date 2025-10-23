import React from 'react';
import { SearchX } from 'lucide-react'; // A nice icon for "no results"

/**
 * A reusable component to show when a list is empty.
 *
 * @param {string} title - The main message (e.g., "No Contacts Found")
 * @param {string} message - A sub-message (e.g., "Try a different search term.")
 * @param {React.ReactNode} [icon] - An optional icon component.
 */
function EmptyState({
  title = 'No Contacts Found',
  message = "We couldn't find any contacts matching your search.",
  icon,
}) {
  // Default icon if none is provided
  const IconComponent = icon || <SearchX size={48} className="text-gray-400" />;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
      <div className="mb-4">
        {IconComponent}
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}

export default EmptyState;