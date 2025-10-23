import React from 'react';

/**
 * A single skeleton row that mimics the ContactCard layout.
 */
const SkeletonRow = () => (
  <div className="flex items-center p-3 pr-4 border-b border-gray-100">
    {/* --- Skeleton Avatar --- */}
    <div className="flex-shrink-0 mr-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
    </div>

    {/* --- Skeleton Text --- */}
    <div className="flex-1 min-w-0 space-y-2">
      {/* Name placeholder */}
      <div className="h-4 bg-gray-200 rounded-md w-3/5 animate-pulse"></div>
      {/* Phone placeholder */}
      <div className="h-3 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
    </div>
  </div>
);

/**
 * Renders a list of SkeletonRow components.
 *
 * @param {number} count - The number of skeleton rows to display. Defaults to 5.
 */
function SkeletonLoader({ count = 5 }) {
  // Create an array of a specific length to map over
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="w-full h-full" aria-label="Loading contacts...">
      {skeletons.map((index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  );
}

export default SkeletonLoader;