"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/app.ts
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const server = (0, fastify_1.default)();
// Enable CORS for all routes
server.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});
// Define your routes
server.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: 'world' };
}));
// Get all categories
server.get('/categories', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const rawCategories = yield prisma.category.findMany();
    // Convert flat list of categories to a tree structure
    const buildCategoryTree = (categories, parent_id = null) => {
        return categories
            .filter(category => category.parent_id === parent_id)
            .map(category => (Object.assign(Object.assign({}, category), { children: buildCategoryTree(categories, category.id) })));
    };
    const categories = buildCategoryTree(rawCategories);
    return { categories };
}));
// Get all products
server.get('/products', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany();
        return { products };
    }
    catch (error) {
        console.error('Error retrieving products:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
}));
// Get a specific product by ID
server.get('/products/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const product = yield prisma.product.findUnique({
        where: { id: parseInt(id, 10) },
    });
    if (!product) {
        reply.status(404).send({ error: 'Product not found' });
        return;
    }
    return { product };
}));
// Get a specific category by ID
server.get('/categories/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const category = yield prisma.category.findUnique({
        where: { id: parseInt(id, 10) },
    });
    if (!category) {
        reply.status(404).send({ error: 'Category not found' });
    }
    return { category };
}));
// Create a new category
server.post('/categories', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, picture, parent_id } = request.body;
    // Ensure parent_id is a number or null
    const newCategory = yield prisma.category.create({
        data: {
            name,
            picture,
            parent_id: parent_id !== null && parent_id !== undefined
                ? (typeof parent_id === 'number' ? parent_id : parseInt(parent_id, 10))
                : null,
        },
    });
    return { newCategory };
}));
// Create a new product
server.post('/products', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, picture, category_id } = request.body;
    try {
        // Ensure category_id is a number or null
        const newProduct = yield prisma.product.create({
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
    }
    catch (error) {
        console.error('Error creating product:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
}));
// Update a product by ID
server.put('/products/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { name, picture, category_id } = request.body;
    try {
        // Ensure category_id is a number or null
        const updatedProduct = yield prisma.product.update({
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
    }
    catch (error) {
        console.error('Error updating product:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
}));
// Update a category by ID
server.put('/categories/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { name, picture, parent_id } = request.body;
    // Ensure parent_id is a number or null
    const updatedCategory = yield prisma.category.update({
        where: { id: parseInt(id, 10) },
        data: {
            name,
            picture,
            parent_id: parent_id !== null && parent_id !== undefined ? (typeof parent_id === 'number' ? parent_id : parseInt(parent_id, 10)) : null,
        },
    });
    return { updatedCategory };
}));
// Delete a product by ID
server.delete('/products/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        // Retrieve the product
        const product = yield prisma.product.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!product) {
            reply.status(404).send({ error: 'Product not found' });
            return;
        }
        // Finally, delete the product
        yield prisma.product.delete({ where: { id: parseInt(id, 10) } });
        reply.status(204).send();
    }
    catch (error) {
        console.error('Error deleting product:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
}));
// Delete a category by ID
server.delete('/categories/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        // Retrieve the category and its related records
        const category = yield prisma.category.findUnique({
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
        yield Promise.all(category.children.map((child) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.category.delete({ where: { id: child.id } });
        })));
        // Delete related products
        yield Promise.all(category.products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.product.delete({ where: { id: product.id } });
        })));
        // Finally, delete the category
        yield prisma.category.delete({ where: { id: parseInt(id, 10) } });
        reply.status(204).send();
    }
    catch (error) {
        console.error('Error deleting category:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on http://localhost:3000');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
start();
