<template>
  <h2>Categories</h2>
  <div>
    <!-- ... (existing code) -->
    <ul>
      <category-tree
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :deleteCategory="deleteCategory"
        :openUpdatePopup="openUpdatePopup"
      />
    </ul>

    <button @click="openAddPopup">Add New Category</button>

    <!-- Popup for updating category -->
    <div v-if="isUpdatePopupOpen" class="popup">
      <h2>Update Category</h2>
      <div>
        <label for="updateName">Name:</label>
        <input v-model="categoryData.name" type="text" id="updateName" />
      </div>
      <div>
        <label for="updatePicture">Picture:</label>
        <input v-model="categoryData.picture" type="text" id="updatePicture" />
      </div>
      <div>
        <label for="updateParentId">Parent ID:</label>
        <input v-model="categoryData.parent_id" type="text" id="updateParentId" />      
      </div>
      <div>
        <button @click="updateCategoryInPopup">Update</button>
        <button @click="closePopup">Cancel</button>
      </div>
    </div>

    <!-- Popup for adding new category -->
    <div v-if="isAddPopupOpen" class="popup">
      <h2>Add New Category</h2>
      <div>
        <label for="addName">Name:</label>
        <input v-model="categoryData.name" type="text" id="addName" />
      </div>
      <div>
        <label for="addPicture">Picture:</label>
        <input v-model="categoryData.picture" type="text" id="addPicture" />
      </div>
      <div>
        <label for="addParentId">Parent ID:</label>
        <input v-model="categoryData.parent_id" type="text" id="addParentId" />
      </div>
      <div>
        <button @click="addCategoryInPopup">Add</button>
        <button @click="closePopup">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryTree from './CategoryTree.vue';


export default {
  props: {
    categories: Array,
    deleteCategory: Function,
    updateCategory: Function,
    addCategory: Function
  },
  components: {
    CategoryTree
  },

  data() {
    return {
      isUpdatePopupOpen: false,
      isAddPopupOpen: false,
      categoryData: {
        id: null,
        name: '',
        picture: '',
        parent_id: null
      }
    };
  },
  methods: {
    // ... (existing methods)

    openAddPopup() {
      this.isAddPopupOpen = true;
      this.categoryData = {
        id: null,
        name: '',
        picture: '',
        parent_id: null
      };
    },

    openUpdatePopup(category) {
      this.isUpdatePopupOpen = true;
      this.categoryData = {
        id: category.id,
        name: category.name,
        picture: category.picture || '',
        parent_id: category.parent_id || null
      };
    },

    closePopup() {
      this.isUpdatePopupOpen = false;
      this.isAddPopupOpen = false;
      this.categoryData = {
        id: null,
        name: '',
        picture: '',
        parent_id: null
      };
    },

    async addCategoryInPopup() {
      try {
        // Call the function in the parent component to add the product
        await this.addCategory(this.categoryData);

        // After adding the product, close the popup
        this.closePopup();
      } catch (error) {
        console.error('Error adding category in popup:', error);
        // Optionally, display an error message to the user
      }
    },
    async updateCategoryInPopup() {
      try {
        await this.updateCategory(this.categoryData);
        this.closePopup();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  }
};
</script>


<style scoped>
/* Your component-specific styles go here */
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

.category-tree {
  list-style-type: none;
  padding: 0;
}

.add-button {
  margin-top: 10px;
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
