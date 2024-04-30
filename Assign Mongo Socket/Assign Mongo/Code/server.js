const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io'); // Import Socket.io
const port = 3000;
const app = express();


app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});


const userController = require('./controllers/userController');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Body parser middleware

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connection successful"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io and attach it to the HTTP server
const io = socketIo(server);

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Emit a random number every second
    setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 100);
        socket.emit('number', randomNumber);
    }, 1000);

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.post('/post', userController.createUser);
app.get('/success', userController.getAllUsers);
app.get('/edit/:id', userController.editUser);
app.post('/update/:id', userController.updateUser);
app.get('/delete/:id', userController.deleteUser);

// Start the server
server.listen(port, () => {
    console.log("Server started");
});
