import { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import * as api from '../api/contactApi';
import useDebounce from './useDebounce';
import React from 'react';

// --- State Management (Reducer) ---

const initialState = {
  status: 'idle',
  contacts: [],
  page: 1,
  limit: 50,
  totalCount: 0,
  hasNextPage: true,
  searchTerm: '',
  error: null,
  availableTags: [],
  currentTag: 'All',
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_MORE_START: 'FETCH_MORE_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_MORE_SUCCESS: 'FETCH_MORE_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  ADD_CONTACT_OPTIMISTIC: 'ADD_CONTACT_OPTIMISTIC',
  DELETE_CONTACT_OPTIMISTIC: 'DELETE_CONTACT_OPTIMISTIC',
  RESTORE_CONTACT: 'RESTORE_CONTACT',
  UPDATE_CONTACT_OPTIMISTIC: 'UPDATE_CONTACT_OPTIMISTIC',
  SET_TAGS: 'SET_TAGS',
  ADD_TAG_SUCCESS: 'ADD_TAG_SUCCESS',

  // --- 1. KEY CHANGE: MODIFIED/NEW ACTIONS ---
  // This action will be called when filters change
  SET_FILTER: 'SET_FILTER',
  // This action will be called by infinite scroll
  NEXT_PAGE: 'NEXT_PAGE',
};

function contactsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    // --- 2. KEY CHANGE: NEW REDUCER LOGIC ---
    case ACTIONS.SET_FILTER:
      // When a filter changes (search or tag), we reset the list
      return {
        ...state,
        status: 'loading',
        page: 1, // Reset to page 1
        contacts: [], // Clear old contacts
        hasNextPage: true, // Assume we have a next page
        // Set either the new tag or search term
        ...action.payload,
      };
      
    case ACTIONS.NEXT_PAGE:
      // When loading more, just increment the page
      return { ...state, page: state.page + 1 };

    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading', error: null };
    case ACTIONS.FETCH_MORE_START:
      return { ...state, status: 'loadingMore', error: null };
      
    case ACTIONS.FETCH_SUCCESS:
      // This is for page 1 fetches
      return {
        ...state,
        status: 'success',
        contacts: action.payload.contacts,
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.hasNextPage,
        page: action.payload.page,
      };
    case ACTIONS.FETCH_MORE_SUCCESS:
      // This is for page > 1 fetches
      return {
        ...state,
        status: 'success',
        // Append new contacts to the existing list
        contacts: [...state.contacts, ...action.payload.contacts],
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.hasNextPage,
        page: action.payload.page,
      };
    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'error', error: action.payload };
    
    // --- (All other reducers are unchanged) ---
    case ACTIONS.ADD_CONTACT_OPTIMISTIC:
      const newContactsList = [...state.contacts, action.payload]
        .sort((a, b) => a.name.localeCompare(b.name));
      return { ...state, contacts: newContactsList, totalCount: state.totalCount + 1 };
    case ACTIONS.DELETE_CONTACT_OPTIMISTIC:
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload.id),
        totalCount: state.totalCount - 1,
      };
    case ACTIONS.RESTORE_CONTACT:
       const restoredList = [...state.contacts, action.payload]
         .sort((a, b) => a.name.localeCompare(b.name));
      return { ...state, contacts: restoredList, totalCount: state.totalCount + 1 };
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
    contacts, status, page, limit, searchTerm, hasNextPage, totalCount, error,
    availableTags, currentTag
  } = state;

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  // Ref to prevent fetching on initial mount
  const isInitialMount = useRef(true);

  // --- 3. KEY CHANGE: SIMPLIFIED FETCH EFFECT ---
  // This ONE effect is responsible for ALL data fetching
  useEffect(() => {
    // Determine if this is a "load more" action
    const isLoadMore = page > 1;

    // Set the correct status
    dispatch({ type: isLoadMore ? ACTIONS.FETCH_MORE_START : ACTIONS.FETCH_START });

    const fetchApi = async () => {
      try {
        const data = await api.getContacts({ page, limit, search: debouncedSearchTerm, tag: currentTag });
        dispatch({
          type: isLoadMore ? ACTIONS.FETCH_MORE_SUCCESS : ACTIONS.FETCH_SUCCESS,
          payload: data,
        });
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to fetch contacts';
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: errorMsg });
        toast.error(errorMsg);
      }
    }
    
    fetchApi();
    
  }, [page, debouncedSearchTerm, currentTag, limit]); // Removed fetchContacts, which is not stable

  // Effect for fetching tags on load (Unchanged, this is correct)
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await api.getTags();
        dispatch({ type: ACTIONS.SET_TAGS, payload: tags });
      } catch (err) {
        console.error("Failed to fetch tags");
      }
    };
    loadTags();
  }, []);

  
  // --- 4. KEY CHANGE: UPDATED PUBLIC API FUNCTIONS ---
  

  const setSearchTerm = (term) => {
    // This just updates the search term
    dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term });
  };
  
  // This effect resets the page when the *debounced* search term changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Skip on first render
    }
    // Dispatch the filter reset
    dispatch({ type: ACTIONS.SET_FILTER, payload: { searchTerm: debouncedSearchTerm } });
  }, [debouncedSearchTerm]);
  

  const loadMoreContacts = useCallback(() => {
    // This just increments the page
    if (hasNextPage && status !== 'loading' && status !== 'loadingMore') {
      dispatch({ type: ACTIONS.NEXT_PAGE });
    }
  }, [hasNextPage, status]);

  const setCurrentTag = (tag) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: { currentTag: tag } });
  };
  const saveNewTag = async (tagName) => {
    if (!tagName || !tagName.trim()) {
      toast.error("Tag name cannot be empty.");
      return;
    }
    
    const trimmedName = tagName.trim();
    
    // Check if tag already exists (case-insensitive)
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
      toast.error(`Failed to add tag.`);
    }
  };
  
  // --- (All other functions are unchanged and correct) ---
  const addContact = useCallback(async (contactData) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticContact = { ...contactData, id: tempId, isFavorite: false, tags: contactData.tags || [] };
    dispatch({ type: ACTIONS.ADD_CONTACT_OPTIMISTIC, payload: optimisticContact });
    toast.success(`${contactData.name} added`);
    try {
      const newContact = await api.createContact(contactData);
      dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: { id: tempId } });
      dispatch({ type: ACTIONS.ADD_CONTACT_OPTIMISTIC, payload: newContact });
    } catch (err) {
      toast.error(`Failed to add ${contactData.name}`);
      dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: { id: tempId } });
    }
  }, []);

  const reAddContact = useCallback(async (contactData) => {
    dispatch({ type: ACTIONS.RESTORE_CONTACT, payload: contactData });
    try {
      await api.createContact(contactData);
      toast.success(`${contactData.name} restored!`);
    } catch (err) {
      toast.error(`Failed to restore ${contactData.name}`);
      dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: { id: contactData.id } });
    }
  }, []);

  const removeContact = useCallback(async (contactToDelete) => {
    dispatch({ type: ACTIONS.DELETE_CONTACT_OPTIMISTIC, payload: contactToDelete });
    toast.error(
      (t) => (
        <span className="flex flex-col items-center gap-2">
          <span>{`Deleted ${contactToDelete.name}`}</span>
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => {
              reAddContact(contactToDelete);
              toast.dismiss(t.id);
            }}
          >
            Undo
          </button>
        </span>
      ), { duration: 5000 }
    );
    try {
      await api.deleteContact(contactToDelete.id);
    } catch (err) {
      toast.error(`Failed to delete ${contactToDelete.name}. Restoring.`);
      dispatch({ type: ACTIONS.RESTORE_CONTACT, payload: contactToDelete });
    }
  }, [reAddContact]);

  const toggleFavorite = useCallback(async (contact) => {
    // console.log('toggleFavorite', contact);
    const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
    dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: updatedContact });
    try {
      await api.updateContact(contact.id, { isFavorite: updatedContact.isFavorite });
    } catch (err) {
      toast.error(`Failed to update ${contact.name}`);
      dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: contact });
    }
  }, []);

  const addNewTag = () => {
    let tagName = '';
    console.log('addNewTag');
    toast(
      (t) => (
        <form
          className="flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (tagName.trim()) {
              toast.dismiss(t.id);
              toast.loading(`Adding tag "${tagName}"...`);
              try {
                const updatedTags = await api.createTag(tagName);
                dispatch({ type: ACTIONS.ADD_TAG_SUCCESS, payload: updatedTags });
                toast.dismiss();
                toast.success(`Tag "${tagName}" added!`);
              } catch (err) {
                toast.dismiss();
                toast.error(`Failed to add tag.`);
              }
            }
          }}
        >
          <label className="text-sm font-medium">New Tag Name:</label>
          <input
            type="text"
            className="px-2 py-1 text-black border rounded"
            onChange={(e) => (tagName = e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Tag
          </button>
        </form>
      ),
      { duration: Infinity }
    );
  };
  
  const updateContactTags = useCallback(async (contact, newTags) => {
    const updatedContact = { ...contact, tags: newTags };
    dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: updatedContact });
    try {
      await api.updateContact(contact.id, { tags: newTags });
    } catch (err) {
      toast.error(`Failed to update tags for ${contact.name}`);
      dispatch({ type: ACTIONS.UPDATE_CONTACT_OPTIMISTIC, payload: contact });
    }
  }, []);


  return {
    // State values
    contacts,
    totalCount,
    error,
    isLoading: status === 'loading',
    isLoadingMore: status === 'loadingMore',
    isSuccess: status === 'success',
    isError: status === 'error',
    hasNextPage,
    searchTerm,
    availableTags,
    currentTag,
    
    // Actions
    setSearchTerm,
    loadMoreContacts,
    addContact,
    removeContact,
    toggleFavorite,
    setCurrentTag,
    saveNewTag,
    addNewTag,
    updateContactTags,
  };
}