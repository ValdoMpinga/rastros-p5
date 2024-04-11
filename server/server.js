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

app.use(cors());

app.use((req, res, next) =>
{
    if (connectedClients < 2)
    {
        express.static(path.join(__dirname, '../public'))(req, res, next);
    } else
    {
        res.status(403).send('Too many connected clients');
    }
});

app.get('/', (req, res) =>
{
    console.log('Request received for /');
    res.send('Hello World');
});

io.on('connection', (socket) =>
{
    connectedClients++;
    console.log('A user connected. Total connected clients:', connectedClients);

    io.emit('join', `Player ${connectedClients}`);


    socket.on('disconnect', () =>
    {
        connectedClients--;
        console.log('A user disconnected. Total connected clients:', connectedClients);
    });

    socket.on('move-piece', (data) =>
    {
        console.log("Piece moved to: " + data);
        io.emit('move-piece', data);
    });


    socket.on('switch-turn', () =>
    {
        console.log("Emmiting switch turn");
        io.emit('switch-turn');
    });
    
    socket.on('announce-winner', (message) =>
    {
        console.log("Announcing winner");
        io.emit('announce-winner',message);
    });


});

server.listen(PORT, () =>
{
    console.log(`Server is running on port ${PORT}`);
});
