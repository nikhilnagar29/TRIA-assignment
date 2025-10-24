// src/hooks/useContacts.jsx
import { useReducer, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import * as api from '../api/contactApi';
import useDebounce from './useDebounce';
import React from 'react'; // Ensure React is imported if using JSX syntax directly

// --- State Management (Reducer) ---

const initialState = {
  status: 'idle', // 'idle', 'loading', 'loadingMore', 'success', 'error'
  contacts: [],
  page: 1,
  limit: 50,
  totalCount: 0,
  hasNextPage: true,
  searchTerm: '',
  currentTag: 'All', // Added currentTag to initial state
  error: null,
  availableTags: [],
  // Track the *effective* filters used for the current list
  // This helps detect when filters *actually* change for resetting pagination
  appliedFilters: {
    search: '',
    tag: 'All',
  },
};

// --- Actions ---
// Using constants for action types helps prevent typos
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_MORE_START: 'FETCH_MORE_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_MORE_SUCCESS: 'FETCH_MORE_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_CURRENT_TAG: 'SET_CURRENT_TAG',
  ADD_CONTACT_OPTIMISTIC: 'ADD_CONTACT_OPTIMISTIC',
  DELETE_CONTACT_OPTIMISTIC: 'DELETE_CONTACT_OPTIMISTIC',
  RESTORE_CONTACT: 'RESTORE_CONTACT',
  UPDATE_CONTACT_OPTIMISTIC: 'UPDATE_CONTACT_OPTIMISTIC',
  SET_TAGS: 'SET_TAGS',
  ADD_TAG_SUCCESS: 'ADD_TAG_SUCCESS',
  // Removed SET_FILTER and NEXT_PAGE as they are handled differently now
};

// --- Reducer Logic ---
function contactsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      // Reset contacts list when starting a fresh fetch (page 1)
      return {
        ...state,
        status: 'loading',
        error: null,
        contacts: [], // Clear contacts on initial load/filter change
        page: 1,      // Ensure page is 1
        hasNextPage: true, // Assume there's a next page initially
        appliedFilters: action.payload.filters, // Store the filters being applied
      };
    case ACTIONS.FETCH_MORE_START:
      // Don't clear contacts when loading more
      return {
        ...state,
        status: 'loadingMore',
        error: null,
        page: action.payload.page, // Update page number
      };
    case ACTIONS.FETCH_SUCCESS: // Handles BOTH initial load and filter changes
      return {
        ...state,
        status: 'success',
        contacts: action.payload.contacts, // Set the new list
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.hasNextPage,
        // page is already 1 from FETCH_START
      };
    case ACTIONS.FETCH_MORE_SUCCESS:
      return {
        ...state,
        status: 'success',
        // Append new contacts
        contacts: [...state.contacts, ...action.payload.contacts],
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.hasNextPage,
        // page is already updated from FETCH_MORE_START
      };
    case ACTIONS.FETCH_ERROR:
      // Keep existing contacts on error, but show error status
      return { ...state, status: 'error', error: action.payload };

    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case ACTIONS.SET_CURRENT_TAG:
      return { ...state, currentTag: action.payload };

    // --- Optimistic Updates (Unchanged) ---
    case ACTIONS.ADD_CONTACT_OPTIMISTIC: {
      const newContactsList = [...state.contacts, action.payload].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return {
        ...state,
        contacts: newContactsList,
        totalCount: state.totalCount + 1,
      };
    }
    case ACTIONS.DELETE_CONTACT_OPTIMISTIC:
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload.id),
        totalCount: state.totalCount - 1,
      };
    case ACTIONS.RESTORE_CONTACT: {
      const restoredList = [...state.contacts, action.payload].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      return {
        ...state,
        contacts: restoredList,
        totalCount: state.totalCount + 1,
      };
    }
    case ACTIONS.UPDATE_CONTACT_OPTIMISTIC:
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case ACTIONS.SET_TAGS:
      return { ...state, availableTags: action.payload };
    case ACTIONS.ADD_TAG_SUCCESS:
      return { ...state, availableTags: action.payload };

    default:
      return state;
  }
}

