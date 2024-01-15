<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <CategoryTable
      :categories="categories"
      :deleteCategory="deleteCategory"
      :updateCategory="updateCategory"
      :addCategory="addCategory"
    />
    <CategoryForm @createCategory="createCategory" />
    <ProductTable 
      :products="products" 
      @deleteProduct="deleteProduct" 
      :updateProduct="updateProduct" 
      :addProduct="addProduct" 
    />
    
 
    
    </div>
</template>

<script>
import axios from 'axios';
import CategoryTable from './components/CategoryTable.vue';
import CategoryForm from './components/CategoryForm.vue';
import ProductTable from './components/ProductTable.vue'; // Import your ProductTable component

export default {
  name: 'App',
  components: {
    CategoryTable,
    CategoryForm,
    ProductTable, // Register the ProductTable component
  },
  data() {
    return {
      categories: [],
      products: [], // Initialize the products array
      
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts(); // Fetch products when the component is mounted
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.categories = response.data.categories;
        console.log('Fetched categories:', this.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    async deleteCategory(id) {
      try {
        await axios.delete(`http://localhost:3000/categories/${id}`);
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },

    async createCategory(category) {
      try {
        await axios.post('http://localhost:3000/categories', category);
        this.fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
      }
    },

    async updateCategory(category) {
      try {
        // Call your backend API to update the category
        await axios.put(`http://localhost:3000/categories/${category.id}`, category);
        // Optionally, you can refresh the categories
        this.fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    },

    // New method for adding category
    async addCategory(category) {
      try {
        await axios.post('http://localhost:3000/categories', category);
        this.fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },

    async addProduct(productData) {
      try {
        await axios.post('http://localhost:3000/products', productData);
        await this.fetchProducts();
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },

    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products');
        this.products = response.data.products;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },

    handleOpenUpdatePopup(product) {
      // Implement the logic to open the update popup or perform any other actions
      console.log('Open update popup for product:', product);
    },

    async updateProduct(product) {
      try {
        // Call your backend API to update the product
        await axios.put(`http://localhost:3000/products/${product.id}`, product);
        // Optionally, you can refresh the products
        this.fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },

    async deleteProduct(id) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        this.fetchProducts();
      } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);

        // Optionally, you can display a user-friendly error message
        // and handle the error as needed.
      }
    },

  },
}; 
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
