// backend/src/app.ts
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { PrismaClient, Category, Product } from '@prisma/client';

interface NewCategory {
  name: string;
  picture: string | null;
  parent_id?: number | null;
}

interface UpdatedCategory {
  id: number;
  name?: string;
  picture?: string | null;
  parent_id?: number | null;
}

const prisma = new PrismaClient();
const server = fastify();

// Enable CORS for all routes
server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

// Define your routes
server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// Get all categories
server.get('/categories', async (request, reply) => {
  const rawCategories = await prisma.category.findMany();

  // Define types
  interface Category {
    id: number;
    name: string;
    picture: string | null;
    parent_id: number | null;
    created_at: Date;  // Change this line
    updated_at: Date;  // Change this line
    children?: Category[];
  }
  

  // Convert flat list of categories to a tree structure
  const buildCategoryTree = (
    categories: Category[],
    parent_id: number | null = null
  ): Category[] => {
    return categories
      .filter(category => category.parent_id === parent_id)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };

  const categories: Category[] = buildCategoryTree(rawCategories);

  return { categories };
});



// Get all products
server.get('/products', async (request, reply) => {
  try {
    const products = await prisma.product.findMany();
    return { products };
  } catch (error) {
    console.error('Error retrieving products:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// Get a specific product by ID
server.get('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!product) {
    reply.status(404).send({ error: 'Product not found' });
    return;
  }

  return { product };
});


// Get a specific category by ID
server.get('/categories/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!category) {
    reply.status(404).send({ error: 'Category not found' });
  }

  return { category };
});

// Create a new category
server.post('/categories', async (request, reply) => {
  const { name, picture, parent_id } = request.body as NewCategory;

  // Ensure parent_id is a number or null
  const newCategory = await prisma.category.create({
    data: {
      name,
      picture,
      parent_id: parent_id !== null && parent_id !== undefined
        ? (typeof parent_id === 'number' ? parent_id : parseInt(parent_id, 10))
        : null,
    },
  });

  return { newCategory };
});


// Create a new product
server.post('/products', async (request, reply) => {
  const { name, picture, category_id } = request.body as {
    name: string;
    picture: string;
    category_id: number | null;
  };

  try {
    // Ensure category_id is a number or null
    const newProduct = await prisma.product.create({
      data: {
        name,
        picture,
        category: {
          connect: category_id !== null && category_id !== undefined
            ? { id: typeof category_id === 'number' ? category_id : parseInt(category_id, 10) }
            : undefined,
        },
        // The database will automatically set created_at and updated_at
      },
    });

    reply.code(201).send({ newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});



// Update a product by ID
server.put('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { name, picture, category_id } = request.body as {
    name?: string;
    picture?: string;
    category_id?: number | null;
  };

  try {
    // Ensure category_id is a number or null
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        picture,
        category: {
          connect: category_id !== null && category_id !== undefined
            ? { id: typeof category_id === 'number' ? category_id : parseInt(category_id, 10) }
            : undefined,
        },
      },
    });

    reply.send({ updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});



// Update a category by ID
server.put('/categories/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { name, picture, parent_id } = request.body as UpdatedCategory;

  // Ensure parent_id is a number or null
  const updatedCategory = await prisma.category.update({
    where: { id: parseInt(id, 10) },
    data: {
      name,
      picture,
      parent_id: parent_id !== null && parent_id !== undefined ? (typeof parent_id === 'number' ? parent_id : parseInt(parent_id, 10)) : null,
    },
  });

  return { updatedCategory };
});

// Delete a product by ID
server.delete('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    // Retrieve the product
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!product) {
      reply.status(404).send({ error: 'Product not found' });
      return;
    }

    // Finally, delete the product
    await prisma.product.delete({ where: { id: parseInt(id, 10) } });

    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});


// Delete a category by ID
server.delete('/categories/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    // Retrieve the category and its related records
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      reply.status(404).send({ error: 'Category not found' });
      return;
    }

    // Delete related child categories
    await Promise.all(
      category.children.map(async (child) => {
        await prisma.category.delete({ where: { id: child.id } });
      })
    );

    // Delete related products
    await Promise.all(
      category.products.map(async (product) => {
        await prisma.product.delete({ where: { id: product.id } });
      })
    );

    // Finally, delete the category
    await prisma.category.delete({ where: { id: parseInt(id, 10) } });

    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});


const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
