// Variables
const express = require('express');
// Creates app
const app = express();

// This is from socket.io; creates server
const server = require('http').Server(app);
// Uses socket.io for the server
const io = require('socket.io')(server);
// This is used to randomly generate Ids for rooms
const {v4: uuidV4} = require('uuid');

server.listen(process.env.PORT || 3001);

// Sets how the server will handle views
app.set('view engine', 'ejs');

// Sets public folder for server
app.use(express.static('public'));

// On root, render homepage
app.get('/', (req, res) => {
    res.render('index');
});

// On new-room, redirect to a random room
app.get('/new-room', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

// Route for video call rooms
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
})

io.on('connection', socket => {
    // This event is declared in script.js
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        // Emits event "user connected" to everyone on socket (in room) 
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            // Emits event "user discconnected" to everyone on socket (in room) 
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        })
    });

    
});