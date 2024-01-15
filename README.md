# vue-ts-project
How to start;

# In Docker;
  Navigate to your project root directory in the terminal.
1. [Run: docker compose up --build]
2. [visit http://localhost:8080/]

  

# In computer;
  Navigate to your project root directory in the terminal.
  
  1st step backend / MySQL DB:
    
    Go to the directory:
    Run: cd backend
    
    Install Dependencies:
    Run: npm install
    
    Generate Prisma Server:
    Run: npx prisma generate
    
    Compile TypeScript:
    Run: npm run build
    
    Start DataBase:
    Run: mysql -u root -p new_password -h localhost -P 3306
    
    Run Prisma migrations:
    Run: npx prisma migrate dev
    
    Start your backend:
    Run: npm start

  2nd step frontend:
    
    Go to the directory:
    Run: cd ..
    
    Install Dependencies:
    Run: npm install
        
    Start your frontend:
    Run: npm run serve

  3rd step:
    visit http://localhost:8080/


# Info;

# Backend

## Technologies Used:
- **Fastify:** A web framework for Node.js.
- **Prisma:** An ORM for database access.

## Key Features:
1. **CORS Setup:** CORS (Cross-Origin Resource Sharing) is enabled for all routes.
2. **Routes:**
    - `/categories`: Retrieves all categories and organizes them in a tree structure.
    - `/products`: Retrieves all products.
    - `/categories/:id` and `/products/:id`: Retrieve a specific category or product by ID.
    - `/categories` and `/products`: Create new categories and products.
    - `/categories/:id` and `/products/:id`: Update categories and products by ID.
    - `/categories/:id` and `/products/:id`: Delete categories and products by ID.

# Frontend

## Key Features:
1. **Components:**
    - **CategoryTable:** Displays a table of categories and provides CRUD operations.
    - **CategoryForm:** Allows users to create new categories.
    - **ProductTable:** Displays a table of products and provides CRUD operations.
2. **Data Management:**
    - Fetches and displays categories and products on component mount.
    - Uses Axios to communicate with the backend API for CRUD operations.
3. **Popup Modals:**
    - Modals for updating and adding categories and products are implemented for a user-friendly interface.
4. **CategoryTree Component:**
    - Nested component to display categories in a tree-like structure.
    - Allows expanding/collapsing child categories.
    - Displays related products in a table.

## Files:

- **CategoryTable.vue:**
    1. **Display:**
        - Lists categories in a table format with buttons for CRUD operations.
    2. **Popup Modals:**
        - Modals for updating and adding categories with form fields.

- **CategoryTree.vue:**
    1. **Recursive Component:**
        - Represents a recursive component to display nested categories in a tree structure.
        - Provides buttons for deleting and updating each category.
        - Displays related products in a table.

- **ProductTable.vue:**
    1. **Display:**
        - Lists products in a table format with buttons for CRUD operations.
    2. **Popup Modals:**
        - Modals for updating and adding products with form fields.

# Styling

- **Scoped Styles:**
    - Component-specific styles are scoped to prevent global conflicts.
- **Popup Styling:**
    - Modals are styled for a clean and visually appealing appearance.

# Note:
- Ensure the backend server is running on `http://localhost:3000` before launching the frontend.
- Axios is used for making HTTP requests.
- The code demonstrates best practices for structuring a Vue.js application and communicating with a Fastify backend.
- You may want to customize the styles further based on your design preferences.

This project provides a robust foundation for managing categories and products with a clear separation between the frontend and backend logic.

