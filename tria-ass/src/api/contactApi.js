// src/api/contactApi.js
import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://tria-assignment.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches contacts.
 * Accepts page, limit, search, and tag parameters.
 */
export const getContacts = async ({ page = 1, limit = 50, search = '', tag = 'All' }) => {
  // console.log(`API: Fetching page=${page}, limit=${limit}, search="${search}", tag="${tag}"`); // Added log
  try {
    const response = await api.get('/contacts', {
      params: { page, limit, search, tag }, // Pass all params
    });
    // console.log(`API: Received ${response.data.contacts.length} contacts`); // Added log
    return response.data;
  } catch (error) {
    console.error("API Error fetching contacts:", error.response?.data || error.message);
    throw error; // Re-throw the error to be caught by useContacts
  }
};

/**
 * Creates a new contact.
 */
export const createContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

/**
 * Updates a contact (e.g., isFavorite or tags).
 */
export const updateContact = async (id, updateData) => {
  const response = await api.put(`/contacts/${id}`, updateData);
  return response.data;
};

/**
 * Deletes a contact.
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

/**
 * Fetches the list of all available tags.
 */
export const getTags = async () => {
  const response = await api.get('/tags');
  return response.data; // Returns string[]
};

/**
 * Creates a new tag.
 * @param {string} tagName
 */
export const createTag = async (tagName) => {
  const response = await api.post('/tags', { tagName });
  return response.data; // Returns updated string[]
};