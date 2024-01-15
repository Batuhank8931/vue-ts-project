// ProductService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export default {
    
  async getProducts() {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data.products;
  },

  async getProductById(id) {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data.product;
  },

  async createProduct(productData) {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data.createdProduct;
  },

  async updateProduct(id, productData) {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData);
    return response.data.updatedProduct;
  },

  async deleteProduct(id) {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  },
};
