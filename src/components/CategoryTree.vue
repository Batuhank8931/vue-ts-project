<!-- CategoryTree.vue -->
<template>
  <li>
    <div class="row justify-content-between">
      <button class="col-4" @click="toggleChildren">
        {{ category.id }} - {{ category.name }} - {{ category.picture }}
      </button>

      <div class="col-4">
        <button @click="confirmDelete">Delete</button>
        <button @click="openUpdatePopup(category)">Update</button>
      </div>


    </div>
    <ul v-show="showChildren && category.children && category.children.length">
      <category-tree
        v-for="childCategory in category.children"
        :key="childCategory.id"
        :category="childCategory"
        :deleteCategory="deleteCategory"
        :openUpdatePopup="openUpdatePopup"
      />
    </ul>

    <!-- Display products as a table -->
    <table v-if="category.products && category.products.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Picture</th>
          <th>Category ID</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in category.products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.picture }}</td>
          <td>{{ product.category_id }}</td>
          <td>{{ product.created_at }}</td>
          <td>{{ product.updated_at }}</td>
        </tr>
      </tbody>
    </table>
  </li>
  
</template>

<script>
export default {
  props: {
    category: Object,
    deleteCategory: Function,
    openUpdatePopup: Function
  },
  data() {
    return {
      showChildren: false
    };
  },
  methods: {
    toggleChildren() {
      this.showChildren = !this.showChildren;
    },
    confirmDelete() {
      const confirmation = window.confirm('Are you sure you want to delete this category?');
      if (confirmation) {
        this.deleteCategory(this.category.id);
      }
    }    
  }
};
</script>

<style scoped>
.category {
  display: flex;
  flex-direction: row;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  margin-bottom: 4px;
}

.details {
  padding: 8px;
}

.actions button {
  margin-left: 8px;
}

ul {
  list-style-type: none;
  margin-left: 16px;
  padding: 0;
}
</style>
