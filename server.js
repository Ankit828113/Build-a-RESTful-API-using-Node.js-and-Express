const express = require('express');
const app = express();
const PORT = 5100;

app.use(express.json()); // Middleware to parse JSON bodies


let users = [
    { id: "1", firstName: "Ankit", lastName: "Kumar", hobby: "Teaching" }
];

// Middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Move to the next middleware or route handler
});

// Routes

// GET /users
app.get('/users', (req, res) => {
    res.status(200).json(users); // Respond with the list of users
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.status(200).json(user); // Respond with user details
    } else {
        res.status(404).json({ message: "User not found" }); // Handle user not found
    }
});

// POST /user
app.post('/user', validateUser, (req, res) => {
    const newUser = { id: (users.length + 1).toString(), ...req.body };
    users.push(newUser); // Add new user to the array
    res.status(201).json(newUser); // Respond with created user
});

// PUT /user/:id
app.put('/user/:id', validateUser, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex !== -1) {
        users[userIndex] = { id: req.params.id, ...req.body }; // Update user details
        res.status(200).json(users[userIndex]); // Respond with updated user
    } else {
        res.status(404).json({ message: "User not found" }); // Handle user not found
    }
});

// DELETE /user/:id
app.delete('/user/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove user from the array
        res.status(204).send(); // Respond with no content
    } else {
        res.status(404).json({ message: "User not found" }); // Handle user not found
    }
});

// Middleware for validation
function validateUser(req, res, next) {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ message: "All fields are required" }); 
    }
    next(); 
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
