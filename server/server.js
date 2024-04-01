const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3003;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let connectedClients = 0;

// Use the cors middleware with appropriate options
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, '../index.html')); 
});

io.on('connection', (socket) =>
{
    connectedClients++;
    console.log('A user connected. Total connected clients:', connectedClients);

    // Set CORS headers
    socket.handshake.headers.origin = '*'; // Allow requests from any origin

    socket.on('disconnect', () =>
    {
        connectedClients--;
        console.log('A user disconnected. Total connected clients:', connectedClients);
    });

    socket.on('move', (data) =>
    {
        // Handle the move here, update the game state, and broadcast the updated board to all clients
        io.emit('update', data); // Broadcast the updated board to all clients
    });
});


server.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
});
