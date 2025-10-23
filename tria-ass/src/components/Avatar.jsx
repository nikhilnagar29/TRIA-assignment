import React from 'react';

/**
 * Generates initials from a name.
 * e.g., "John Doe" -> "JD"
 * e.g., "SingleName" -> "S"
 */
const getInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

/**
 * Generates a consistent background color from a string (name).
 * This ensures "John Doe" always has the same avatar color.
 */
const nameToColor = (name) => {
  if (!name) name = '';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
  ];
  return colors[Math.abs(hash) % colors.length];
};

/**
 * A component to display a contact's avatar.
 * It shows an image if 'imageUrl' is provided,
 * otherwise, it shows a colored circle with the contact's initials.
 */
function Avatar({ imageUrl, name, size = 'medium' }) {
  const initials = getInitials(name);
  const bgColor = nameToColor(name);

  const sizeClasses = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-24 h-24 text-4xl',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.medium;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${selectedSize} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`
        ${selectedSize} ${bgColor} 
        rounded-full 
        flex items-center justify-center 
        font-semibold text-white 
        select-none flex-shrink-0
      `}
    >
      {initials}
    </div>
  );
}

export default Avatar;