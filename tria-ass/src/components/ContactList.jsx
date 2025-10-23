import React, { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2 } from 'lucide-react';
import ContactCard from './ContactCard.jsx';

// Define the height for each row. Must be a fixed number.
const ITEM_HEIGHT = 76; // 76px

function ContactList({
  contacts,
  onContactClick,
  loadMore,
  hasNextPage,
  isLoadingMore,
}) {
  // This ref will be attached to the scrolling element
  const parentRef = useRef(null);

  // The total number of items: contacts + 1 for the loader
  const itemCount = hasNextPage ? contacts.length + 1 : contacts.length;

  // This is the core virtualization hook
  const rowVirtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT, // Our fixed item height
    overscan: 5, // Render 5 extra items above/below the viewport
  });

  // This is our infinite scrolling logic
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // Check if we're near the bottom
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - (ITEM_HEIGHT * 10);

    if (isNearBottom && hasNextPage && !isLoadingMore) {
      loadMore();
    }
  }, [hasNextPage, isLoadingMore, loadMore]);

  return (
    // 1. This is the parent scrolling element.
    // It *must* have h-full and overflow-auto.
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="w-full h-full overflow-auto"
    >
      {/*
        2. This is the inner "spacer" div.
        It must have the total height of all items.
      */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/*
          3. We map over the "virtual items" given by the hook.
          This is *not* the full contacts array.
        */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          // Check if this item is the loader
          const isLoader = virtualItem.index >= contacts.length;
          
          if (isLoader) {
            return (
              <div
                key="loader"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="flex items-center justify-center"
              >
                <Loader2 size={24} className="animate-spin text-blue-600" />
              </div>
            );
          }

          // This is a regular contact item
          const contact = contacts[virtualItem.index];

          return (
            // 4. This wrapper div handles the absolute positioning
            <div
              key={contact.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ContactCard
                contact={contact}
                onClick={onContactClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactList;