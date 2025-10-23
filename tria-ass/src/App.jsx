import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

// --- Our custom hook (the "brain") ---
import { useContacts } from './hooks/useContacts.jsx';

// --- Our components ---
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import TagBar from './components/TagBar.jsx'; // <-- IMPORT NEW COMPONENT
import ContactList from './components/ContactList.jsx';
import SkeletonLoader from './components/SkeletonLoader.jsx';
import EmptyState from './components/EmptyState.jsx';
import AddContactModal from './components/AddContactModal.jsx';
import ExpandedContact from './components/ExpandedContact.jsx';
import AddTagModal from './components/AddTagModal.jsx';

function App() {
  // --- High-level UI state ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  // --- Initialize our main logic hook ---
  const {
    contacts, totalCount, error, isLoading, isLoadingMore, isSuccess, isError,
    hasNextPage, searchTerm, setSearchTerm, loadMoreContacts, addContact,
    removeContact, toggleFavorite,
    // --- GET NEW STATE AND FUNCTIONS ---
    availableTags,
    currentTag,
    setCurrentTag,
    addNewTag,
    saveNewTag,
    updateContactTags,
  } = useContacts();

  // ... (All handlers remain the same) ...
  const handleOpenSearch = () => setIsSearchActive(true);
  const handleCloseSearch = () => setIsSearchActive(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenAddTagModal = () => setIsAddTagModalOpen(true);
  const handleCloseAddTagModal = () => setIsAddTagModalOpen(false);
  const handleSelectContact = useCallback((contact) => {
    setSelectedContact(contact);
  }, []);
  const handleDeselectContact = useCallback(() => {
    setSelectedContact(null);
  }, []);
  const handleSaveContact = useCallback(
    (contactData) => {
      addContact(contactData);
      setIsModalOpen(false);
    },
    [addContact]
  );
  const handleSaveTag = useCallback(
    (tagName) => {
      saveNewTag(tagName);
      handleCloseAddTagModal(); // Close modal on save
    },
    [saveNewTag] 
  );

  // --- Conditional Content Rendering ---
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader count={8} />;
    }
    if (isError) {
      return (
        <EmptyState
          title="An Error Occurred"
          message={error || 'Could not fetch contacts.'}
        />
      );
    }
    if (isSuccess && contacts.length === 0) {
      let title = 'No Contacts Yet';
      let message = 'Click the "+" icon to add your first contact!';
      if (searchTerm) {
        title = 'No Results Found';
        message = 'Try adjusting your search.';
      } else if (currentTag !== 'All') {
        title = `No Contacts in "${currentTag}"`;
        message = 'Try a different tag or add contacts to this one.';
      }
      return <EmptyState title={title} message={message} />;
    }
    if (isSuccess || isLoadingMore) {
      return (
        <ContactList
          contacts={contacts}
          onContactClick={handleSelectContact}
          loadMore={loadMoreContacts}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
        />
      );
    }
    return null;
  };

  // --- Main Render ---
  return (
    <div className="flex items-center justify-center w-screen h-screen p-0 bg-pink-100 md:p-8">
      <div
        className="
          flex flex-col w-full h-full bg-white overflow-hidden 
          relative 
          md:max-w-md md:h-[90vh] md:max-h-[800px] md:rounded-2xl md:shadow-xl
        "
      >
        {/* --- Header / Search Bar --- */}
        <div className="relative h-16 border-b border-gray-200">
          <AnimatePresence>
            {isSearchActive ? (
              <SearchBar
                key="searchbar"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClose={handleCloseSearch}
              />
            ) : (
              <Header
                key="header"
                onSearchClick={handleOpenSearch}
                onAddClick={handleOpenModal}
              />
            )}
          </AnimatePresence>
        </div>

        {/* --- NEW TAG BAR --- */}
        <TagBar
          tags={availableTags}
          currentTag={currentTag}
          onTagSelect={setCurrentTag}
          onAddTag={handleOpenAddTagModal} // <-- 6. Pass the new handler
        />
        

        {/* --- Main Content Area --- */}
        <main className="relative flex-1 overflow-hidden">
          {renderContent()}
        </main>

        {/* --- Overlays (Modals / Panels) --- */}
        <ExpandedContact
          contact={selectedContact}
          onClose={handleDeselectContact}
          onToggleFavorite={toggleFavorite}
          // --- PASS NEW PROPS ---
          allTags={availableTags}
          onUpdateTags={updateContactTags}
        />

        <AddContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveContact}
        />
        <AddTagModal
          isOpen={isAddTagModalOpen}
          onClose={handleCloseAddTagModal}
          onSave={handleSaveTag}
        />
      </div>
    </div>
  );
}

export default App;