<!-- ProductTable.vue -->
<template>
  <div>
    <h2>Product Table</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Picture</th>
          <th>Category ID</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.picture }}</td>
          <td>{{ product.category_id }}</td>
          <td>{{ product.created_at }}</td>
          <td>{{ product.updated_at }}</td>
          <td>
            <button @click="confirmDeleteProduct(product.id)">Delete</button>
            <button @click="openUpdatePopup(product)">Update</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="openAddPopup">Add New Product</button>

    <!-- Add the popup code here -->
    <div v-if="isUpdatePopupOpen" class="popup">
      <div class="popup-content">
        <h2>Update Product</h2>
        <div>
          <label for="updateName">Name:</label>
          <input v-model="updatedProduct.name" type="text" id="updateName" />
        </div>
        <div>
          <label for="updatePicture">Picture:</label>
          <input v-model="updatedProduct.picture" type="text" id="updatePicture" />
        </div>
        <div>
          <label for="updateCategoryId">Category ID:</label>
          <input v-model="updatedProduct.category_id" type="text" id="updateCategoryId" />
        </div>
        <div>
          <button @click="updateProductInPopup">Update</button>
          <button @click="closeUpdatePopup">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Add the popup code here -->
    <div v-if="isAddPopupOpen" class="popup">
      <div class="popup-content">
        <h2>Add New Product</h2>
        <div>
          <label for="addName">Name:</label>
          <input v-model="newProduct.name" type="text" id="addName" />
        </div>
        <div>
          <label for="addPicture">Picture:</label>
          <input v-model="newProduct.picture" type="text" id="addPicture" />
        </div>
        <div>
          <label for="addCategoryId">Category ID:</label>
          <input v-model="newProduct.category_id" type="text" id="addCategoryId" />
        </div>
        <div>
          <button @click="addProductInPopup">Add</button>
          <button @click="closeAddPopup">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    products: Array,
    updateProduct: Function,
    addProduct: Function,
    
  },
  data() {
    return {
      isAddPopupOpen: false,
      isUpdatePopupOpen: false,
      updatedProduct: {
        id: null,
        name: '',
        picture: '',
        category_id: '',
      },
      newProduct: {  // Add this line to initialize newProduct
        name: '',
        picture: '',
        category_id: null,
      },
    };
  },


  methods: {
    openAddPopup() {
      this.isAddPopupOpen = true;
      // Optionally, you can initialize data for the popup here
      // For example, reset the form fields
      this.newProduct = {
        name: '',
        picture: '',
        category_id: null,
      };
    },

    
    closeAddPopup() {
      this.isAddPopupOpen = false;
    },


    deleteProduct(id) {
      this.$emit('deleteProduct', id);
    },
    
    openUpdatePopup(product) {
      // Set the updatedProduct data and open the popup
      this.updatedProduct = { ...product };
      this.isUpdatePopupOpen = true;
    },
    closeUpdatePopup() {
      // Close the popup
      this.isUpdatePopupOpen = false;
    },

    async confirmDeleteProduct(id) {
      try {
        const confirmation = window.confirm('Are you sure you want to delete this product?');
        if (confirmation) {
          // Call the function in the parent component to delete the product
          await this.deleteProduct(id);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        // Optionally, display an error message to the user
      }
    },

    async addProductInPopup() {
      try {
        // Call the function in the parent component to add the product
        await this.addProduct(this.newProduct);

        // After adding the product, close the popup
        this.closeAddPopup();
      } catch (error) {
        console.error('Error adding product in popup:', error);
        // Optionally, display an error message to the user
      }
    },

    async updateProductInPopup() {
      try {
        await this.updateProduct(this.updatedProduct);
        this.closeUpdatePopup();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
