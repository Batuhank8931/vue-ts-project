import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Update with your backend server URL

export default {
  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data.categories;
  },

  async getCategoryById(id) {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
    return response.data.category;
  },

  async createCategory(categoryData) {
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
    return response.data.createdCategory;
  },

  async updateCategory(id, categoryData) {
    const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData);
    return response.data.updatedCategory;
  },

  async deleteCategory(id) {
    await axios.delete(`${API_BASE_URL}/categories/${id}`);
  },
};
