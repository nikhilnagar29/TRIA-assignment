import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://tria-assignment.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches contacts.
 * UPDATED to accept a 'tag' parameter.
 */
export const getContacts = async ({ page = 1, limit = 50, search = '', tag = 'All' }) => {

  const response = await api.get('/contacts', {
    params: { page, limit, search, tag }, // Add tag to params
  });

  if(tag !== 'All') {
    console.log('tag is not All ' , tag);
    console.log(response.data);
  }
  return response.data;
};

/**
 * Creates a new contact.
 * (No changes needed)
 */
export const createContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

/**
 * Updates a contact.
 * (No changes needed, it's flexible)
 */
export const updateContact = async (id, updateData) => {
  // updateData can be { isFavorite: ... } or { tags: [...] }
  const response = await api.put(`/contacts/${id}`, updateData);
  return response.data;
};

/**
 * Deletes a contact.
 * (No changes needed)
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// --- NEW FUNCTIONS ---

/**
 * [GET] Fetches the list of all available tags.
 */
export const getTags = async () => {
  const response = await api.get('/tags');
  return response.data; // Returns string[]
};

/**
 * [POST] Creates a new tag.
 * @param {string} tagName
 */
export const createTag = async (tagName) => {
  const response = await api.post('/tags', { tagName });
  return response.data; // Returns updated string[]
};