// --- The Hook Itself ---
export function useContacts() {
  const [state, dispatch] = useReducer(contactsReducer, initialState);
  const {
    contacts, status, page, limit, searchTerm, currentTag, hasNextPage,
    totalCount, error, availableTags, appliedFilters
  } = state;

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Ref to track if filters have changed since the last fetch
  const filtersChangedRef = useRef(false);
  useEffect(() => {
    // If the debounced term or the tag changes compared to what was last applied, mark filters as changed
    if (debouncedSearchTerm !== appliedFilters.search || currentTag !== appliedFilters.tag) {
      filtersChangedRef.current = true;
    }
  }, [debouncedSearchTerm, currentTag, appliedFilters]);

  // --- Main Data Fetching Effect ---
  // This single effect handles initial load, search, tag filtering, and pagination
  useEffect(() => {
    // Determine if this is a pagination request (load more) or a new filter request
    const isNewFilter = filtersChangedRef.current;
    const targetPage = isNewFilter ? 1 : page; // Reset to page 1 if filters changed
    const isLoadMore = targetPage > 1;

    // Dispatch the appropriate start action
    if (isNewFilter) {
      dispatch({
        type: ACTIONS.FETCH_START,
        payload: { filters: { search: debouncedSearchTerm, tag: currentTag } }
      });
    } else if (isLoadMore) {
      dispatch({ type: ACTIONS.FETCH_MORE_START, payload: { page: targetPage } });
    } else {
       // Initial load case (page 1, no filter change yet)
       dispatch({
        type: ACTIONS.FETCH_START,
        payload: { filters: { search: debouncedSearchTerm, tag: currentTag } }
      });
    }

    const fetchApi = async () => {
      try {
        const data = await api.getContacts({
          page: targetPage,
          limit,
          search: debouncedSearchTerm,
          tag: currentTag,
        });
        dispatch({
          type: isLoadMore ? ACTIONS.FETCH_MORE_SUCCESS : ACTIONS.FETCH_SUCCESS,
          payload: data,
        });
        // Reset the filters changed flag after successful fetch
        if (isNewFilter) {
          filtersChangedRef.current = false;
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch contacts';
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: errorMsg });
        toast.error(errorMsg);
      }
    };

    fetchApi();

    // Dependencies: fetch when page, debounced search, or tag changes
  }, [page, debouncedSearchTerm, currentTag, limit]); // Keep dependencies simple

  // --- Effect for fetching tags on initial load (Unchanged) ---
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await api.getTags();
        dispatch({ type: ACTIONS.SET_TAGS, payload: tags });
      } catch (err) {
        console.error('Failed to fetch tags:', err);
        // Optionally dispatch an error or show a toast
      }
    };
    loadTags();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Action Dispatchers ---

  const setSearchTerm = useCallback((term) => {
    dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term });
  }, []);

  const setCurrentTag = useCallback((tag) => {
    dispatch({ type: ACTIONS.SET_CURRENT_TAG, payload: tag });
  }, []);

  const loadMoreContacts = useCallback(() => {
    if (hasNextPage && status !== 'loading' && status !== 'loadingMore') {
      // Dispatching FETCH_MORE_START triggers the main effect because 'page' changes
      dispatch({ type: ACTIONS.FETCH_MORE_START, payload: { page: page + 1 } });
    }
  }, [hasNextPage, status, page]);

  // --- (Tag creation logic - Unchanged, seems fine) ---
   const saveNewTag = useCallback(async (tagName) => {
    if (!tagName || !tagName.trim()) {
      toast.error("Tag name cannot be empty.");
      return;
    }
    const trimmedName = tagName.trim();
    if (availableTags.some(tag => tag.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error(`Tag "${trimmedName}" already exists.`);
      return;
    }
    const toastId = toast.loading(`Adding tag "${trimmedName}"...`);
    try {
      const updatedTags = await api.createTag(trimmedName);
      dispatch({ type: ACTIONS.ADD_TAG_SUCCESS, payload: updatedTags });
      toast.dismiss(toastId);
      toast.success(`Tag "${trimmedName}" added!`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Failed to add tag "${trimmedName}".`); // More specific error
    }
  }, [availableTags]); // Dependency added


  // --- (CRUD operations - Unchanged, seem fine) ---
    const addContact = useCallback(async (contactData) => {
        // Generate a temporary ID for optimistic UI update
        const tempId = `temp_${Date.now()}`;
        const optimisticContact = { ...contactData, id: tempId, isFavorite: false, tags: contactData.tags || [] };

        dispatch({ type: ACTIONS.ADD_CONTACT_OPTIMISTIC, payload: optimisticContact });
        toast.success(`${contactData.name} added`);

        try {
        const newContact = await api.createContact(contactData);
        // Replace the temporary contact with the real one from the server
        // First remove the temp one (to avoid duplicates if API is slow)
        dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: { id: tempId } });
        // Then add the real one
        dispatch({ type: ACTIONS.ADD_CONTACT_OPTIMISTIC, payload: newContact });
        } catch (err) {
        toast.error(`Failed to save ${contactData.name}. Reverting.`);
        // Revert the optimistic update
        dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: { id: tempId } });
        }
    }, []);

    const reAddContact = useCallback(async (contactData) => {
        // No need for temp ID here, we are restoring a known contact
        dispatch({ type: ACTIONS.RESTORE_CONTACT, payload: contactData });
        try {
        // Use createContact API to re-add it to the backend
        await api.createContact(contactData);
        toast.success(`${contactData.name} restored!`);
        } catch (err) {
        toast.error(`Failed to restore ${contactData.name}. Reverting.`);
        // Revert the restore
        dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: { id: contactData.id } });
        }
  }, []);

  const removeContact = useCallback(async (contactToDelete) => {
    // Optimistically remove from UI
    dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: contactToDelete });

    // Show toast with Undo option
    toast.error(
      (t) => (
        <span className="flex flex-col items-center gap-2">
          <span>{`Deleted ${contactToDelete.name}`}</span>
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => {
              reAddContact(contactToDelete); // Call restore function
              toast.dismiss(t.id); // Dismiss this toast
            }}
          >
            Undo
          </button>
        </span>
      ), { duration: 5000 } // Give user 5 seconds to undo
    );

    // Call the API to delete from backend
    try {
      await api.deleteContact(contactToDelete.id);
      // No success toast needed here, the 'Deleted' message serves that purpose
    } catch (err) {
      toast.error(`Failed to permanently delete ${contactToDelete.name}. Restoring.`);
      // Revert the optimistic removal if API call fails
      dispatch({ type: ACTIONS.RESTORE_CONTACT, payload: contactToDelete });
    }
  }, [reAddContact]); // Dependency added


    const toggleFavorite = useCallback(async (contact) => {
        const originalContact = { ...contact }; // Keep original state for potential revert
        const updatedContact = { ...contact, isFavorite: !contact.isFavorite };

        // Optimistic UI update
        dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: updatedContact });

        try {
        await api.updateContact(contact.id, { isFavorite: updatedContact.isFavorite });
        // Optional: Show success toast if needed
        // toast.success(`${contact.name} updated`);
        } catch (err) {
        toast.error(`Failed to update favorite status for ${contact.name}. Reverting.`);
        // Revert UI update on error
        dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: originalContact });
        }
  }, []);

   const updateContactTags = useCallback(async (contact, newTags) => {
    const originalContact = { ...contact }; // Keep original for revert
    const updatedContact = { ...contact, tags: newTags };

    // Optimistic UI update
    dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: updatedContact });

    try {
      await api.updateContact(contact.id, { tags: newTags });
      // Optional: Success toast
      // toast.success(`Tags updated for ${contact.name}`);
    } catch (err) {
      toast.error(`Failed to update tags for ${contact.name}. Reverting.`);
      // Revert UI update
      dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: originalContact });
    }
  }, []);

  // Return values from the hook
  return {
    // State
    contacts,
    totalCount,
    error,
    isLoading: status === 'loading',
    isLoadingMore: status === 'loadingMore',
    isSuccess: status === 'success' || status === 'idle', // Consider idle also success initially
    isError: status === 'error',
    hasNextPage,
    searchTerm,
    availableTags,
    currentTag,

    // Actions
    setSearchTerm,
    setCurrentTag,
    loadMoreContacts,
    addContact,
    removeContact,
    toggleFavorite,
    saveNewTag, // Expose saveNewTag
    updateContactTags, // Expose updateContactTags
  };
}