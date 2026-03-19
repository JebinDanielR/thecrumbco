const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Path to our JSON database
const DB_FILE = path.join(__dirname, 'db.json');

// Helper function to load data
function loadData() {
    const dataBuffer = fs.readFileSync(DB_FILE);
    return JSON.parse(dataBuffer.toString());
}

// Helper function to save data
function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* 
  =============
  COURSES ROUTES
  =============
*/

// Get all products (with optional filtering)
app.get('/products', (req, res) => {
    const data = loadData();
    let filteredProducts = data.products;
    
    // Simple query filtering (e.g. ?name=cookie)
    Object.keys(req.query).forEach(key => {
        filteredProducts = filteredProducts.filter(p => 
            p[key] && p[key].toString().toLowerCase().includes(req.query[key].toLowerCase())
        );
    });
    
    res.json(filteredProducts);
});

// Get a course by ID
app.get('/products/:id', (req, res) => {
    const data = loadData();
    const productId = req.params.id;
    const product = data.products.find(p => p.id.toString() === productId.toString());
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add a new product
app.post('/products', (req, res) => {
    const data = loadData();
    const newProduct = req.body;
    // Simple ID generation
    newProduct.id = Date.now().toString();
    data.products.push(newProduct);
    saveData(data);
    res.status(201).json(newProduct);
});

// Update a product
app.put('/products/:id', (req, res) => {
    const data = loadData();
    const productId = req.params.id;
    const index = data.products.findIndex(p => p.id.toString() === productId.toString());
    
    if (index !== -1) {
        data.products[index] = { ...data.products[index], ...req.body };
        saveData(data);
        res.json(data.products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const data = loadData();
    const productId = req.params.id;
    const newProducts = data.products.filter(p => p.id.toString() !== productId.toString());
    
    if (newProducts.length !== data.products.length) {
        data.products = newProducts;
        saveData(data);
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

/* 
  =============
  STUDENTS ROUTES
  =============
*/

// Get all customers (with optional filtering)
app.get('/customers', (req, res) => {
    const data = loadData();
    let filteredCustomers = data.customers;

    // Support for login filtering (email & password)
    if (req.query.email && req.query.password) {
        const user = data.customers.find(c => 
            c.email === req.query.email && c.password === req.query.password
        );
        return res.json(user ? [user] : []);
    }

    // Generic query filtering
    Object.keys(req.query).forEach(key => {
        filteredCustomers = filteredCustomers.filter(c => 
            c[key] && c[key].toString() === req.query[key]
        );
    });

    res.json(filteredCustomers);
});

// Add a new student
app.post('/customers', (req, res) => {
    const data = loadData();
    const newCustomer = req.body;
    // Simple ID generation
    newCustomer.id = Date.now();
    // Initialize enrolledCourses if not present
    newCustomer.enrolledCourses = [];
    data.customers.push(newCustomer);
    saveData(data);
    res.status(201).json(newCustomer);
});

// Add a course to a student's enrolledCourses
app.post('/customers/:customerId/products', (req, res) => {
    const data = loadData();
    const customerId = parseInt(req.params.customerId, 10);
    const customer = data.customers.find(s => s.id === customerId);

    if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
    }

    const { productId } = req.body;
    // Check if the course exists
    const productExists = data.products.some(p => p.id === productId);
    if (!productExists) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Add productId to enrolledCourses if not already there
    if (!customer.enrolledCourses.includes(productId)) {
        customer.enrolledCourses.push(productId);
        saveData(data);
    }

    res.status(200).json(customer);
});

// Get all students for a given course
app.get('/products/:id/customers', (req, res) => {
    const data = loadData();
    const productId = parseInt(req.params.id, 10);

    const enrolledCustomers = data.customers.filter((customer) =>
    customer.enrolledCourses && customer.enrolledCourses.includes(productId)
    );

    res.json(enrolledCustomers);
});

/* 
  =============
  ORDERS ROUTES
  =============
*/

// Get all orders
app.get('/orders', (req, res) => {
    const data = loadData();
    res.json(data.orders || []);
});

// Create a new order
app.post('/orders', (req, res) => {
    const data = loadData();
    const newOrder = req.body;
    
    // Server-side initialization
    newOrder.id = Date.now();
    newOrder.status = 'Pending'; // Default status
    
    if (!data.orders) data.orders = [];
    data.orders.push(newOrder);
    
    saveData(data);
    res.status(201).json(newOrder);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});