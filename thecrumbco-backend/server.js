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

// Get all courses
app.get('/products', (req, res) => {
    const data = loadData();
    res.json(data.products);
});

// Get a course by ID
app.get('/products/:id', (req, res) => {
    const data = loadData();
    const productId = parseInt(req.params.id, 10);
    const product = data.products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add a new course
app.post('/products', (req, res) => {
    const data = loadData();
    const newProduct = req.body;
    // Simple ID generation if needed
    newProduct.id = Date.now();
    data.products.push(newProduct);
    saveData(data);
    res.status(201).json(newProduct);
});

/* 
  =============
  STUDENTS ROUTES
  =============
*/

// Get all students
app.get('/customers', (req, res) => {
    const data = loadData();
    res.json(data.customers);
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

    // Add courseId to enrolledCourses if not already there
    if (!customer.enrolledProducts.includes(productId)) {
        customer.enrolledProducts.push(productId);
        saveData(data);
    }

    res.status(200).json(customer);
});

// Get all students for a given course
app.get('/products/:id/customers', (req, res) => {
    const data = loadData();
    const productId = parseInt(req.params.id, 10);

    const enrolledcustomers = data.customers.filter((customer) =>
    customer.enrolledProducts && customer.enrolledProducts.includes(productId)
    );

    res.json(enrolledCustomers);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});